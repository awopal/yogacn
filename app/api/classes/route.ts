import { NextResponse } from 'next/server';
import { demoPlans } from '@/lib/server/demo';
import type { PlanStatus } from '@/lib/types';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import type { ClassBuilderDraft } from '@/lib/stores/class-builder-store';

const classDraftSchema = z.object({
  title: z.string().min(2),
  intention: z.string().min(2),
  description: z.string(),
  level: z.enum(['beginner', 'all_levels', 'intermediate', 'advanced']),
  duration: z.number().int().min(10).max(240),
  peakPose: z.string(),
  mode: z.enum(['live', 'recorded', 'hybrid']),
  sections: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      duration: z.number().min(0),
      items: z.array(z.object({ id: z.string(), name: z.string() })),
    }),
  ),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const result = classDraftSchema.safeParse(body);
  if (!result.success)
    return NextResponse.json({ error: 'Invalid class plan data' }, { status: 400 });
  const draft = result.data as ClassBuilderDraft;
  const item = {
    id: randomUUID(),
    title: draft.title,
    intention: draft.intention,
    description: draft.description,
    level: draft.level,
    plannedDurationMinutes: draft.duration,
    peakPose: draft.peakPose,
    status: 'draft' as const,
    isPublished: false,
    taughtCount: 0,
    latestAdjustment: '',
    lastTaughtAt: new Date(),
    sections: draft.sections.map((section, position) => ({
      ...section,
      position,
      items: section.items.map((item, itemPosition) => ({ ...item, position: itemPosition })),
    })),
  };
  demoPlans.unshift(item);
  return NextResponse.json({ item }, { status: 201 });
}

const statuses: PlanStatus[] = ['ready', 'draft', 'taught'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedPage = Number(searchParams.get('page') ?? '1');
  const requestedPageSize = Number(searchParams.get('pageSize') ?? '10');
  const requestedStatus = searchParams.get('status');
  const search = (searchParams.get('search') ?? '').trim().toLowerCase();
  const requestedDelay = Number(searchParams.get('delay') ?? '0');
  const delay = Number.isFinite(requestedDelay)
    ? Math.min(Math.max(Math.floor(requestedDelay), 0), 10_000)
    : 0;
  if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
  const pageSize = Number.isFinite(requestedPageSize)
    ? Math.min(Math.max(Math.floor(requestedPageSize), 1), 50)
    : 10;
  const status = statuses.includes(requestedStatus as PlanStatus)
    ? (requestedStatus as PlanStatus)
    : undefined;
  const searchedPlans = search
    ? demoPlans.filter((plan) =>
        [plan.title, plan.intention, plan.peakPose].some((value) =>
          value.toLowerCase().includes(search),
        ),
      )
    : demoPlans;
  const filteredPlans = status
    ? searchedPlans.filter((plan) => plan.status === status)
    : searchedPlans;
  const total = filteredPlans.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(Math.floor(requestedPage), 1), totalPages)
    : 1;
  const start = (page - 1) * pageSize;

  return NextResponse.json({
    items: filteredPlans.slice(start, start + pageSize),
    page,
    pageSize,
    total,
    totalPages,
    counts: {
      all: searchedPlans.length,
      ready: searchedPlans.filter((plan) => plan.status === 'ready').length,
      draft: searchedPlans.filter((plan) => plan.status === 'draft').length,
      taught: searchedPlans.filter((plan) => plan.status === 'taught').length,
    },
  });
}
