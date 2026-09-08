-- yogacn MVP schema. Every application table has RLS enabled below.
create extension if not exists pgcrypto;
create type public.class_plan_status as enum ('draft','ready','taught');
create type public.class_level as enum ('beginner','all_levels','intermediate','advanced');
create type public.student_status as enum ('active','archived');
create type public.observation_severity as enum ('general','follow_up','caution');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.class_plans (
  id uuid primary key default gen_random_uuid(), teacher_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check(char_length(title)>=2), intention text not null default '', description text not null default '',
  level public.class_level not null default 'all_levels', planned_duration_minutes integer not null check(planned_duration_minutes between 10 and 240),
  peak_pose text not null default '', props text not null default '', teacher_notes text not null default '', status public.class_plan_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.class_sections (
  id uuid primary key default gen_random_uuid(), class_plan_id uuid not null references public.class_plans(id) on delete cascade,
  name text not null, color text not null default 'sage' check(color in ('sage','clay','lavender','blue')), position integer not null check(position>=0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(class_plan_id,position)
);
create table public.class_items (
  id uuid primary key default gen_random_uuid(), class_section_id uuid not null references public.class_sections(id) on delete cascade,
  name text not null, cue text not null default '', transition_note text not null default '', breath_count integer check(breath_count>=0),
  duration_seconds integer check(duration_seconds>=0), repetition_count integer check(repetition_count>=0), modification text not null default '', safety_note text not null default '',
  position integer not null check(position>=0), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(class_section_id,position)
);
create table public.teaching_sessions (
  id uuid primary key default gen_random_uuid(), class_plan_id uuid not null references public.class_plans(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade, taught_at timestamptz not null, actual_duration_minutes integer not null check(actual_duration_minutes between 1 and 360),
  worked_well text not null default '', did_not_work text not null default '', timing_issues text not null default '', difficult_transitions text not null default '',
  student_response text not null default '', general_reflection text not null default '', adjustment_next_time text not null, tags text[] not null default '{}',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.students (
  id uuid primary key default gen_random_uuid(), teacher_id uuid not null references public.profiles(id) on delete cascade,
  display_name text not null, note text not null default '', status public.student_status not null default 'active', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.student_observations (
  id uuid primary key default gen_random_uuid(), student_id uuid not null references public.students(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade, teaching_session_id uuid references public.teaching_sessions(id) on delete set null,
  observed_at date not null, severity public.observation_severity not null default 'general', observation text not null, teaching_modification text not null,
  follow_up_result text not null default '', created_by uuid not null references public.profiles(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.session_attendance (
  id uuid primary key default gen_random_uuid(), teaching_session_id uuid not null references public.teaching_sessions(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade, teacher_id uuid not null references public.profiles(id) on delete cascade,
  note text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(teaching_session_id,student_id)
);
create index class_plans_teacher_updated_idx on public.class_plans(teacher_id,updated_at desc);
create index class_sections_plan_position_idx on public.class_sections(class_plan_id,position);
create index class_items_section_position_idx on public.class_items(class_section_id,position);
create index teaching_sessions_plan_taught_idx on public.teaching_sessions(class_plan_id,taught_at desc);
create index students_teacher_status_idx on public.students(teacher_id,status);
create index observations_student_date_idx on public.student_observations(student_id,observed_at desc);
create index attendance_student_idx on public.session_attendance(student_id,created_at desc);
create index attendance_session_idx on public.session_attendance(teaching_session_id);
create index attendance_teacher_idx on public.session_attendance(teacher_id,created_at desc);

create function public.set_updated_at() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at=now(); return new; end $$;
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger plans_updated before update on public.class_plans for each row execute function public.set_updated_at();
create trigger sections_updated before update on public.class_sections for each row execute function public.set_updated_at();
create trigger items_updated before update on public.class_items for each row execute function public.set_updated_at();
create trigger sessions_updated before update on public.teaching_sessions for each row execute function public.set_updated_at();
create trigger students_updated before update on public.students for each row execute function public.set_updated_at();
create trigger observations_updated before update on public.student_observations for each row execute function public.set_updated_at();
create trigger attendance_updated before update on public.session_attendance for each row execute function public.set_updated_at();
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id,display_name) values(new.id,coalesce(new.raw_user_meta_data->>'display_name','')); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security; alter table public.class_plans enable row level security;
alter table public.class_sections enable row level security; alter table public.class_items enable row level security;
alter table public.teaching_sessions enable row level security; alter table public.students enable row level security;
alter table public.student_observations enable row level security;
alter table public.session_attendance enable row level security;
create policy profiles_select on public.profiles for select using(id=auth.uid());
create policy profiles_insert on public.profiles for insert with check(id=auth.uid());
create policy profiles_update on public.profiles for update using(id=auth.uid()) with check(id=auth.uid());
create policy profiles_delete on public.profiles for delete using(id=auth.uid());
create policy plans_select on public.class_plans for select using(teacher_id=auth.uid());
create policy plans_insert on public.class_plans for insert with check(teacher_id=auth.uid());
create policy plans_update on public.class_plans for update using(teacher_id=auth.uid()) with check(teacher_id=auth.uid());
create policy plans_delete on public.class_plans for delete using(teacher_id=auth.uid());
create policy sections_select on public.class_sections for select using(exists(select 1 from public.class_plans p where p.id=class_plan_id and p.teacher_id=auth.uid()));
create policy sections_insert on public.class_sections for insert with check(exists(select 1 from public.class_plans p where p.id=class_plan_id and p.teacher_id=auth.uid()));
create policy sections_update on public.class_sections for update using(exists(select 1 from public.class_plans p where p.id=class_plan_id and p.teacher_id=auth.uid())) with check(exists(select 1 from public.class_plans p where p.id=class_plan_id and p.teacher_id=auth.uid()));
create policy sections_delete on public.class_sections for delete using(exists(select 1 from public.class_plans p where p.id=class_plan_id and p.teacher_id=auth.uid()));
create policy items_select on public.class_items for select using(exists(select 1 from public.class_sections s join public.class_plans p on p.id=s.class_plan_id where s.id=class_section_id and p.teacher_id=auth.uid()));
create policy items_insert on public.class_items for insert with check(exists(select 1 from public.class_sections s join public.class_plans p on p.id=s.class_plan_id where s.id=class_section_id and p.teacher_id=auth.uid()));
create policy items_update on public.class_items for update using(exists(select 1 from public.class_sections s join public.class_plans p on p.id=s.class_plan_id where s.id=class_section_id and p.teacher_id=auth.uid())) with check(exists(select 1 from public.class_sections s join public.class_plans p on p.id=s.class_plan_id where s.id=class_section_id and p.teacher_id=auth.uid()));
create policy items_delete on public.class_items for delete using(exists(select 1 from public.class_sections s join public.class_plans p on p.id=s.class_plan_id where s.id=class_section_id and p.teacher_id=auth.uid()));
create policy sessions_all on public.teaching_sessions for all using(teacher_id=auth.uid() and exists(select 1 from public.class_plans p where p.id=class_plan_id and p.teacher_id=auth.uid())) with check(teacher_id=auth.uid() and exists(select 1 from public.class_plans p where p.id=class_plan_id and p.teacher_id=auth.uid()));
create policy students_all on public.students for all using(teacher_id=auth.uid()) with check(teacher_id=auth.uid());
create policy observations_all on public.student_observations for all using(teacher_id=auth.uid() and exists(select 1 from public.students s where s.id=student_id and s.teacher_id=auth.uid())) with check(teacher_id=auth.uid() and created_by=auth.uid() and exists(select 1 from public.students s where s.id=student_id and s.teacher_id=auth.uid()) and (teaching_session_id is null or exists(select 1 from public.teaching_sessions t where t.id=teaching_session_id and t.teacher_id=auth.uid())));
create policy attendance_all on public.session_attendance for all using(teacher_id=auth.uid() and exists(select 1 from public.teaching_sessions t where t.id=teaching_session_id and t.teacher_id=auth.uid()) and exists(select 1 from public.students s where s.id=student_id and s.teacher_id=auth.uid())) with check(teacher_id=auth.uid() and exists(select 1 from public.teaching_sessions t where t.id=teaching_session_id and t.teacher_id=auth.uid()) and exists(select 1 from public.students s where s.id=student_id and s.teacher_id=auth.uid()));
