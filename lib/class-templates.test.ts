import { describe, expect, it } from 'vitest';
import { classTemplates, cloneTemplate } from './class-templates';

describe('class templates', () => {
  it('contains the complete 100-minute Ashtanga Primary Series in order', () => {
    const template = classTemplates[0];
    expect(template.name).toBe('Ashtanga Primary Series');
    expect(template.draft.duration).toBe(100);
    expect(template.draft.sections.map((section) => section.name)).toEqual([
      'Opening',
      'Sun Salutations',
      'Standing Sequence',
      'Seated Sequence',
      'Primary Sequence — Continued',
      'Backbending',
      'Finishing Sequence',
      'Final Rest',
    ]);
    expect(template.draft.sections.reduce((sum, section) => sum + section.duration, 0)).toBe(100);
    expect(template.draft.sections[1].items.map((item) => item.name)).toEqual([
      'Surya Namaskara A — 5 rounds',
      'Surya Namaskara B — 5 rounds',
    ]);
  });

  it('clones sections and items with fresh IDs without mutating the source', () => {
    const first = cloneTemplate(classTemplates[0]);
    const second = cloneTemplate(classTemplates[0]);
    const sourceIds = new Set(classTemplates[0].draft.sections.map((section) => section.id));
    const firstIds = first.sections.map((section) => section.id);
    const secondIds = second.sections.map((section) => section.id);

    expect(new Set(firstIds).size).toBe(firstIds.length);
    expect(firstIds.some((id) => sourceIds.has(id))).toBe(false);
    expect(firstIds).not.toEqual(secondIds);
    expect(first.sections[0].items[0].id).not.toBe(second.sections[0].items[0].id);

    first.sections[0].items[0].name = 'Changed locally';
    expect(classTemplates[0].draft.sections[0].items[0].name).toBe('Samasthiti');
  });
});
