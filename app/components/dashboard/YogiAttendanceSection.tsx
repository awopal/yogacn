import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import type { ClassPlan, SessionAttendance } from '../../../lib/types';
import type { AttendanceSummary } from '../../../lib/server/attendance';
import { getRecentAttendance } from '../../../lib/server/attendance';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { pageStyles } from '@/styles/page.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { CalendarCheckIcon, SealCheckIcon, UserCircleCheckIcon } from '@/components/icons';
import { colors } from '@/styles/tokens.stylex';
import { INSTRUCTOR_ROUTES } from '@/lib/routes';

export function YogiAttendanceSection({
  attendance,
  plans,
  summary,
}: {
  attendance: SessionAttendance[];
  plans: ClassPlan[];
  summary: AttendanceSummary;
}) {
  const dateFormatter = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
  });
  const dateLabelFormatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Bangkok',
    weekday: 'short',
  });
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return { date, key: dateFormatter.format(date) };
  });
  const weekKeys = new Set(weekDays.map((day) => day.key));
  const sessionsByDate = getRecentAttendance(attendance).reduce((days, entry) => {
    const dateKey = dateFormatter.format(new Date(entry.attendedAt));
    if (!weekKeys.has(dateKey)) return days;

    const day = days.get(dateKey) ?? {
      classes: new Map<string, SessionAttendance[]>(),
      date: new Date(entry.attendedAt),
    };
    const classAttendance = day.classes.get(entry.classTitle) ?? [];
    day.classes.set(entry.classTitle, [...classAttendance, entry]);
    days.set(dateKey, day);
    return days;
  }, new Map<string, { date: Date; classes: Map<string, SessionAttendance[]> }>());
  const hours = Array.from({ length: 12 }, (_, index) => index + 8);
  const planByTitle = new Map(plans.map((plan) => [plan.title, plan]));
  const classSessions = Array.from(sessionsByDate.entries()).flatMap(([dateKey, day]) =>
    Array.from(day.classes.entries()).map(([classTitle, entries]) => {
      const start = new Date(
        Math.min(...entries.map((entry) => new Date(entry.attendedAt).getTime())),
      );
      const startHour = Number(
        new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          hourCycle: 'h23',
          timeZone: 'Asia/Bangkok',
        }).format(start),
      );
      const duration = planByTitle.get(classTitle)?.plannedDurationMinutes ?? 60;
      return { classTitle, dateKey, duration, entries, startHour };
    }),
  );

  return (
    <section {...stylex.props(dashboardStyles.attendance)}>
      <div {...stylex.props(pageStyles.sectionHead)}>
        <h2 {...stylex.props(typographyStyles.h2)}>Teaching timeline</h2>
        <span {...stylex.props(typographyStyles.muted)}>Last 7 days</span>
      </div>

      <div {...stylex.props(dashboardStyles.summaryGrid)}>
        <article {...stylex.props(dashboardStyles.summaryCard, dashboardStyles.summaryGreen)}>
          <div {...stylex.props(dashboardStyles.summaryTop)}>
            <span {...stylex.props(dashboardStyles.summaryLabel)}>Active yogis</span>
            <strong {...stylex.props(dashboardStyles.summaryCount)}>{summary.activeYogis}</strong>
            <span {...stylex.props(dashboardStyles.summaryNote)}>Currently active</span>
          </div>
          <span {...stylex.props(dashboardStyles.summaryIcon)} aria-hidden="true">
            <UserCircleCheckIcon size={62} color={colors.primary} />
          </span>
        </article>
        <article {...stylex.props(dashboardStyles.summaryCard, dashboardStyles.summaryPink)}>
          <div {...stylex.props(dashboardStyles.summaryTop)}>
            <span {...stylex.props(dashboardStyles.summaryLabel)}>Yogis attended</span>
            <strong {...stylex.props(dashboardStyles.summaryCount)}>{summary.uniqueYogis}</strong>
            <span {...stylex.props(dashboardStyles.summaryNote)}>This month</span>
          </div>
          <span {...stylex.props(dashboardStyles.summaryIcon)} aria-hidden="true">
            <CalendarCheckIcon size={62} color={colors.primary} />
          </span>
        </article>
        <article {...stylex.props(dashboardStyles.summaryCard, dashboardStyles.summaryLavender)}>
          <div {...stylex.props(dashboardStyles.summaryTop)}>
            <span {...stylex.props(dashboardStyles.summaryLabel)}>Total visits</span>
            <strong {...stylex.props(dashboardStyles.summaryCount)}>{summary.totalVisits}</strong>
            <span {...stylex.props(dashboardStyles.summaryNote)}>Recorded visits</span>
          </div>
          <span {...stylex.props(dashboardStyles.summaryIcon)} aria-hidden="true">
            <SealCheckIcon size={62} color={colors.primary} />
          </span>
        </article>
      </div>

      <div {...stylex.props(dashboardStyles.weeklyTimeline)}>
        <div {...stylex.props(dashboardStyles.teachingBoardHeader)}>
          <span>Time</span>

          {weekDays.map((day) => (
            <time key={day.key} dateTime={day.key}>
              {dateLabelFormatter.format(day.date)}
            </time>
          ))}
        </div>

        <div {...stylex.props(dashboardStyles.teachingBoardGrid)}>
          <div {...stylex.props(dashboardStyles.teachingTimeColumn)}>
            {hours.map((hour) => (
              <time key={hour}>
                {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
              </time>
            ))}
          </div>

          {weekDays.map((day) => (
            <div key={day.key} {...stylex.props(dashboardStyles.teachingDayColumn)}>
              {hours.map((hour) => (
                <div key={hour} {...stylex.props(dashboardStyles.teachingGridCell)} />
              ))}
              {classSessions
                .filter((session) => session.dateKey === day.key)
                .filter((session) => session.startHour >= 8 && session.startHour < 20)
                .map((session) => (
                  <div
                    key={`${day.key}-${session.classTitle}`}
                    {...stylex.props(dashboardStyles.teachingSession)}
                    style={{
                      gridRow: `${session.startHour - 8 + 1} / span ${Math.max(1, Math.ceil(session.duration / 60))}`,
                    }}
                  >
                    <strong>{session.classTitle}</strong>
                    <span>{session.entries.length} yogis</span>
                    <div {...stylex.props(dashboardStyles.teachingYogis)}>
                      {session.entries.slice(0, 4).map((entry) => (
                        <Link
                          key={entry.id}
                          href={INSTRUCTOR_ROUTES.YOGIS.BY_ID(entry.yogiId)}
                          aria-label={`${entry.yogiName}, ${session.classTitle}`}
                          title={entry.yogiName}
                          {...stylex.props(dashboardStyles.weeklyAvatarLink)}
                        >
                          <span {...stylex.props(dashboardStyles.avatar)}>{entry.yogiName[0]}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
