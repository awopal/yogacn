'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import type { SessionAttendance, Yogi } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabStyles } from '@/components/ui/tabs';
import YogiClassHistory from './YogiClassHistory';
import YogiObservationTimeline from './YogiObservationTimeline';
import YogiManager from './YogiManager';
import YogiProfile from './YogiProfile';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { pageStyles } from '@/styles/page.stylex';
import { yogiStyles } from '@/styles/yogi.stylex';
import { typographyStyles } from '@/styles/typography.stylex';

type AttendanceVisit = SessionAttendance & { level?: string };
type YogiTab = 'profile' | 'attendance' | 'observations';

function isYogiTab(value: string | null): value is YogiTab {
  return value === 'profile' || value === 'attendance' || value === 'observations';
}

export default function YogiDetailTabs({
  yogi,
  attendance,
}: {
  yogi: Yogi;
  attendance: AttendanceVisit[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const modeFromUrl = searchParams.get('mode');
  const [activeTab, setActiveTab] = useState<YogiTab>(
    isYogiTab(tabFromUrl) ? tabFromUrl : 'profile',
  );
  const [profile, setProfile] = useState(yogi);
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  useEffect(() => {
    setProfile(yogi);
  }, [yogi]);

  useEffect(() => {
    setActiveTab(isYogiTab(tabFromUrl) ? tabFromUrl : 'profile');
    setIsProfileEditing(
      modeFromUrl === 'edit' && !tabFromUrl
        ? true
        : modeFromUrl === 'edit' && tabFromUrl === 'profile',
    );
  }, [modeFromUrl, tabFromUrl]);

  function updateProfileMode(editing: boolean) {
    setIsProfileEditing(editing);
    const params = new URLSearchParams(searchParams.toString());
    if (editing) {
      params.set('tab', 'profile');
      params.set('mode', 'edit');
    } else {
      params.delete('mode');
    }
    const query = params.toString();
    router.replace(pathname + (query ? '?' + query : ''), { scroll: false });
  }

  function changeTab(value: string) {
    if (!isYogiTab(value)) return;

    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'profile') {
      params.delete('tab');
      params.delete('mode');
    } else {
      params.set('tab', value);
      params.delete('mode');
      if (value !== 'attendance') {
        params.delete('view');
      }
    }

    const query = params.toString();
    router.replace(pathname + (query ? '?' + query : ''), { scroll: false });
  }

  return (
    <>
      <header {...stylex.props(dashboardStyles.dashboardWelcome)}>
        <div>
          <p {...stylex.props(pageStyles.eyebrow)}>
            <Link href="/instructors/yogis" {...stylex.props(pageStyles.backLink)}>
              YOGIS
            </Link>
            <span aria-hidden="true">&nbsp;•&nbsp;</span>
            {profile.displayName}
          </p>
          <h1 {...stylex.props(typographyStyles.h3, pageStyles.titleWithStatus)}>
            {profile.displayName}
            <Badge>{profile.status}</Badge>
          </h1>
          <p {...stylex.props(typographyStyles.muted, dashboardStyles.dashboardIntro)}>
            <span>Member since Mar 2025</span>,&nbsp;
            <strong>12 classes this month</strong>
          </p>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={changeTab} aria-label="Yogi details">
        <TabsList className={stylex.props(yogiStyles.yogiTabsList).className}>
          <TabsTrigger
            value="profile"
            className={stylex.props(activeTab === 'profile' ? TabStyles.active : null).className}
          >
            Yogi Profile
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className={stylex.props(activeTab === 'attendance' ? TabStyles.active : null).className}
          >
            Class attendance
            <span {...stylex.props(TabStyles.badge)} aria-label={attendance.length + ' classes'}>
              {attendance.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="observations"
            className={
              stylex.props(activeTab === 'observations' ? TabStyles.active : null).className
            }
          >
            Instructor observations
          </TabsTrigger>
        </TabsList>

        {activeTab === 'profile' && (
          <div role="tabpanel" aria-label="Yogi profile">
            {isProfileEditing ? (
              <YogiManager
                initialYogis={[profile]}
                open
                onOpenChange={() => undefined}
                profileYogi={profile}
                onProfileSaved={(updatedYogi) => {
                  setProfile(updatedYogi);
                  updateProfileMode(false);
                }}
                onProfileCancel={() => updateProfileMode(false)}
              />
            ) : (
              <YogiProfile yogi={profile} onEdit={() => updateProfileMode(true)} />
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div role="tabpanel" aria-label="Class attendance">
            <YogiClassHistory yogiId={yogi.id} attendance={attendance} />
          </div>
        )}

        {activeTab === 'observations' && (
          <div role="tabpanel" aria-label="Instructor observations">
            <YogiObservationTimeline yogiId={yogi.id} />
          </div>
        )}
      </Tabs>
    </>
  );
}
