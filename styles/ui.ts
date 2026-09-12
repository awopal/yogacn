import * as stylex from '@stylexjs/stylex';
import { fontWeight } from './tokens.stylex';

export const ui = stylex.create({
  accentMuted: {
    backgroundColor: '#ffffff',
    borderColor: '#1f1235',
    borderRadius: 9,
    borderStyle: 'solid',
    borderWidth: 2,
    padding: 22,
  },
  button: {
    backgroundColor: '#c9bae2',
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 2,
    cursor: 'pointer',
    fontWeight: fontWeight.bold,
    minHeight: 42,
    paddingBlock: 9,
    paddingInline: 16,
  },
  field: { display: 'grid', gap: 7 },
});
