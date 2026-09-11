import { NextResponse } from 'next/server';
import { getMoonDays, isValidTimezone, isValidYear } from '../../../lib/moon-days';

export const revalidate = 86400;

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get('year');
  const timezone = searchParams.get('timezone') ?? 'Asia/Bangkok';
  const year = yearParam === null ? new Date().getUTCFullYear() : Number(yearParam);

  if ((yearParam !== null && !/^\d{1,4}$/.test(yearParam)) || !isValidYear(year)) {
    return NextResponse.json({ error: 'year must be an integer from 1 to 9999' }, { status: 400 });
  }

  if (!isValidTimezone(timezone)) {
    return NextResponse.json({ error: 'timezone must be a valid IANA timezone' }, { status: 400 });
  }

  try {
    const moonDays = getMoonDays(year, timezone);
    return NextResponse.json(
      { year, timezone, moonDays },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: 'Unable to calculate moon days for this year' },
      { status: 400 },
    );
  }
}
