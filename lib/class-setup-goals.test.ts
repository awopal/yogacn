import { describe, expect, it } from 'vitest';
import {
  getClassBasicsProgress,
  getFlowProgress,
  getSaveProgress,
  getTimeProgress,
} from './class-setup-goals';

const section = (name: string, items: string[]) => ({
  id: name,
  name,
  duration: 10,
  items: items.map((item, index) => ({ id: `${name}-${index}`, name: item })),
});

describe('class setup goals', () => {
  it('uses the existing required basics validation and keeps optional description optional', () => {
    expect(getClassBasicsProgress({ title: '', intention: '', duration: 60 })).toMatchObject({
      status: 'in-progress',
      detail: '1/3 required fields',
      percent: 33,
    });
    expect(
      getClassBasicsProgress({ title: 'Morning flow', intention: 'Grounding', duration: 60 }),
    ).toMatchObject({ status: 'completed', detail: '3/3 required fields', percent: 100 });
    expect(
      getClassBasicsProgress({ title: 'Morning flow', intention: 'x', duration: 60 }).status,
    ).toBe('in-progress');
  });

  it('ignores empty and placeholder sections and poses', () => {
    expect(getFlowProgress([section('New section', ['New pose'])]).status).toBe('not-started');
    expect(getFlowProgress([section('Warm up', ['Cat-Cow'])])).toMatchObject({
      status: 'completed',
      detail: '1 section · 1 pose',
      percent: 100,
    });
    expect(getFlowProgress([section('Warm up', ['New pose'])]).status).toBe('in-progress');
  });

  it('caps time progress at 100% and keeps over-planned time incomplete', () => {
    expect(getTimeProgress(60, 40)).toMatchObject({
      status: 'in-progress',
      percent: 67,
      remaining: 20,
    });
    expect(getTimeProgress(60, 60)).toMatchObject({ status: 'completed', percent: 100, overBy: 0 });
    expect(getTimeProgress(60, 70)).toMatchObject({
      status: 'in-progress',
      percent: 100,
      overBy: 10,
    });
  });

  it('only completes the save goal after a successful save state', () => {
    expect(getSaveProgress('ready', false)).toMatchObject({
      status: 'not-started',
      detail: 'Not ready',
    });
    expect(getSaveProgress('ready', true)).toMatchObject({ detail: 'Ready', percent: 100 });
    expect(getSaveProgress('saving')).toMatchObject({ status: 'in-progress', detail: 'Saving…' });
    expect(getSaveProgress('error').status).toBe('in-progress');
    expect(getSaveProgress('saved')).toMatchObject({ status: 'completed', percent: 100 });
  });
});
