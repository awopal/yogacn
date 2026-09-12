import { NextResponse } from 'next/server';
import { z } from 'zod';
import { demoPlans } from '@/lib/server/demo';

const updatePlanSchema = z.object({
  title: z.string().min(2),
  intention: z.string().min(2),
  level: z.enum(['beginner', 'all_levels', 'intermediate', 'advanced']),
  duration: z.number().int().min(10).max(240),
  peakPose: z.string(),
  description: z.string(),
  sections: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      duration: z.number().min(0),
      items: z.array(z.object({ id: z.string(), name: z.string() })),
    }),
  ),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = demoPlans.find((item) => item.id === id);

  if (!plan) {
    return NextResponse.json({ error: 'Class plan not found' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const result = updatePlanSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid class plan data' }, { status: 400 });
  }

  Object.assign(plan, {
    title: result.data.title,
    intention: result.data.intention,
    level: result.data.level,
    plannedDurationMinutes: result.data.duration,
    peakPose: result.data.peakPose,
    description: result.data.description,
    sections: result.data.sections,
  });

  return NextResponse.json({ item: plan });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const planIndex = demoPlans.findIndex((item) => item.id === id);

  if (planIndex === -1) {
    return NextResponse.json({ error: 'Class plan not found' }, { status: 404 });
  }

  demoPlans.splice(planIndex, 1);
  return new Response(null, { status: 204 });
}
