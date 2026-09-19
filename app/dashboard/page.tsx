import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { demoAttendance, demoPlans, demoStudents } from '../../lib/server/demo';
import { getAttendanceSummary } from '../../lib/server/attendance';
import AppShell from '../components/AppShell';
import { pageStyles } from '@/styles/page.stylex';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { RecentClassesCard } from '../components/dashboard/RecentClassesCard';
import { ClassPlansPreview } from '../components/dashboard/ClassPlansPreview';
import { ActivitySummaryCard } from '../components/dashboard/ActivitySummaryCard';
import { RecentNotesPreview } from '../components/dashboard/RecentNotesPreview';

export default async function DashboardPage() {
  if ((await cookies()).get('yoga_demo_auth')?.value !== '1') redirect('/');
  const attendanceSummary = getAttendanceSummary(demoStudents, demoAttendance);
  // const currentWeekday = new Intl.DateTimeFormat('en-US', {
  //   timeZone: 'Asia/Bangkok',
  //   weekday: 'long',
  // }).format(new Date());

  return (
    <AppShell>
      <div {...stylex.props(pageStyles.page)}>
        <DashboardHeader />

        <div {...stylex.props(dashboardStyles.overviewGrid)}>
          <SummaryCard
            label="Class plans"
            value={demoPlans.length}
            detail="In your library"
            tone="pink"
          />
          <SummaryCard
            label="Recently taught"
            value={demoPlans.filter((plan) => plan.taughtCount > 0).length}
            detail="Classes with activity"
            tone="yellow"
          />
          <SummaryCard
            label="Active students"
            value={attendanceSummary.activeStudents}
            detail="Currently active"
            tone="green"
          />
          <SummaryCard
            label="Total visits"
            value={attendanceSummary.totalVisits}
            detail="Recorded visits"
          />
        </div>

        <div {...stylex.props(dashboardStyles.overviewTwoColumn)}>
          <div {...stylex.props(dashboardStyles.overviewCard)}>
            <RecentClassesCard plans={demoPlans} />
          </div>
          <div {...stylex.props(dashboardStyles.overviewCard, dashboardStyles.overviewAccent)}>
            <ClassPlansPreview plans={demoPlans} />
          </div>
        </div>
        <div {...stylex.props(dashboardStyles.overviewBottom)}>
          <div {...stylex.props(dashboardStyles.overviewCard, dashboardStyles.overviewLavender)}>
            <ActivitySummaryCard summary={attendanceSummary} />
          </div>
          <div {...stylex.props(dashboardStyles.overviewCard)}>
            <RecentNotesPreview students={demoStudents} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
