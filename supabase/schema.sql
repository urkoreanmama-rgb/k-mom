-- ============================================================
-- K-MOM Platform: Phase 1 MVP Schema
-- Supabase / Postgres
--
-- 실행 순서:
--   1) Supabase 프로젝트 SQL Editor에서 이 파일 전체를 붙여넣기
--   2) RLS 정책까지 한 번에 실행됨
--   3) auth.users 트리거가 자동으로 public.users 행 생성
-- ============================================================

-- ============================================================
-- 1. ENUMS
-- ============================================================

create type user_role as enum ('student', 'employer', 'school_admin', 'platform_admin');
create type visa_type as enum ('D-2-1', 'D-2-2', 'D-2-3', 'D-2-4', 'D-2-6', 'D-2-7', 'D-2-8', 'D-4', 'other');
create type topik_level as enum ('none', 'level_1', 'level_2', 'level_3', 'level_4', 'level_5', 'level_6');
create type employer_cert_level as enum ('bronze', 'silver', 'gold');
create type work_status as enum ('active', 'completed', 'cancelled');
create type mou_status as enum ('none', 'pending', 'active', 'expired');

-- ============================================================
-- 2. CORE TABLES
-- ============================================================

-- public.users mirrors auth.users with role + profile basics
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'student',
  name text not null default '',
  email text not null,
  nationality text,
  visa_type visa_type,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index users_role_idx on public.users(role);

-- Schools (universities)
create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  admin_user_id uuid references public.users(id) on delete set null,
  mou_status mou_status not null default 'none',
  subscription_plan text,
  created_at timestamptz not null default now()
);

-- Student profiles (1:1 with users where role='student')
create table public.student_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  school_id uuid references public.schools(id) on delete set null,
  topik_level topik_level not null default 'none',
  intro text,
  skills text[],
  photo_url text,
  topik_certificate_url text,
  professor_recommendation_url text,
  verified_badge boolean not null default false,
  total_work_hours integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index student_profiles_school_idx on public.student_profiles(school_id);
create index student_profiles_topik_idx on public.student_profiles(topik_level);

-- Employer (business) info (1:1 with users where role='employer')
create table public.employers (
  user_id uuid primary key references public.users(id) on delete cascade,
  business_name text not null,
  category text,
  address text,
  business_registration_url text,
  certification_level employer_cert_level not null default 'bronze',
  is_blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index employers_category_idx on public.employers(category);
create index employers_cert_idx on public.employers(certification_level);

-- Work histories (a single work engagement record)
create table public.work_histories (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.users(id) on delete cascade,
  employer_id uuid not null references public.users(id) on delete cascade,
  start_date date not null,
  end_date date,
  hours_per_week integer,
  hourly_wage integer,
  status work_status not null default 'active',
  created_at timestamptz not null default now()
);

create index work_histories_student_idx on public.work_histories(student_id);
create index work_histories_employer_idx on public.work_histories(employer_id);

-- Reviews (two-sided, revealed after both submit — like Airbnb)
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  work_history_id uuid not null references public.work_histories(id) on delete cascade,
  reviewer_id uuid not null references public.users(id) on delete cascade,
  reviewee_id uuid not null references public.users(id) on delete cascade,
  score smallint not null check (score between 1 and 5),
  items_json jsonb,
  comment text,
  revealed_at timestamptz,  -- set when both sides have submitted
  created_at timestamptz not null default now(),
  unique (work_history_id, reviewer_id)
);

create index reviews_reviewee_idx on public.reviews(reviewee_id);
create index reviews_work_history_idx on public.reviews(work_history_id);

-- School ↔ Student tracking (doc submission etc.)
create table public.school_students (
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.users(id) on delete cascade,
  doc_submitted boolean not null default false,
  monitored_at timestamptz,
  primary key (school_id, student_id)
);

-- ============================================================
-- 3. TRIGGERS
-- ============================================================

-- Auto-create public.users row when a new auth.users is inserted
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at maintenance
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at before update on public.users
  for each row execute function public.set_updated_at();
create trigger student_profiles_updated_at before update on public.student_profiles
  for each row execute function public.set_updated_at();
create trigger employers_updated_at before update on public.employers
  for each row execute function public.set_updated_at();

-- Reveal reviews when both sides submitted
create or replace function public.maybe_reveal_reviews()
returns trigger as $$
declare
  v_other_review reviews%rowtype;
begin
  -- find the counterpart review for the same work_history
  select * into v_other_review
  from public.reviews
  where work_history_id = new.work_history_id
    and reviewer_id <> new.reviewer_id
  limit 1;

  if found then
    update public.reviews
      set revealed_at = now()
      where work_history_id = new.work_history_id
        and revealed_at is null;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_review_inserted
  after insert on public.reviews
  for each row execute function public.maybe_reveal_reviews();

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

alter table public.users enable row level security;
alter table public.schools enable row level security;
alter table public.student_profiles enable row level security;
alter table public.employers enable row level security;
alter table public.work_histories enable row level security;
alter table public.reviews enable row level security;
alter table public.school_students enable row level security;

-- helper: current user's role
create or replace function public.current_role()
returns user_role as $$
  select role from public.users where id = auth.uid()
$$ language sql stable security definer;

-- users: anyone authenticated can read own row + public name; only self can update; platform_admin can read all
create policy users_select_self on public.users for select using (auth.uid() = id);
create policy users_select_public on public.users for select using (true);  -- name/role/visa needed for cards
create policy users_update_self on public.users for update using (auth.uid() = id);

-- student_profiles: student writes own; employers/school_admin/platform_admin can read all; students can read all (browse)
create policy student_profiles_owner_all on public.student_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy student_profiles_read_all on public.student_profiles
  for select using (true);

-- employers: owner manages own; everyone can read non-blocked basic info
create policy employers_owner_all on public.employers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy employers_read_public on public.employers
  for select using (is_blocked = false);

-- work_histories: student or employer party can read + create + update their own
create policy work_histories_party_read on public.work_histories
  for select using (auth.uid() in (student_id, employer_id));
create policy work_histories_party_insert on public.work_histories
  for insert with check (auth.uid() in (student_id, employer_id));
create policy work_histories_party_update on public.work_histories
  for update using (auth.uid() in (student_id, employer_id));

-- reviews: reviewer creates own; both parties can read after revealed_at; before that only reviewer can see own
create policy reviews_insert_self on public.reviews
  for insert with check (auth.uid() = reviewer_id);
create policy reviews_select_own on public.reviews
  for select using (auth.uid() = reviewer_id);
create policy reviews_select_revealed on public.reviews
  for select using (revealed_at is not null and auth.uid() in (reviewer_id, reviewee_id));

-- schools / school_students: school_admin manages own school; platform_admin manages all
create policy schools_admin_all on public.schools
  for all using (admin_user_id = auth.uid() or public.current_role() = 'platform_admin')
  with check (admin_user_id = auth.uid() or public.current_role() = 'platform_admin');
create policy schools_read_all on public.schools
  for select using (true);

create policy school_students_school_admin on public.school_students
  for all using (
    public.current_role() = 'platform_admin' or
    exists (select 1 from public.schools s where s.id = school_id and s.admin_user_id = auth.uid())
  );
create policy school_students_self_read on public.school_students
  for select using (student_id = auth.uid());

-- ============================================================
-- 5. SEED (optional dev data)
-- ============================================================
-- insert into public.schools (name, mou_status) values
--   ('연세대학교', 'active'),
--   ('고려대학교', 'pending'),
--   ('서울대학교', 'none');
