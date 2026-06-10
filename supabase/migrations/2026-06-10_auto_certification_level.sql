-- ====================================================================
-- 업주 인증 등급 자동 산정 — 매칭 데이터의 부산물
-- ====================================================================
--
-- "K-MOM 배지는 마케팅이 아니라 학생 평가의 부산물" 모델 구현.
-- reviews 테이블에 INSERT/UPDATE/DELETE 가 일어나면 그 업주의
-- certification_level을 재계산하고 employers.certification_level에 반영.
--
-- 등급 기준 (employer-trust.ts와 동일):
--   GOLD   : reviewee_id로 받은 평가 20건 이상 + 평균 4.5+
--   SILVER : 5건 이상 + 평균 4.0+
--   BRONZE : 그 외
--
-- 적용 범위:
--   reviewee_id가 employers.user_id인 경우에만 (학생 → 업주 평가).
--   업주 → 학생 평가는 대상 아님 (학생에게는 등급 없음).
--
-- 실행 방법:
--   Supabase SQL Editor 에 통째로 붙여넣기 → Run
-- ====================================================================

-- 1) 단일 업주의 인증 등급 재계산 함수
create or replace function public.recalculate_employer_certification(p_employer_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count  int;
  v_avg    numeric;
  v_level  employer_cert_level;
begin
  -- 공개된 평가만 집계 (revealed_at != null)
  select count(*), coalesce(avg(score), 0)
  into v_count, v_avg
  from public.reviews
  where reviewee_id = p_employer_id
    and revealed_at is not null;

  if v_count >= 20 and v_avg >= 4.5 then
    v_level := 'gold';
  elsif v_count >= 5 and v_avg >= 4.0 then
    v_level := 'silver';
  else
    v_level := 'bronze';
  end if;

  -- 해당 user_id가 employers에 있을 때만 업데이트
  update public.employers
  set certification_level = v_level
  where user_id = p_employer_id
    and certification_level is distinct from v_level;
end;
$$;

-- 2) reviews 변경 시 자동 재계산 트리거 함수
create or replace function public.trg_reviews_recalculate()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.recalculate_employer_certification(old.reviewee_id);
    return old;
  end if;

  -- INSERT 또는 UPDATE
  perform public.recalculate_employer_certification(new.reviewee_id);
  -- reviewee_id가 변경되었으면 이전 reviewee도 재계산
  if tg_op = 'UPDATE' and old.reviewee_id is distinct from new.reviewee_id then
    perform public.recalculate_employer_certification(old.reviewee_id);
  end if;
  return new;
end;
$$;

-- 3) 기존 트리거 제거 후 재생성
drop trigger if exists reviews_recalculate_cert on public.reviews;
create trigger reviews_recalculate_cert
after insert or update or delete on public.reviews
for each row execute function public.trg_reviews_recalculate();

-- 4) 1회성 — 모든 업주의 현재 등급을 실 평가 기준으로 동기화
do $$
declare
  r record;
begin
  for r in select user_id from public.employers loop
    perform public.recalculate_employer_certification(r.user_id);
  end loop;
end $$;

-- ====================================================================
-- 검증 쿼리 (실행 후 결과 확인용)
-- ====================================================================
--
-- select
--   e.business_name,
--   e.certification_level,
--   (select count(*) from reviews where reviewee_id = e.user_id and revealed_at is not null) as review_count,
--   (select round(avg(score)::numeric, 2) from reviews where reviewee_id = e.user_id and revealed_at is not null) as avg_score
-- from employers e
-- order by e.certification_level desc;
