import type { Level } from './types';

export type WorkshopStatus = 'draft' | 'published' | 'sold_out' | 'closed';

export type WorkshopSession = {
  id: string;
  start: string;
  end: string;
  instructor: string;
  language: string;
};

export type Workshop = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: Level;
  instructor: string;
  facility: string;
  language: string;
  coverImageUrl: string;
  price: number;
  currency: string;
  capacity: number;
  booked: number;
  status: WorkshopStatus;
  sessions: WorkshopSession[];
  equipment: string;
  cancellationPolicy: string;
};

export const demoWorkshops: Workshop[] = [
  {
    id: 'kyoto-sound-bath',
    title: 'KYOTO - Sound Bath',
    description:
      'A Sound Bath is an immersive experience using the vibrations of crystal bowls to guide participants into deep relaxation.',
    category: 'Sound Bath',
    level: 'all_levels',
    instructor: 'Miri Ogawa',
    facility: 'Kyoto Studio',
    language: 'English / Japanese',
    coverImageUrl: '',
    price: 4500,
    currency: 'JPY',
    capacity: 16,
    booked: 10,
    status: 'published',
    sessions: [
      {
        id: 'kyoto-sound-bath-1',
        start: '2026-09-23T10:30',
        end: '2026-09-23T11:45',
        instructor: 'Miri Ogawa',
        language: 'EN / JP',
      },
    ],
    equipment: 'Yoga mat and blanket recommended',
    cancellationPolicy: 'Full refund up to 24 hours before the session.',
  },
  {
    id: 'moonlit-meditation',
    title: 'Moonlit Meditation Workshop',
    description: 'A gentle evening practice combining breathwork, guided meditation, and restorative rest.',
    category: 'Meditation',
    level: 'all_levels',
    instructor: 'Sora Watanabe',
    facility: 'Moon Room',
    language: 'English',
    coverImageUrl: '',
    price: 3200,
    currency: 'JPY',
    capacity: 20,
    booked: 20,
    status: 'sold_out',
    sessions: [
      {
        id: 'moonlit-meditation-1',
        start: '2026-10-02T19:00',
        end: '2026-10-02T20:30',
        instructor: 'Sora Watanabe',
        language: 'EN',
      },
    ],
    equipment: 'Cushions are provided by the studio.',
    cancellationPolicy: 'Full refund up to 24 hours before the session.',
  },
  {
    id: 'strong-foundations',
    title: 'Strong Foundations Lab',
    description: 'A practical workshop for building confidence in standing balances and arm support.',
    category: 'Yoga Lab',
    level: 'intermediate',
    instructor: 'Narin Chai',
    facility: 'Practice Hall',
    language: 'Thai / English',
    coverImageUrl: '',
    price: 2800,
    currency: 'THB',
    capacity: 18,
    booked: 7,
    status: 'draft',
    sessions: [
      {
        id: 'strong-foundations-1',
        start: '2026-10-10T09:00',
        end: '2026-10-10T11:00',
        instructor: 'Narin Chai',
        language: 'TH / EN',
      },
    ],
    equipment: 'Bring two blocks if you have them.',
    cancellationPolicy: 'Full refund up to 24 hours before the session.',
  },
];

export const workshopStatusLabel: Record<WorkshopStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  sold_out: 'Sold out',
  closed: 'Closed',
};

export const workshopStatusVariant = {
  draft: 'draft',
  published: 'published',
  sold_out: 'private',
  closed: 'taught',
} as const;

