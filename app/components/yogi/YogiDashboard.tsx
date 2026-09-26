'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bell,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  Heart,
  Home,
  LibraryBig,
  Play,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';
import { useToast } from '@/components/ui/toast';
import { yogiDashboardStyles as styles } from '@/styles/yogi-dashboard.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { MoonDayIndicator } from '@/components/MoonDayIndicator';
import { layoutStyles } from '@/styles/layout.stylex';

type VideoItem = {
  title: string;
  instructor: string;
  duration: string;
  level: string;
  category: string;
  reason: string;
  image: string;
  badge: BadgeVariant;
};

const videos: VideoItem[] = [
  {
    title: 'Morning Flow',
    instructor: 'Sarah Kim',
    duration: '25 min',
    level: 'Intermediate',
    category: 'Mobility',
    reason: 'Build an energising morning habit',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=84',
    badge: 'ready',
  },
  {
    title: 'Slow & Steady Yoga',
    instructor: 'Mika Chen',
    duration: '35 min',
    level: 'Beginner',
    category: 'Relaxation',
    reason: 'A gentle reset for your body',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=84',
    badge: 'taught',
  },
  {
    title: 'Core & Balance',
    instructor: 'Alex Rivera',
    duration: '20 min',
    level: 'Intermediate',
    category: 'Strength',
    reason: 'Recommended for your progress',
    image:
      'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=84',
    badge: 'draft',
  },
];

const learning = [
  {
    title: 'Foundations of Yoga',
    instructor: 'Sarah Kim',
    progress: 72,
    lessons: '8 of 11 lessons',
    image: videos[0].image,
  },
  {
    title: 'Restorative Evenings',
    instructor: 'Mika Chen',
    progress: 34,
    lessons: '3 of 9 lessons',
    image: videos[1].image,
  },
];

const plan = [
  { day: 'Today', title: 'Morning Flow', detail: '25 min · Mobility', complete: true },
  { day: 'Tomorrow', title: 'Slow & Steady Yoga', detail: '35 min · Relaxation', complete: false },
  { day: 'Friday', title: 'Core & Balance', detail: '20 min · Strength', complete: false },
];

const categories = ['All', 'Mobility', 'Strength', 'Relaxation'];

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function VideoCard({
  item,
  saved,
  onSave,
  onOpen,
}: {
  item: VideoItem;
  saved: boolean;
  onSave: () => void;
  onOpen: () => void;
}) {
  return (
    <Card {...stylex.props(styles.classCard)}>
      <div
        {...stylex.props(styles.classImage)}
        style={{ backgroundImage: `url(${item.image})` }}
        role="img"
        aria-label={`${item.title} with ${item.instructor}`}
      >
        <Badge variant={item.badge}>
          <Sparkles size={12} aria-hidden="true" /> Recommended
        </Badge>
        <Button
          variant="secondary"
          size="sm"
          aria-label={`${saved ? 'Remove' : 'Save'} ${item.title}`}
          aria-pressed={saved}
          onClick={onSave}
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
        </Button>
      </div>
      <div {...stylex.props(styles.classBody)}>
        <div {...stylex.props(styles.classHeading)}>
          <div>
            <h3 {...stylex.props(styles.classTitle)}>{item.title}</h3>
            <p {...stylex.props(styles.recommendationReason)}>{item.reason}</p>
          </div>
          <span {...stylex.props(styles.instructorAvatar)} aria-hidden="true">
            {item.instructor.charAt(0)}
          </span>
        </div>
        <div {...stylex.props(styles.meta)}>
          <span {...stylex.props(styles.metaItem)}>
            <Clock3 size={15} aria-hidden="true" />
            {item.duration}
          </span>
          <span {...stylex.props(styles.metaItem)}>
            <SlidersHorizontal size={15} aria-hidden="true" />
            {item.level}
          </span>
          <span>{item.instructor}</span>
        </div>
        <Button size="md" onClick={onOpen}>
          <Play size={15} fill="currentColor" aria-hidden="true" />
          Start practice
        </Button>
      </div>
    </Card>
  );
}

