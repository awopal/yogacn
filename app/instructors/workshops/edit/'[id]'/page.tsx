import Link from 'next/link';
import { notFound } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { WorkshopForm } from '../../../../components/WorkshopForm';
import { demoWorkshops } from '@/lib/workshops';
import { INSTRUCTOR_ROUTES } from '@/lib/routes';
import { pageStyles } from '@/styles/page.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { dashboardStyles } from '@/styles/dashboard.stylex';

export default async function EditWorkshopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workshop = demoWorkshops.find((item) => item.id === id);
  if (!workshop) notFound();

  return (
    <div {...stylex.props(pageStyles.page, pageStyles.fullHeight)}>
      <header {...stylex.props(dashboardStyles.dashboardWelcome)}>
        <div>
          <p {...stylex.props(pageStyles.eyebrow)}>
            <Link href={INSTRUCTOR_ROUTES.WORKSHOPS.ROOT} {...stylex.props(pageStyles.backLink)}>
              WORKSHOPS
            </Link>{' '}
            <span>•</span> Edit
          </p>
          <h1 {...stylex.props(typographyStyles.h3)}>{workshop.title}</h1>
          <p {...stylex.props(typographyStyles.muted, dashboardStyles.dashboardIntro)}>
            Update workshop details and manage its booking setup.
          </p>
        </div>
      </header>
      <WorkshopForm workshop={workshop} />
    </div>
  );
}
