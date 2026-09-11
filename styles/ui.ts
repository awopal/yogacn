import * as stylex from '@stylexjs/stylex';

export const ui = stylex.create({
  surface: {
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
    fontWeight: 800,
    minHeight: 42,
    paddingBlock: 9,
    paddingInline: 16,
  },
  field: { display: 'grid', gap: 7 },
});
