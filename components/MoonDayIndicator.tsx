'use client';

import { useEffect, useState } from 'react';
import { Moon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { layoutStyles } from '@/styles/layout.stylex';
import { appStyles } from '@/styles/app.stylex';

const MOON_DAYS_TIMEZONE = 'Asia/Bangkok';
const MOON_DAY_CACHE_KEY = 'yogacn:moon-day-today';

export type MoonDayType = 'new_moon' | 'full_moon';
export type MoonDay = { type: MoonDayType; localDate: string; eventTimeUtc: string };
type MoonDayCache = {
  localDate: string;
  moonDayType: MoonDayType | null;
  timezone: string;
};

function getTodayInTimezone() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    calendar: 'iso8601',
    day: '2-digit',
    month: '2-digit',
    numberingSystem: 'latn',
    timeZone: MOON_DAYS_TIMEZONE,
    year: 'numeric',
  });
  const localDate = formatter.format(new Date());
  return { localDate, year: Number(localDate.slice(0, 4)) };
}

export function MoonDayIndicator() {
  const [moonDayType, setMoonDayType] = useState<MoonDayType | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { localDate, year } = getTodayInTimezone();

    try {
      const cachedValue = window.localStorage.getItem(MOON_DAY_CACHE_KEY);
      if (cachedValue) {
        const cached = JSON.parse(cachedValue) as MoonDayCache;
        if (cached.localDate === localDate && cached.timezone === MOON_DAYS_TIMEZONE) {
          setMoonDayType(cached.moonDayType);
          return () => controller.abort();
        }
        window.localStorage.removeItem(MOON_DAY_CACHE_KEY);
      }
    } catch {
      // Continue with the API request if localStorage is unavailable or corrupted.
    }

    fetch(`/api/moon-days?year=${year}&timezone=${encodeURIComponent(MOON_DAYS_TIMEZONE)}`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { moonDays?: MoonDay[] } | null) => {
        const nextMoonDayType = data?.moonDays?.find((event) => event.localDate === localDate)?.type ?? null;
        setMoonDayType(nextMoonDayType);
        try {
          window.localStorage.setItem(
            MOON_DAY_CACHE_KEY,
            JSON.stringify({ localDate, moonDayType: nextMoonDayType, timezone: MOON_DAYS_TIMEZONE } satisfies MoonDayCache),
          );
        } catch {
          // The icon still works when localStorage is unavailable.
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setMoonDayType(null);
      });

    return () => controller.abort();
  }, []);

  const moonDayLabel =
    moonDayType === 'new_moon'
      ? 'New Moon Day'
      : moonDayType === 'full_moon'
        ? 'Full Moon Day'
        : null;

  return (
    <span
      {...stylex.props(layoutStyles.appHeaderMoonDay)}
      aria-label={moonDayLabel ?? undefined}
      title={moonDayLabel ?? undefined}
    >
      <MoonDayIcon type={moonDayType} />
    </span>
  );
}

export function MoonDayIcon(_props: { type: MoonDayType | null }) {
  return <Moon size={16} aria-hidden="true" {...stylex.props(appStyles.moonDayIcon)} />;
}
