import { describe, expect, it } from 'vitest';
import { GET } from '../app/api/moon-days/route';

async function getMoonDaysResponse(query: string) {
  return GET(new Request(`http://localhost/api/moon-days${query}`));
}

describe('GET /api/moon-days', () => {
  it('returns astronomical New Moon and Full Moon events', async () => {
    const response = await getMoonDaysResponse('?year=2026&timezone=Asia%2FBangkok');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.moonDays.length).toBeGreaterThan(20);
    expect(new Set(body.moonDays.map((event: { type: string }) => event.type))).toEqual(
      new Set(['new_moon', 'full_moon']),
    );
  });

  it('returns events sorted by UTC event time', async () => {
    const response = await getMoonDaysResponse('?year=2026');
    const body = await response.json();
    const times = body.moonDays.map((event: { eventTimeUtc: string }) =>
      Date.parse(event.eventTimeUtc),
    );

    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it('formats local dates for Asia/Bangkok', async () => {
    const response = await getMoonDaysResponse('?year=2026&timezone=Asia%2FBangkok');
    const body = await response.json();
    const event = body.moonDays[0];

    expect(event.timezone).toBe('Asia/Bangkok');
    expect(event.localDate).toMatch(/^2026-\d{2}-\d{2}$/);
    expect(event.eventTimeLocal).toMatch(/^2026-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+07:00$/);
  });

  it('rejects an invalid timezone', async () => {
    const response = await getMoonDaysResponse('?year=2026&timezone=Not%2FA%20Timezone');

    expect(response.status).toBe(400);
  });

  it('rejects an invalid year', async () => {
    const response = await getMoonDaysResponse('?year=twenty-twenty-six');

    expect(response.status).toBe(400);
  });
});
