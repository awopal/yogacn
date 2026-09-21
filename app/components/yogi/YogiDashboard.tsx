'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Coffee,
  Heart,
  Home,
  LibraryBig,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import { Popover } from 'radix-ui';
import * as stylex from '@stylexjs/stylex';
import { SummaryCard } from '@/app/components/dashboard/SummaryCard';
import { YogaLogoIcon } from '@/components/icons';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast';
import { yogiDashboardStyles as styles } from '@/styles/yogi-dashboard.stylex';
import { colors } from '@/styles/tokens.stylex';

type ClassItem = {
  title: string;
  instructor: string;
  duration: string;
  level: string;
  reason: string;
  image: string;
  badge: BadgeVariant;
};

const classes: ClassItem[] = [
  {
    title: 'Morning Flow',
    instructor: 'Sarah Kim',
    duration: '45 min',
    level: 'Intermediate',
    reason: 'Because you liked Restorative Yoga',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=84',
    badge: 'ready',
  },
  {
    title: 'Yin Yoga',
    instructor: 'Mika Chen',
    duration: '60 min',
    level: 'Beginner',
    reason: 'Because you follow Mika Chen',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=84',
    badge: 'taught',
  },
  {
    title: 'Power Flow',
    instructor: 'Alex Rivera',
    duration: '60 min',
    level: 'Advanced',
    reason: 'A good match for your practice',
    image:
      'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=84',
    badge: 'draft',
  },
];

const bookings = [
  {
    title: 'Restorative Yoga',
    detail: 'Sat, Jan 24 · 17:30–18:30',
    instructor: 'Mika Chen',
    state: 'Confirmed',
  },
  {
    title: 'Hatha Yoga',
    detail: 'Sun, Jan 25 · 10:00–11:00',
    instructor: 'Sarah Kim',
    state: 'Upcoming',
  },
];

const instructors = [
  { name: 'Sarah Kim', focus: 'Vinyasa · Mobility', classes: '8 classes available' },
  { name: 'Mika Chen', focus: 'Yin · Restorative', classes: '5 classes available' },
];

const monthDays = [
  29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  25, 26, 27, 28, 29, 30, 31, 1,
];

const schedule = [
  { time: '08:00', title: 'Morning Flow', instructor: 'Sarah Kim', variant: 'ready' as const },
  { time: '10:00', title: 'Beginner Yoga', instructor: 'Mika Chen', variant: 'private' as const },
  {
    time: '13:00',
    title: 'Lunch break',
    instructor: 'Take time for yourself',
    variant: 'private' as const,
    break: true,
  },
  { time: '17:30', title: 'Vinyasa Flow', instructor: 'Alex Rivera', variant: 'draft' as const },
  { time: '19:00', title: 'Yin Yoga', instructor: 'Mika Chen', variant: 'taught' as const },
];

function ClassCard({
  item,
  saved,
  onSave,
  onBook,
}: {
  item: ClassItem;
  saved: boolean;
  onSave: () => void;
  onBook: () => void;
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
          <Sparkles size={12} aria-hidden="true" />
          Recommended
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
        <Button size="md" onClick={onBook}>
          Book class
        </Button>
      </div>
    </Card>
  );
}

