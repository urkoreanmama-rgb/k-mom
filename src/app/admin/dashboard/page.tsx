import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { fetchMetrics } from '@/data/demo-metrics'
import { DEMO_STUDENTS } from '@/data/demo-students'
import { DEMO_EMPLOYERS } from '@/data/demo-employers'
import { DEMO_REVIEWS } from '@/data/demo-reviews'

export const metadata = { title: '운영자 대시보드 · K-MOM' }

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [{ count: dbStudent }, { count: dbEmployer }, { count: dbReviews }, metrics] =
    await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'employer'),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
      fetchMetrics(),
    ])

  const studentToEmployer = DEMO_REVIEWS.filter((r) => r.reviewerRole === 'student')
  const employerToStudent = DEMO_REVIEWS.filter((r) => r.reviewerRole === 'employer')

  const riskEmployers = DEMO_EMPLOYERS.filter((e) => e.riskFlag)

  function getStudentName(id: string) {
    return DEMO_STUDENTS.find((s) => s.studentId === id)?.name ?? id
  }
  function getCompanyName(id: string) {
    return DEMO_EMPLOYERS.find((e) => e.companyId === id)?.companyName ?? id
  }
  function avgReviewRatings(review: (typeof DEMO_REVIEWS)[0]): number {
    const r = review.ratings
    if (review.reviewerRole === 'student') {
      const vals = [r.wageOnTime, r.jobMatchAccuracy, r.workEnvironment, r.studentRespect, r.documentSupport].filter(
        (v): v is number => v !== undefined,
      )
      if (vals.length === 0) return 0
      return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
    } else {
      const vals = [r.punctuality, r.workAttitude, r.customerService, r.koreanCommunication].filter(
        (v): v is number => v !== undefined,
      )
      if (vals.length === 0) return 0
      return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            INVESTOR DEMO
          </p>
          <h1 className="mt-1 text-3xl font-bold">K-MOM 운영자 대시보드</h1>
          <p className="mt-1 text-sm text-zinc-500">
            맞춤 매칭 흐름의 전환 지표 — 시현용 더미 데이터 기준
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/requests"
            className="inline-flex h-10 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
          >
            업주 요청 관리 →
          </Link>
        </div>
      </header>

      {/* DB 엑셀(CSV) 다운로드 — 운영자만 사용 */}
      <section className="mt-6 rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
          📥 사용자 DB 엑셀(CSV) 다운로드
        </p>
        <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
          Excel·구글 시트로 바로 열 수 있어요. 한글 파일명·내용 깨짐 없음 (UTF-8 BOM).
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="/api/export/students"
            download
            className="inline-flex h-10 items-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700"
          >
            👨‍🎓 학생 명단 다운로드
          </a>
          <a
            href="/api/export/employers"
            download
            className="inline-flex h-10 items-center rounded-lg bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700"
          >
            🏪 업주 명단 다운로드
          </a>
          <a
            href="/api/export/match-requests"
            download
            className="inline-flex h-10 items-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white hover:bg-violet-700"
          >
            📋 매칭 요청 다운로드
          </a>
        </div>
      </section>

      {/* ── 핵심 KPI ── */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold text-zinc-500">맞춤 매칭 전환 지표 (Investor KPI)</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-4">
          <MetricCard label="등록 유학생" value={metrics.registeredStudents} unit="명" tone="emerald" />
          <MetricCard label="조건 입력 업주" value={metrics.inquiredEmployers} unit="명" tone="sky" />
          <MetricCard label="후보 수 확인 완료" value={metrics.candidateCountConfirmedEmployers} unit="명" tone="sky" />
          <MetricCard label="1만 원 결제 업주" value={metrics.paidEmployers} unit="명" tone="violet" highlight />
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <MetricCard label="결제 전환율" value={metrics.conversionRatePct} unit="%" tone="violet" highlight />
          <MetricCard label="연락 요청 수" value={metrics.contactRequests} unit="건" tone="emerald" />
          <MetricCard label="후보 부족 대기 등록" value={metrics.waitlistedEmployers} unit="명" tone="amber" />
        </div>
      </section>

      {/* ── 신뢰·확장 지표 (새로 추가된 8개) ── */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold text-zinc-500">신뢰·확장 지표 (신뢰 생태계)</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-4">
          <MetricCard label="등록 업체 수" value={metrics.registeredCompanies} unit="개" tone="sky" />
          <MetricCard label="인증 업체 수" value={metrics.certifiedCompanies} unit="개" tone="emerald" highlight />
          <MetricCard label="누적 평가 수" value={metrics.totalReviews} unit="건" tone="violet" />
          <MetricCard label="교수 추천 학생" value={metrics.professorRecommendedStudents} unit="명" tone="amber" />
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-4">
          <MetricCard label="맞춤 매칭 요청" value={metrics.candidateMatchRequests} unit="건" tone="sky" />
          <MetricCard label="미리보기팩 결제" value={metrics.previewPayments} unit="건" tone="violet" />
          <MetricCard label="학생 만족도" value={metrics.studentSatisfaction} unit="/ 5" tone="emerald" highlight />
          <MetricCard label="업체 신뢰도 평균" value={metrics.companyTrustAverage} unit="/ 5" tone="emerald" highlight />
        </div>
      </section>

      {/* ── 전환 깔때기 ── */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold text-zinc-500">전환 깔때기</h2>
        <div className="mt-3 space-y-2">
          <FunnelRow label="조건 입력" value={metrics.inquiredEmployers} base={metrics.inquiredEmployers} color="bg-sky-500" />
          <FunnelRow label="후보 수 확인 완료" value={metrics.candidateCountConfirmedEmployers} base={metrics.inquiredEmployers} color="bg-sky-600" />
          <FunnelRow label="1만 원 결제" value={metrics.paidEmployers} base={metrics.inquiredEmployers} color="bg-violet-500" />
          <FunnelRow label="연락 요청" value={metrics.contactRequests} base={metrics.inquiredEmployers} color="bg-emerald-500" />
        </div>
      </section>

      {/* ── 실제 DB ── */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold text-zinc-500">
          실제 Supabase 데이터 (참고 — 실제 운영 시 위 더미와 통합)
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <SmallStat label="DB 학생" value={dbStudent ?? 0} />
          <SmallStat label="DB 업주" value={dbEmployer ?? 0} />
          <SmallStat label="DB 평가" value={dbReviews ?? 0} />
        </div>
      </section>

      {/* ── DEMO 확장 섹션 ── */}
      <div className="mt-14 border-t border-zinc-200 pt-10 dark:border-zinc-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          DEMO DATA — src/data/ 파일 기반
        </p>

        {/* 학생 목록 */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">학생 목록</h2>
            <Link href="/students" className="text-sm text-zinc-500 hover:underline">
              전체 보기 →
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <Th>이름</Th>
                  <Th>국적</Th>
                  <Th>비자</Th>
                  <Th>학교인증</Th>
                  <Th>교수추천</Th>
                  <Th>TOPIK</Th>
                  <Th>재고용률</Th>
                  <Th>연락상태</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
                {DEMO_STUDENTS.slice(0, 10).map((s) => (
                  <tr key={s.studentId} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <Td>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-zinc-400">{s.nickname}</div>
                    </Td>
                    <Td><span className="text-xs text-zinc-600 dark:text-zinc-400">{s.nationality}</span></Td>
                    <Td>
                      <span className="rounded-md bg-sky-100 px-2 py-0.5 text-xs text-sky-800 dark:bg-sky-900/40 dark:text-sky-300">
                        {s.visaType}
                      </span>
                    </Td>
                    <Td>
                      {s.schoolVerified ? (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ 인증</span>
                      ) : (
                        <span className="text-xs text-zinc-400">미인증</span>
                      )}
                    </Td>
                    <Td>
                      {s.professorRecommended ? (
                        <span className="text-xs text-violet-600 dark:text-violet-400">✓ 추천</span>
                      ) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </Td>
                    <Td>
                      {s.topikLevel > 0 ? (
                        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          {s.topikLevel}급
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">없음</span>
                      )}
                    </Td>
                    <Td>
                      <span className="text-xs font-medium">{s.rehireRate}%</span>
                    </Td>
                    <Td>
                      <span
                        className={
                          s.contactStatus === 'available'
                            ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : s.contactStatus === 'pending'
                              ? 'rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                              : 'rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }
                      >
                        {s.contactStatus === 'available' ? '열람 가능' : s.contactStatus === 'pending' ? '검토 중' : '비공개'}
                      </span>
                    </Td>
                    <Td>
                      <Link href={`/students/${s.studentId}`} className="text-xs text-sky-600 hover:underline dark:text-sky-400">
                        상세 보기
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 업체 목록 */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">업체 목록</h2>
            <Link href="/employers" className="text-sm text-zinc-500 hover:underline">
              전체 보기 →
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <Th>업체명</Th>
                  <Th>업종</Th>
                  <Th>지역</Th>
                  <Th>인증</Th>
                  <Th>신뢰점수</Th>
                  <Th>평가건수</Th>
                  <Th>주의신호</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
                {DEMO_EMPLOYERS.map((e) => (
                  <tr
                    key={e.companyId}
                    className={`hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                      e.riskFlag ? 'bg-amber-50/70 dark:bg-amber-950/20' : ''
                    }`}
                  >
                    <Td>
                      <div className="font-medium">{e.companyName}</div>
                    </Td>
                    <Td><span className="text-xs text-zinc-500">{e.businessType}</span></Td>
                    <Td><span className="text-xs text-zinc-500">{e.area}</span></Td>
                    <Td>
                      {e.certified ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          인증
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">미인증</span>
                      )}
                    </Td>
                    <Td>
                      <span className="font-medium">★ {e.trustScore.toFixed(1)}</span>
                    </Td>
                    <Td>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">
                        {e.reviewSummary.totalReviews}건
                      </span>
                    </Td>
                    <Td>
                      {e.riskFlag ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                          ⚠️ 주의
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-300 dark:text-zinc-700">—</span>
                      )}
                    </Td>
                    <Td>
                      <Link href={`/employers/${e.companyId}`} className="text-xs text-sky-600 hover:underline dark:text-sky-400">
                        상세 보기
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 쌍방향 평가 목록 */}
        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold">쌍방향 평가 목록</h2>
            <div className="flex gap-2 text-xs">
              <span className="rounded-full bg-zinc-200 px-3 py-1 dark:bg-zinc-800">
                전체 {DEMO_REVIEWS.length}건
              </span>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                학생→업체 {studentToEmployer.length}건
              </span>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                업체→학생 {employerToStudent.length}건
              </span>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <Th>평가유형</Th>
                  <Th>학생</Th>
                  <Th>업체</Th>
                  <Th>날짜</Th>
                  <Th>평균점수</Th>
                  <Th>인증여부</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
                {DEMO_REVIEWS.map((r) => (
                  <tr key={r.reviewId} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <Td>
                      <span
                        className={
                          r.reviewerRole === 'student'
                            ? 'rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                            : 'rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                        }
                      >
                        {r.reviewerRole === 'student' ? '학생→업체' : '업체→학생'}
                      </span>
                    </Td>
                    <Td><span className="text-xs">{getStudentName(r.studentId)}</span></Td>
                    <Td><span className="text-xs">{getCompanyName(r.companyId)}</span></Td>
                    <Td><span className="text-xs text-zinc-500">{r.createdAt.slice(0, 10)}</span></Td>
                    <Td>
                      <span className="text-xs font-medium">★ {avgReviewRatings(r)}</span>
                    </Td>
                    <Td>
                      {r.isVerified ? (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ 인증</span>
                      ) : (
                        <span className="text-xs text-zinc-400">미인증</span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 주의 신호 목록 */}
        <section className="mt-10">
          <h2 className="text-xl font-bold">주의 신호 업체</h2>
          <div className="mt-4 space-y-4">
            {riskEmployers.length === 0 ? (
              <p className="text-sm text-zinc-500">주의 신호 업체가 없습니다.</p>
            ) : (
              riskEmployers.map((e) => (
                <div
                  key={e.companyId}
                  className="rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="font-semibold text-amber-900 dark:text-amber-200">
                        {e.companyName}
                      </p>
                      <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                        {e.area} · {e.businessType}
                      </p>
                      {e.riskNote && (
                        <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">
                          {e.riskNote}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                        신뢰점수: ★ {e.trustScore.toFixed(1)} · 평가 {e.reviewSummary.totalReviews}건
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 서류 체크리스트 현황 */}
        <section className="mt-10">
          <h2 className="text-xl font-bold">서류 체크리스트 현황</h2>
          <p className="mt-1 text-sm text-zinc-500">상위 8명 기준 · 학생 자기 신고 데이터</p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <Th>학생명</Th>
                  <Th>비자</Th>
                  <Th>학교인증</Th>
                  <Th>교수추천</Th>
                  <Th>알바경험</Th>
                  <Th>서류준비완료</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
                {DEMO_STUDENTS.slice(0, 8).map((s) => (
                  <tr key={s.studentId} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <Td><span className="font-medium">{s.name}</span></Td>
                    <Td>
                      <span className="rounded-md bg-sky-100 px-2 py-0.5 text-xs text-sky-800 dark:bg-sky-900/40 dark:text-sky-300">
                        {s.visaType}
                      </span>
                    </Td>
                    <Td>
                      {s.schoolVerified ? (
                        <CheckBadge ok />
                      ) : (
                        <CheckBadge ok={false} />
                      )}
                    </Td>
                    <Td>
                      {s.professorRecommended ? (
                        <CheckBadge ok />
                      ) : (
                        <CheckBadge ok={false} />
                      )}
                    </Td>
                    <Td>
                      {s.partTimePermissionExperience ? (
                        <CheckBadge ok />
                      ) : (
                        <CheckBadge ok={false} />
                      )}
                    </Td>
                    <Td>
                      {s.schoolVerified && s.partTimePermissionExperience ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          완료
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                          미완료
                        </span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 연락 요청 현황 */}
        <section className="mt-10">
          <h2 className="text-xl font-bold">연락 요청 현황</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            {[
              { label: '조건맞춤 후보 요청', value: '18건', tone: 'sky' },
              { label: '결제 완료', value: '9건', tone: 'violet' },
              { label: '전환율', value: '50%', tone: 'emerald' },
              { label: '평균 결제 단가', value: '₩10,000', tone: 'amber' },
            ].map(({ label, value, tone }) => (
              <div
                key={label}
                className={`rounded-2xl border p-5 ${
                  tone === 'sky'
                    ? 'border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/30'
                    : tone === 'violet'
                      ? 'border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/30'
                      : tone === 'emerald'
                        ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30'
                        : 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30'
                }`}
              >
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <p className="mt-10 text-center text-xs text-zinc-400">
        * 위 메트릭은 src/data/demo-metrics.ts 의 더미 값입니다. 운영 시
        fetchMetrics()를 Supabase RPC로 교체하세요.
      </p>
    </main>
  )
}

// ── 공통 컴포넌트 ──

function CheckBadge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="text-xs text-emerald-600 dark:text-emerald-400">✓</span>
  ) : (
    <span className="text-xs text-zinc-400">—</span>
  )
}

function MetricCard({
  label,
  value,
  unit,
  tone,
  highlight = false,
}: {
  label: string
  value: number
  unit: string
  tone: 'emerald' | 'sky' | 'violet' | 'amber'
  highlight?: boolean
}) {
  const ring =
    tone === 'emerald'
      ? 'border-emerald-200 dark:border-emerald-900'
      : tone === 'sky'
        ? 'border-sky-200 dark:border-sky-900'
        : tone === 'violet'
          ? 'border-violet-200 dark:border-violet-900'
          : 'border-amber-200 dark:border-amber-900'
  const numColor =
    tone === 'emerald'
      ? 'text-emerald-700 dark:text-emerald-300'
      : tone === 'sky'
        ? 'text-sky-700 dark:text-sky-300'
        : tone === 'violet'
          ? 'text-violet-700 dark:text-violet-300'
          : 'text-amber-700 dark:text-amber-300'
  return (
    <div
      className={
        (highlight ? 'border-2 ' : 'border ') +
        ring +
        ' rounded-2xl bg-white p-5 dark:bg-zinc-900'
      }
    >
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${numColor}`}>
        {value.toLocaleString()}
        <span className="ml-1 text-sm font-medium text-zinc-500">{unit}</span>
      </p>
    </div>
  )
}

function FunnelRow({
  label,
  value,
  base,
  color,
}: {
  label: string
  value: number
  base: number
  color: string
}) {
  const pct = base > 0 ? Math.round((value / base) * 100) : 0
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-zinc-500">
          {value.toLocaleString()}명 · {pct}%
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div className={`${color} h-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function SmallStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-zinc-700 dark:text-zinc-300">
        {value.toLocaleString()}
      </p>
    </div>
  )
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
      {children}
    </th>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 align-middle">{children}</td>
}
