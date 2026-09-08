import type { Metadata } from 'next';
import './globals.css';
import * as stylex from '@stylexjs/stylex';
import { typographyStyles } from '../styles/typography.stylex';

export const metadata: Metadata = {
  title: 'yogacn',
  description: 'A workspace for planning and reviewing yoga classes'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body {...stylex.props(typographyStyles.body)}>{children}</body>
    </html>
  );
}
