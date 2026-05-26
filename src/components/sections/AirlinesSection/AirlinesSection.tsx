import { airlines } from '@/config/airlines'

export function AirlinesSection() {
  const doubled = [...airlines, ...airlines]

  return (
    <section className="py-10 sm:py-12 border-y border-white/8 bg-[var(--color-bg-card)] overflow-hidden">
      <p className="text-center text-[10px] sm:text-xs uppercase tracking-widest text-[var(--color-muted)] mb-6 sm:mb-8 px-4">
        Integrado com as principais companhias aéreas
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[var(--color-bg-card)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[var(--color-bg-card)] to-transparent z-10 pointer-events-none" />
        <div className="airlines-track">
          {doubled.map((airline, i) => (
            <div
              key={`${airline.name}-${i}`}
              className="flex items-center justify-center mx-6 sm:mx-8 opacity-40 hover:opacity-80 transition-opacity duration-300"
              style={{ minWidth: airline.width }}
            >
              <span className="text-white font-bold text-sm sm:text-lg tracking-wide whitespace-nowrap">
                {airline.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
