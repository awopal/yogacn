import localFont from 'next/font/local';

export const commitMono = localFont({
  variable: '--font-commit-mono',
  display: 'swap',
  src: [
    { path: '../public/fonts/CommitMono-400-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/CommitMono-400-Italic.otf', weight: '400', style: 'italic' },
    { path: '../public/fonts/CommitMono-700-Regular.otf', weight: '700 800', style: 'normal' },
    { path: '../public/fonts/CommitMono-700-Italic.otf', weight: '700 800', style: 'italic' },
  ],
});
