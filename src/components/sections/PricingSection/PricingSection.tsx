'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, X } from 'lucide-react'
import Link from 'next/link'
import { usePricingToggle } from '@/hooks/usePricingToggle'
import { plans } from '@/config/plans'
import { cn } from '@/lib/cn'
import { fadeInUp, staggerChildren } from '@/lib/motion-variants'

export function PricingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { billing, setBilling, getPrice, discount } = usePricingToggle()

  return (
    <section ref={ref} id="precos" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-10 sm:mb-12"
        >
          <motion.p variants={fadeInUp} className="text-xs sm:text-sm font-medium text-[var(--color-primary)] mb-3 uppercase tracking-widest">
            Planos
          </motion.p>
          <motion.h2 variants={fadeInUp} className="font-bold text-white">
            Escolha o plano ideal
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-2 text-sm sm:text-base text-[var(--color-muted)]">
            Sem contrato de fidelidade. Cancele quando quiser.
          </motion.p>

          {/* Toggle */}
          <motion.div variants={fadeInUp} className="mt-6 inline-flex items-center gap-1 rounded-full border border-white/10 bg-[var(--color-bg-card)] p-1">
            {(['monthly', 'annual'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 flex items-center gap-2 min-h-[36px]',
                  billing === b
                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                    : 'text-[var(--color-muted)] hover:text-white',
                )}
              >
                {b === 'monthly' ? 'Mensal' : 'Anual'}
                {b === 'annual' && (
                  <span className="rounded-full bg-green-500/20 border border-green-500/40 px-1.5 py-0.5 text-[10px] text-green-400 font-semibold whitespace-nowrap">
                    -{Math.round(discount * 100)}%
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={fadeInUp}
              className={cn(
                'rounded-2xl p-5 sm:p-6 relative flex flex-col',
                plan.highlighted
                  ? 'bg-gradient-to-br from-pink-500/15 to-purple-600/15 border-2 border-pink-500/60 shadow-2xl shadow-pink-500/20 lg:scale-105'
                  : 'glass-card',
              )}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white whitespace-nowrap shadow-lg">
                  {plan.badge}
                </span>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-[var(--color-muted)]">{plan.description}</p>
              </div>

              <div className="mb-5">
                {plan.monthlyPrice !== null ? (
                  <div className="flex items-end gap-1">
                    <motion.span
                      key={`${plan.id}-${billing}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl sm:text-4xl font-bold text-white tabular-nums"
                    >
                      R$ {getPrice(plan.monthlyPrice)}
                    </motion.span>
                    <span className="text-[var(--color-muted)] mb-1 text-sm">/mês</span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-white">Sob consulta</span>
                )}
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature.label} className="flex items-start gap-2.5 text-sm">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-white/20 shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-gray-200' : 'text-[var(--color-muted)]'}>
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                target={plan.ctaHref.startsWith('https') ? '_blank' : undefined}
                rel={plan.ctaHref.startsWith('https') ? 'noopener noreferrer' : undefined}
                className={cn(
                  'block w-full rounded-full py-3 text-center text-sm font-semibold transition-all duration-200 min-h-[48px] flex items-center justify-center',
                  plan.highlighted
                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-pink-500/30 hover:bg-[var(--color-primary-hover)] hover:-translate-y-0.5 active:scale-95'
                    : 'border border-white/15 text-white hover:bg-white/5 active:scale-95',
                )}
              >
                {plan.ctaLabel}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
