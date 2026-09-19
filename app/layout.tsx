import type { Metadata } from 'next';
import { Oooh_Baby } from 'next/font/google';
import './globals.css';
import * as stylex from '@stylexjs/stylex';
import { typographyStyles } from '../styles/typography.stylex';
import { ToastProvider } from '@/components/ui/toast';

const ooohBaby = Oooh_Baby({
  variable: '--font-oooh-baby',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'yogacn',
  description: 'A workspace for planning and reviewing yoga classes',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body {...stylex.props(typographyStyles.body)} className={ooohBaby.variable}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
