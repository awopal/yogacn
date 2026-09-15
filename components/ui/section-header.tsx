import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { sectionHeaderStyles } from '@/styles/section-header.stylex';

export function SectionHeader({
  title,
  description,
  action,
  disclaimer,
  titleId,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  disclaimer?: string;
  titleId?: string;
}) {
  return (
    <header {...stylex.props(sectionHeaderStyles.header)}>
      <div {...stylex.props(sectionHeaderStyles.content)}>
        <h2 id={titleId} {...stylex.props(sectionHeaderStyles.title)}>
          {title}
        </h2>
        <p {...stylex.props(sectionHeaderStyles.description)}>{description}</p>
        {disclaimer && <p {...stylex.props(sectionHeaderStyles.disclaimer)}>{disclaimer}</p>}
      </div>
      {action}
    </header>
  );
}