export default function YogiDashboard() {
  const toastManager = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [savedVideos, setSavedVideos] = useState<string[]>(['Slow & Steady Yoga']);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredVideos = useMemo(
    () =>
      videos.filter((item) => {
        const matchesCategory = category === 'All' || item.category === category;
        const matchesSearch =
          !normalizedSearch ||
          `${item.title} ${item.instructor} ${item.level} ${item.category}`
            .toLowerCase()
            .includes(normalizedSearch);
        return matchesCategory && matchesSearch;
      }),
    [category, normalizedSearch],
  );

  function toggleSaved(title: string) {
    setSavedVideos((current) =>
      current.includes(title) ? current.filter((item) => item !== title) : [...current, title],
    );
  }
  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function openPractice(title: string) {
    toastManager.add({
      title: 'Practice ready',
      description: `${title} is ready when you are.`,
      type: 'success',
    });
  }
  function markComplete(title: string) {
    toastManager.add({
      title: 'Practice logged',
      description: `${title} was added to your practice history.`,
      type: 'success',
    });
  }

  return (
    <main {...stylex.props(styles.appPage)}>
      <div {...stylex.props(styles.shell)}>
        <div {...stylex.props(styles.workspace)}>
          <section {...stylex.props(styles.welcome)}>
            <div {...stylex.props(layoutStyles.appHeaderTitle, typographyStyles.body)}>
              <span {...stylex.props(typographyStyles.brand)}>yogacn</span>
              <MoonDayIndicator />
              <p {...stylex.props(styles.welcomeTitle)}>{getGreeting()}, James</p>
            </div>
            <div {...stylex.props(styles.welcomeActions)}>
              <Button variant="ghost" size="sm" aria-label="Notifications">
                <Bell size={20} aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="sm" aria-label="Open profile">
                <UserRound size={20} aria-hidden="true" />
              </Button>
            </div>
          </section>

          <div id="yogi-overview" {...stylex.props(styles.contentColumn)}>
            <section {...stylex.props(styles.dashboardHero)} aria-labelledby="hero-title">
              <div {...stylex.props(styles.continueCard)}>
                <div {...stylex.props(styles.continueCopy)}>
                  <Badge variant="ready">Continue your practice</Badge>
                  <h1 id="hero-title" {...stylex.props(styles.heroTitle)}>
                    Foundations of Yoga
                  </h1>
                  <p {...stylex.props(styles.heroDescription)}>
                    Pick up where you left off and keep your practice moving.
                  </p>
                  <div {...stylex.props(styles.progressRow)}>
                    <span>Lesson 8 of 11</span>
                    <strong>72%</strong>
                  </div>
                  <div {...stylex.props(styles.progressTrack)}>
                    <span {...stylex.props(styles.progressTrackFill)} style={{ width: '72%' }} />
                  </div>
                  <Button size="md" onClick={() => openPractice('Foundations of Yoga')}>
                    <Play size={15} fill="currentColor" aria-hidden="true" />
                    Continue learning
                  </Button>
                </div>
                <div
                  {...stylex.props(styles.continueArt)}
                  style={{ backgroundImage: `url(${videos[0].image})` }}
                  role="img"
                  aria-label="Yoga practice"
                />
              </div>
              <div {...stylex.props(styles.metricsCard)}>
                <div {...stylex.props(styles.metricHeader)}>
                  <span>My practice</span>
                  <Target size={18} aria-hidden="true" />
                </div>
                <div {...stylex.props(styles.metricGrid)}>
                  <div>
                    <strong>8</strong>
                    <span>Sessions</span>
                  </div>
                  <div>
                    <strong>120</strong>
                    <span>Minutes</span>
                  </div>
                  <div>
                    <strong>4</strong>
                    <span>Day streak</span>
                  </div>
                </div>
                <div {...stylex.props(styles.streakNote)}>
                  <Flame size={16} aria-hidden="true" />
                  You are building a great habit
                </div>
              </div>
            </section>

            <section id="classes" aria-labelledby="featured-title">
              <SectionHeader
                title="Recommended for you"
                titleId="featured-title"
                description="Practice suggestions based on your goals and recent sessions."
                action={
                  <Button variant="ghost" size="sm" onClick={() => scrollToSection('classes')}>
                    View all <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                }
              />
              <div {...stylex.props(styles.filterBar)}>
                <div {...stylex.props(styles.categoryTabs)}>
                  {categories.map((item) => (
                    <Button
                      key={item}
                      variant={category === item ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setCategory(item)}
                      aria-pressed={category === item}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
                <div {...stylex.props(styles.searchWrap)}>
                  <Search size={16} aria-hidden="true" />
                  <Input
                    {...stylex.props(styles.searchInput)}
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search practices"
                    aria-label="Search practices"
                  />
                </div>
              </div>
              {filteredVideos.length > 0 ? (
                <div {...stylex.props(styles.classGrid)}>
                  {filteredVideos.map((item) => (
                    <VideoCard
                      key={item.title}
                      item={item}
                      saved={savedVideos.includes(item.title)}
                      onSave={() => toggleSaved(item.title)}
                      onOpen={() => openPractice(item.title)}
                    />
                  ))}
                </div>
              ) : (
                <div {...stylex.props(styles.emptyState)}>
                  <Search size={28} aria-hidden="true" />
                  <strong>No practices found</strong>
                  <span>Try another goal, level or practice name.</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearch('');
                      setCategory('All');
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </section>

            <section id="learning" {...stylex.props(styles.twoColumnSection)}>
              <div>
                <SectionHeader
                  title="My learning"
                  titleId="learning-title"
                  description="Your courses in progress."
                  action={
                    <Button variant="ghost" size="sm" onClick={() => scrollToSection('learning')}>
                      Library <ArrowRight size={16} aria-hidden="true" />
                    </Button>
                  }
                />
                <div {...stylex.props(styles.learningList)}>
                  {learning.map((item) => (
                    <Card key={item.title} {...stylex.props(styles.learningRow)}>
                      <div
                        {...stylex.props(styles.learningThumb)}
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      <div {...stylex.props(styles.learningCopy)}>
                        <strong>{item.title}</strong>
                        <span>
                          {item.instructor} · {item.lessons}
                        </span>
                        <div {...stylex.props(styles.progressTrack)}>
                          <span
                            {...stylex.props(styles.progressTrackFill)}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                      <strong {...stylex.props(styles.learningPercent)}>{item.progress}%</strong>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Continue ${item.title}`}
                        onClick={() => openPractice(item.title)}
                      >
                        <ChevronRight size={18} />
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
              <Card {...stylex.props(styles.studyCraftCard)}>
                <div {...stylex.props(styles.studyCraftHeader)}>
                  <div>
                    <span {...stylex.props(styles.studyCraftKicker)}>Your practice plan</span>
                    <h2 id="plan-title" {...stylex.props(styles.studyCraftTitle)}>
                      Study Craft
                    </h2>
                  </div>
                  <Button variant="ghost" size="sm" aria-label="Open practice plan">
                    <SlidersHorizontal size={17} aria-hidden="true" />
                  </Button>
                </div>
                <div {...stylex.props(styles.studyCraftVisual)}>
                  <span {...stylex.props(styles.studyCraftOrb, styles.studyCraftOrbPrimary)}>
                    <Target size={22} aria-hidden="true" />
                  </span>
                  <span {...stylex.props(styles.studyCraftOrb, styles.studyCraftOrbAccent)}>
                    <Sparkles size={18} aria-hidden="true" />
                  </span>
                  <span {...stylex.props(styles.studyCraftOrb, styles.studyCraftOrbSecondary)}>
                    <Heart size={18} aria-hidden="true" />
                  </span>
                  <span {...stylex.props(styles.studyCraftPlus)}>+</span>
                </div>
                <div {...stylex.props(styles.studyCraftSummary)}>
                  <div>
                    <strong>Starter plan</strong>
                    <span>3 flexible practices this week</span>
                  </div>
                  <Badge variant="private">1 of 3 done</Badge>
                </div>
                <div {...stylex.props(styles.studyCraftProgress)}>
                  <span {...stylex.props(styles.progressTrackFill)} style={{ width: '33%' }} />
                </div>
                <div {...stylex.props(styles.studyCraftPlanList)}>
                  {plan.map((item) => (
                    <div key={item.title} {...stylex.props(styles.planRow)}>
                      <span
                        {...stylex.props(item.complete ? styles.planCheckDone : styles.planCheck)}
                      >
                        {item.complete ? <Check size={14} /> : null}
                      </span>
                      <div>
                        <strong>{item.title}</strong>
                        <span>
                          {item.day} · {item.detail}
                        </span>
                      </div>
                      {item.complete ? (
                        <Badge variant="ready">Done</Badge>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => markComplete(item.title)}>
                          Log practice
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            <section
              id="saved"
              aria-labelledby="saved-title"
              {...stylex.props(styles.savedSection)}
            >
              <SectionHeader
                title="Saved for later"
                titleId="saved-title"
                description="Practices you want to come back to."
                action={
                  <Button variant="ghost" size="sm" onClick={() => scrollToSection('saved')}>
                    View saved <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                }
              />
              <div {...stylex.props(styles.savedList)}>
                {videos
                  .filter((item) => savedVideos.includes(item.title))
                  .map((item) => (
                    <button
                      type="button"
                      key={item.title}
                      {...stylex.props(styles.savedItem)}
                      onClick={() => openPractice(item.title)}
                    >
                      <span {...stylex.props(styles.savedIcon)}>
                        <BookmarkCheck size={18} aria-hidden="true" />
                      </span>
                      <span>
                        <strong>{item.title}</strong>
                        <small>
                          {item.duration} · {item.category}
                        </small>
                      </span>
                      <Play size={16} aria-hidden="true" />
                    </button>
                  ))}
              </div>
            </section>
          </div>
        </div>
        <nav {...stylex.props(styles.mobileNav)} aria-label="Mobile yogi navigation">
          <a href="#yogi-overview" aria-label="Overview" {...stylex.props(styles.mobileNavLink)}>
            <Home size={22} />
          </a>
          <a href="#classes" aria-label="Explore practices" {...stylex.props(styles.mobileNavLink)}>
            <LibraryBig size={22} />
          </a>
          <a href="#learning" aria-label="My learning" {...stylex.props(styles.mobileNavLink)}>
            <Target size={22} />
          </a>
          <a href="#saved" aria-label="Saved practices" {...stylex.props(styles.mobileNavLink)}>
            <Bookmark size={22} />
          </a>
        </nav>
      </div>
    </main>
  );
}
