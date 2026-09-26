type RouteLeaf = string | ((...params: string[]) => string);
type RouteNode = RouteLeaf | { readonly [key: string]: RouteNode };

const defineRoutes = <const T extends Record<string, RouteNode>>(routes: T) => routes;

type StaticRouteValues<T> = T extends (...params: string[]) => string
  ? never
  : T extends string
    ? T
    : T extends Record<string, unknown>
      ? StaticRouteValues<T[keyof T]>
      : never;

export const PUBLIC_ROUTES = defineRoutes({
  ROOT: '/',
  LANDING: '/landing',
  NAMASTE: '/namaste',
});

export type PublicRouteKey = keyof typeof PUBLIC_ROUTES;
export type PublicRoute = StaticRouteValues<typeof PUBLIC_ROUTES>;

export const INSTRUCTOR_ROUTES = defineRoutes({
  ROOT: '/instructors',
  PROFILE: '/instructors/profile',
  SCHEDULE: '/instructors/schedule',
  CLASSES: {
    ROOT: '/instructors/classes',
    NEW: '/instructors/classes/new',
    BY_ID: (id: string) => `/instructors/classes/${id}`,
    EDIT: (id: string) => `/instructors/classes/${id}/edit`,
    TEACH: (id: string) => `/instructors/classes/${id}/teach`,
    REFLECT: (id: string) => `/instructors/classes/${id}/reflect`,
  },
  WORKSHOPS: {
    ROOT: '/instructors/workshops',
    CREATE: '/instructors/workshops/create',
    EDIT: (id: string) => `/instructors/workshops/edit/${id}`,
  },
  YOGIS: {
    ROOT: '/instructors/yogis',
    BY_ID: (id: string) => `/instructors/yogis/${id}`,
  },
});

export type InstructorRouteKey = keyof typeof INSTRUCTOR_ROUTES;
export type InstructorStaticRoute = StaticRouteValues<typeof INSTRUCTOR_ROUTES>;

export const YOGI_ROUTES = defineRoutes({
  ROOT: '/yogis',
  CLASSES: '/yogis/classes',
  INSTRUCTORS: '/yogis/instructors',
  BOOKINGS: '/yogis/bookings',
  PROFILE: '/yogis/profile',
});

export type YogiRouteKey = keyof typeof YOGI_ROUTES;
export type YogiRoute = StaticRouteValues<typeof YOGI_ROUTES>;

export const API_ROUTES = defineRoutes({
  CLASSES: '/api/classes',
  CLASS_BY_ID: (id: string) => `/api/classes/${id}`,
  MOON_DAYS: '/api/moon-days',
});

export const routes = defineRoutes({
  public: PUBLIC_ROUTES,
  instructor: INSTRUCTOR_ROUTES,
  yogi: YOGI_ROUTES,
  api: API_ROUTES,
});
