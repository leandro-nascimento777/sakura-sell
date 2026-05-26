'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { fadeInUp, staggerChildren } from '@/lib/motion-variants'

export function CtaSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0D2E] to-[#0D0D1A]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(600px,100vw)] h-[400px] bg-pink-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div variants={staggerChildren} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.div variants={fadeInUp}>
            <span className="text-3xl sm:text-4xl">sakura✿</span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-bold text-white leading-tight">
            Sua agência merece tecnologia{' '}
            <span className="gradient-text">com atendimento de gente.</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-5 sm:mt-6 text-base sm:text-lg text-[var(--color-muted)] leading-relaxed">
            Junte-se a centenas de agências que já operam com IA no WhatsApp. Comece em menos de 2 minutos — sem cadastro, sem senha.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-7 sm:mt-8">
            <Link
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 sm:px-8 py-4 text-sm sm:text-base font-semibold text-white shadow-2xl shadow-pink-500/40 hover:bg-[var(--color-primary-hover)] hover:-translate-y-1 active:scale-95 transition-all duration-200 min-h-[52px] w-full sm:w-auto"
            >
              ✿ Acessar Sakura Pass pelo WhatsApp
            </Link>
          </motion.div>
          <motion.div variants={fadeInUp} className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-[var(--color-muted)]">
            {['Sem contrato', 'Cancele quando quiser', 'Suporte em português'].map((item) => (
              <span key={item} className="whitespace-nowrap">✓ {item}</span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