function ScheduleRailContent({ titleId = 'schedule-title' }: { titleId?: string }) {
  return (
    <>
      <div {...stylex.props(styles.calendarHeader)}>
        <div>
          <span {...stylex.props(styles.calendarMonth)}>January</span>
          <h2 id={titleId} {...stylex.props(styles.calendarTitle)}>
            21, Tuesday
          </h2>
        </div>
        <div>
          <Button variant="ghost" size="sm" aria-label="Previous month">
            <ChevronLeft size={18} />
          </Button>
          <Button variant="ghost" size="sm" aria-label="Next month">
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
      <div {...stylex.props(styles.weekdays)}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div {...stylex.props(styles.monthGrid)}>
        {monthDays.map((date, index) => (
          <Button
            key={`${date}-${index}`}
            variant={date === 21 ? 'calendar' : 'calendarCell'}
            size="calendar"
            noPadding
            aria-current={date === 21 ? 'date' : undefined}
          >
            {date}
          </Button>
        ))}
      </div>
      <div {...stylex.props(styles.scheduleDivider)} />
      <div {...stylex.props(styles.scheduleList)}>
        {schedule.map((event) => (
          <div key={event.title} {...stylex.props(styles.scheduleRow)}>
            <time>{event.time}</time>
            <div {...stylex.props(styles.scheduleEvent)}>
              <span {...stylex.props(styles.bookingIcon)}>
                {event.break ? (
                  <Coffee size={18} aria-hidden="true" />
                ) : (
                  <CalendarDays size={18} aria-hidden="true" />
                )}
              </span>
              <span {...stylex.props(styles.bookingCopy)}>
                <strong>{event.title}</strong>
                <span>{event.instructor}</span>
              </span>
              {!event.break ? <Badge variant={event.variant}>Booked</Badge> : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function YogiDashboard() {
  const toastManager = useToast();
  const [search, setSearch] = useState('');
  const [savedClasses, setSavedClasses] = useState<string[]>([]);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredClasses = useMemo(
    () =>
      normalizedSearch.length === 0
        ? classes
        : classes.filter((item) =>
            `${item.title} ${item.instructor} ${item.level}`
              .toLowerCase()
              .includes(normalizedSearch),
          ),
    [normalizedSearch],
  );

  function goToSection(value: string) {
    document
      .getElementById(value === 'overview' ? 'yogi-overview' : value)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleSaved(title: string) {
    setSavedClasses((current) =>
      current.includes(title) ? current.filter((item) => item !== title) : [...current, title],
    );
  }

  function bookClass(item: ClassItem) {
    toastManager.add({
      title: 'Class booked',
      description: `${item.title} with ${item.instructor} is now in My bookings.`,
      type: 'success',
    });
  }

  return (
    <main {...stylex.props(styles.appPage)}>
      <div {...stylex.props(styles.shell)}>
        <header {...stylex.props(styles.topbar)}>
          <a href="/yogis" {...stylex.props(styles.brand)} aria-label="yogacn yogi home">
            <YogaLogoIcon size={30} color={colors.primary} />
            <span>
              yogacn<small {...stylex.props(styles.brandCaption)}>Move · Breathe · Be you</small>
            </span>
          </a>

          <div {...stylex.props(styles.desktopNav)}>
            <Tabs defaultValue="overview" onValueChange={goToSection}>
              <TabsList aria-label="Yogi navigation">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="classes">Classes</TabsTrigger>
                <TabsTrigger value="instructors">Instructors</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div {...stylex.props(styles.headerSearch)}>
            <Search size={18} aria-hidden="true" />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search classes or instructors"
              aria-label="Search classes or instructors"
            />
            {search.length > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                <X size={16} aria-hidden="true" />
              </Button>
            ) : null}
          </div>

          <Button variant="ghost" size="sm" aria-label="Notifications">
            <Bell size={20} aria-hidden="true" />
          </Button>
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={stylex.props(styles.mobileScheduleTrigger).className}
                aria-label="Open daily schedule"
              >
                <CalendarDays size={20} aria-hidden="true" />
              </Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                align="end"
                sideOffset={8}
                aria-label="Daily schedule"
                {...stylex.props(styles.schedulePopover)}
              >
                <ScheduleRailContent titleId="mobile-schedule-title" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <Button
            variant="ghost"
            size="sm"
            className={stylex.props(styles.profileButton).className}
          >
            <span {...stylex.props(styles.profileAvatar)}>JT</span>
            <span {...stylex.props(styles.profileCopy)}>
              <strong>James Tan</strong>
              <small>Member</small>
            </span>
            <ChevronDown size={16} aria-hidden="true" />
          </Button>
        </header>

        <div {...stylex.props(styles.workspace)}>
          <div id="yogi-overview" {...stylex.props(styles.contentColumn)}>
            <section {...stylex.props(styles.welcome)}>
              <div>
                <h1 {...stylex.props(styles.welcomeTitle)}>Good evening, James</h1>
                <p {...stylex.props(styles.welcomeCopy)}>A calmer mind is a stronger you.</p>
              </div>
              <div
                {...stylex.props(styles.heroMedia)}
                role="img"
                aria-label="Yoga yogi practising in a bright studio"
              />
            </section>

            <div {...stylex.props(styles.mobileSearch)}>
              <Search size={18} aria-hidden="true" />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search classes or instructors"
                aria-label="Search classes or instructors on mobile"
              />
              {search.length > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearch('')}
                  aria-label="Clear mobile search"
                >
                  <X size={16} aria-hidden="true" />
                </Button>
              ) : null}
            </div>

            <div {...stylex.props(styles.summaryGrid)}>
              <SummaryCard
                compact
                label="Classes this week"
                value="3 / 5"
                detail="Two more to reach your goal"
                tone="green"
              />
              <SummaryCard
                compact
                label="Practice time"
                value="180"
                detail="minutes · 20% more this week"
                tone="pink"
              />
              <SummaryCard
                compact
                label="Current streak"
                value="12"
                detail="days · keep it going"
                tone="yellow"
              />
              <SummaryCard
                compact
                label="Next class"
                value="08:00"
                detail="Morning Flow · tomorrow"
                tone="purple"
              />
            </div>

            <section id="classes" aria-labelledby="featured-title">
              <SectionHeader
                title="Featured classes"
                titleId="featured-title"
                description="Suggested from instructors you follow and the classes you enjoy."
                action={
                  <Button variant="ghost" size="sm">
                    View all <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                }
              />
              {filteredClasses.length > 0 ? (
                <div {...stylex.props(styles.classGrid)}>
                  {filteredClasses.map((item) => (
                    <ClassCard
                      key={item.title}
                      item={item}
                      saved={savedClasses.includes(item.title)}
                      onSave={() => toggleSaved(item.title)}
                      onBook={() => bookClass(item)}
                    />
                  ))}
                </div>
              ) : (
                <div {...stylex.props(styles.emptyState)}>
                  <Search size={28} aria-hidden="true" />
                  <strong>No matching classes</strong>
                  <span>Try a instructor, level or another class name.</span>
                  <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                    Clear search
                  </Button>
                </div>
              )}
            </section>

            <section
              id="bookings"
              aria-labelledby="bookings-title"
              {...stylex.props(styles.section)}
            >
              <SectionHeader
                title="My bookings"
                titleId="bookings-title"
                description="Your confirmed and upcoming classes."
                action={
                  <Button variant="ghost" size="sm">
                    View all <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                }
              />
              <div {...stylex.props(styles.bookingList)}>
                {bookings.map((booking) => (
                  <Card key={booking.title} {...stylex.props(styles.bookingRow)}>
                    <span {...stylex.props(styles.bookingIcon)}>
                      <CalendarDays size={20} aria-hidden="true" />
                    </span>
                    <span {...stylex.props(styles.bookingCopy)}>
                      <strong>{booking.title}</strong>
                      <span>
                        {booking.detail} · {booking.instructor}
                      </span>
                    </span>
                    <Badge variant={booking.state === 'Confirmed' ? 'published' : 'private'}>
                      {booking.state}
                    </Badge>
                    <Button variant="ghost" size="sm" aria-label={`Open ${booking.title}`}>
                      <ChevronRight size={17} aria-hidden="true" />
                    </Button>
                  </Card>
                ))}
              </div>
            </section>

            <section
              id="instructors"
              aria-labelledby="instructors-title"
              {...stylex.props(styles.section)}
            >
              <SectionHeader
                title="My instructors"
                titleId="instructors-title"
                description="Instructors you subscribe to across your practice."
                action={
                  <Button variant="ghost" size="sm">
                    Find instructors <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                }
              />
              <div {...stylex.props(styles.bookingList)}>
                {instructors.map((instructor) => (
                  <Card key={instructor.name} {...stylex.props(styles.bookingRow)}>
                    <span {...stylex.props(styles.instructorAvatar)} aria-hidden="true">
                      {instructor.name.charAt(0)}
                    </span>
                    <span {...stylex.props(styles.bookingCopy)}>
                      <strong>{instructor.name}</strong>
                      <span>
                        {instructor.focus} · {instructor.classes}
                      </span>
                    </span>
                    <Badge variant="published">Subscribed</Badge>
                    <Button variant="ghost" size="sm" aria-label={`Open ${instructor.name}`}>
                      <ChevronRight size={17} aria-hidden="true" />
                    </Button>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <aside {...stylex.props(styles.scheduleRail)} aria-labelledby="schedule-title">
            <ScheduleRailContent />
          </aside>
        </div>

        <nav {...stylex.props(styles.mobileNav)} aria-label="Mobile yogi navigation">
          <a href="#yogi-overview" aria-label="Overview" {...stylex.props(styles.mobileNavLink)}>
            <Home size={22} />
          </a>
          <a href="#classes" aria-label="Classes" {...stylex.props(styles.mobileNavLink)}>
            <LibraryBig size={22} />
          </a>
          <a href="#bookings" aria-label="Bookings" {...stylex.props(styles.mobileNavLink)}>
            <CalendarDays size={22} />
          </a>
          <a href="#instructors" aria-label="Instructors" {...stylex.props(styles.mobileNavLink)}>
            <UserRound size={22} />
          </a>
        </nav>
      </div>
    </main>
  );
}
