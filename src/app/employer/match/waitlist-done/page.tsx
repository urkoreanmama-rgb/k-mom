import Link from 'next/link'

export const metadata = { title: '대기 등록 완료 · K-MOM' }

export default function WaitlistDonePage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-20 text-center">
      <span className="text-5xl">📝</span>
      <h1 className="mt-4 text-3xl font-bold">무료 대기 등록 완료</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        조건에 맞는 후보가 등록되면 알려드릴게요. 결제는 발생하지 않았습니다.
      </p>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 text-left dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium">다음 단계</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          <li>조건에 맞는 학생이 K-MOM에 새로 등록되면 이메일·문자로 안내</li>
          <li>최소 3명 이상 모이면 미리보기팩 결제 안내</li>
          <li>대기 등록은 무료이며 언제든 취소할 수 있습니다</li>
        </ul>
      </div>

      <Link
        href="/employer/match"
        className="mt-8 inline-flex h-11 items-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
      >
        다른 조건으로 다시 검색
      </Link>
    </main>
  )
}
