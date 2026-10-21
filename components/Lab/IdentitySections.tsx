import { labQuestions, labTurns } from "@/lib/lab-copy"

export function LabTurns() {
  return (
    <section id="turns" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-8 md:px-8 md:py-12" aria-label="Along the way">
      <div className="mb-10 border-b border-white/10 pb-4">
        <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500 sm:text-[11px]">So far</p>
        <h2 className="font-label mt-2 text-2xl font-light tracking-tight sm:text-3xl md:text-4xl">
          A few turns
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-500">
          Moments from the longer record. The lab is where they overlap.
        </p>
      </div>

      <ol className="border-t border-white/10">
        {labTurns.map((turn) => (
          <li
            key={turn.when + turn.title}
            className="grid grid-cols-1 gap-2 border-b border-white/10 py-7 sm:grid-cols-12 sm:items-baseline sm:gap-8 sm:py-8"
          >
            <p className="font-display text-3xl font-light tracking-[-0.04em] text-white sm:col-span-3 sm:text-4xl">
              {turn.when}
            </p>
            <div className="sm:col-span-9">
              <h3 className="font-label text-lg font-light tracking-tight text-white sm:text-xl">{turn.title}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500">{turn.line}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function LabQuestions() {
  return (
    <section id="questions" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-8 md:px-8 md:py-14" aria-label="Questions">
      <div className="mb-10 border-b border-white/10 pb-4">
        <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500 sm:text-[11px]">Lab</p>
        <h2 className="font-label mt-2 text-2xl font-light tracking-tight sm:text-3xl md:text-4xl">
          Questions
        </h2>
      </div>

      <dl className="border-t border-white/10">
        {labQuestions.map((item) => (
          <div key={item.question} className="grid grid-cols-1 gap-3 border-b border-white/10 py-6 md:grid-cols-12 md:gap-10 md:py-8">
            <dt className="font-display text-xl font-light tracking-[-0.03em] text-white md:col-span-5 md:text-2xl">
              {item.question}
            </dt>
            <dd className="max-w-xl text-[15px] leading-relaxed text-neutral-400 md:col-span-7">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
