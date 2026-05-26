'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { WhatsAppMock } from '@/components/common/WhatsAppMock'
import { fadeInUp, staggerChildren } from '@/lib/motion-variants'
import { siteConfig } from '@/config/site'

export function HeroSection() {
  const { scrollY } = useScroll()
  const prefersReduced = useReducedMotion()
  const bgY = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : -80])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D1A] via-[#1A0D2E] to-[#0D1A2E]" />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-purple-600/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">

          {/* ── Text ── */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs sm:text-sm text-pink-300 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                Automação segura para seu negócio
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-bold leading-tight tracking-tight text-white"
            >
              Faça seu orçamento em{' '}
              <span className="gradient-text glow-text">2 min</span>{' '}
              direto pelo WhatsApp
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-4 sm:mt-6 text-base sm:text-lg text-[var(--color-muted)] leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              A Sakura Pass ajuda sua agência a responder clientes com rapidez, carinho e precisão:
              voos, tarifas, RAV, regras e orçamentos em poucos segundos.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-6 sm:mt-8 flex flex-col xs:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-pink-500/30 hover:bg-[var(--color-primary-hover)] active:scale-95 transition-all duration-200 min-h-[48px]"
              >
                ✿ Assinar agora
              </Link>
              <Link
                href="/como-funciona"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm sm:text-base font-medium text-white hover:bg-white/5 active:scale-95 transition-all duration-200 min-h-[48px]"
              >
                Ver como funciona →
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-6 flex flex-wrap items-center gap-3 sm:gap-6 justify-center lg:justify-start text-xs sm:text-sm text-[var(--color-muted)]"
            >
              {['Sem contrato', 'Cancele quando quiser', 'Suporte em português'].map((item) => (
                <span key={item} className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-green-400">✓</span> {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── WhatsApp Mock ── */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex justify-center order-1 lg:order-2"
          >
            <div className="relative w-full max-w-[280px]">
              <div className="absolute inset-0 bg-pink-500/20 rounded-3xl blur-2xl scale-110" />
              <WhatsAppMock />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
