import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { demoAttendance, demoPlans, demoStudents } from '../../lib/server/demo';
import { getAttendanceSummary, getRecentAttendance } from '../../lib/server/attendance';
import { levelLabel, statusLabel } from '../../lib/utils';
import AppShell from '../components/AppShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as stylex from '@stylexjs/stylex';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { pageStyles } from '@/styles/page.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { PencilLineIcon } from '@/components/icons';
import { colors } from '@/styles/tokens.stylex';

export default async function DashboardPage() {
  if ((await cookies()).get('yoga_demo_auth')?.value !== '1') redirect('/login');
  const attendanceSummary = getAttendanceSummary(demoStudents, demoAttendance);
  const currentWeekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Bangkok',
    weekday: 'long'
  }).format(new Date());
  return (
    <AppShell>
      <div {...stylex.props(pageStyles.page)}>
        <div {...stylex.props(pageStyles.pageHead)}>
          <div>
            <p {...stylex.props(pageStyles.eyebrow)}>{currentWeekday} · Your workspace</p>
            <h1 {...stylex.props(typographyStyles.h1)}>Your classes</h1>
            <p {...stylex.props(typographyStyles.muted)}>
              Plan with clarity, teach with focus, then return to reflect.
            </p>
          </div>

          <Button asChild>
            <Link href="/classes/new">＋ Create new class</Link>
          </Button>
        </div>

        <section>
          <div {...stylex.props(pageStyles.sectionHead)}>
            <h2 {...stylex.props(typographyStyles.h2)}>Recently taught</h2>
          </div>
          <div {...stylex.props(dashboardStyles.planList)}>
            {demoPlans.slice(0, 2).map((plan) => (
              <article key={plan.id} {...stylex.props(dashboardStyles.planCard)}>
                <div {...stylex.props(dashboardStyles.planTop)}>
                  <Badge variant={plan.status}>{statusLabel[plan.status]}</Badge>
                  <div {...stylex.props(dashboardStyles.taughtMeta)}>
                    <span {...stylex.props(typographyStyles.muted)}>
                      Taught {plan.taughtCount} times
                    </span>
                    <br />
                    <span {...stylex.props(typographyStyles.muted, typographyStyles.caption)}>
                      last at {new Date(plan.lastTaughtAt).toLocaleDateString('en-US')}
                    </span>
                  </div>
                </div>

                <h3 {...stylex.props(typographyStyles.h2)}>{plan.title}</h3>
                <p {...stylex.props(typographyStyles.body)}>{plan.intention}</p>

                <div {...stylex.props(dashboardStyles.meta)}>
                  <span>{plan.plannedDurationMinutes} min</span>
                  <span>•</span>
                  <span>{levelLabel[plan.level]}</span>
                  <span>•</span>
                  <span>{plan.peakPose || '—'}</span>
                </div>

                {plan.latestAdjustment && (
                  <div {...stylex.props(dashboardStyles.adjustment)}>
                    <strong {...stylex.props(dashboardStyles.adjustmentTitle)}>
                      Adjust next time
                    </strong>
                    <span>{plan.latestAdjustment}</span>
                  </div>
                )}

                <div {...stylex.props(dashboardStyles.actions)}>
                  <Button variant="outline" asChild>
                    <Link
                      aria-label={`Continue editing ${plan.title}`}
                      href={`/classes/${plan.id}/edit`}
                      title="Continue editing"
                    >
                      <PencilLineIcon size={24} color={colors.primary} />
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href={`/classes/${plan.id}/teach`}>Open Teaching Mode →</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section {...stylex.props(dashboardStyles.attendance)}>
          <div {...stylex.props(pageStyles.sectionHead)}>
            <h2 {...stylex.props(typographyStyles.h2)}>Student attendance</h2>
            <span>{attendanceSummary.totalVisits} visits recorded</span>
          </div>
          <div {...stylex.props(dashboardStyles.summaryGrid)}>
            <article {...stylex.props(dashboardStyles.summaryCard, dashboardStyles.summaryGreen)}>
              <span>Active students</span>
              <strong>{attendanceSummary.activeStudents}</strong>
            </article>
            <article {...stylex.props(dashboardStyles.summaryCard, dashboardStyles.summaryPink)}>
              <span>Students attended</span>
              <strong>{attendanceSummary.uniqueStudents}</strong>
            </article>
            <article
              {...stylex.props(dashboardStyles.summaryCard, dashboardStyles.summaryLavender)}
            >
              <span>Total visits</span>
              <strong>{attendanceSummary.totalVisits}</strong>
            </article>
          </div>
          <div {...stylex.props(dashboardStyles.feed)}>
            {getRecentAttendance(demoAttendance).map((entry) => (
              <article key={entry.id} {...stylex.props(dashboardStyles.attendanceItem)}>
                <span {...stylex.props(dashboardStyles.avatar)}>{entry.studentName[0]}</span>
                <div>
                  <strong>{entry.studentName}</strong>
                  <p {...stylex.props(typographyStyles.body)}>{entry.classTitle}</p>
                </div>
                <time>{new Date(entry.attendedAt).toLocaleDateString('en-US')}</time>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
