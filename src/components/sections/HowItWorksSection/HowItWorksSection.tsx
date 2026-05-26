'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Smartphone, MessageSquare, Send } from 'lucide-react'
import { fadeInUp, staggerChildren } from '@/lib/motion-variants'

const steps = [
  {
    icon: Smartphone,
    title: 'Conecta seu número',
    description: 'Vincule o WhatsApp da sua agência à Sakura Pass em menos de 2 minutos. Sem senha, sem app extra.',
  },
  {
    icon: MessageSquare,
    title: 'Agente pergunta via WhatsApp',
    description: 'Seu agente envia a solicitação do cliente diretamente no WhatsApp. A IA entende a intenção naturalmente.',
  },
  {
    icon: Send,
    title: 'IA responde + orçamento pronto',
    description: 'Em segundos, a Sakura devolve as opções de voo com tarifas, regras e botão para enviar ao cliente.',
  },
]

export function HowItWorksSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg-card)]">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-10 sm:mb-16"
        >
          <motion.p variants={fadeInUp} className="text-xs sm:text-sm font-medium text-[var(--color-primary)] mb-3 uppercase tracking-widest">
            Como funciona
          </motion.p>
          <motion.h2 variants={fadeInUp} className="font-bold text-white">
            Do pedido ao orçamento em{' '}
            <span className="gradient-text">3 passos</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 relative"
        >
          {/* Connector line — desktop only */}
          <div className="hidden sm:block absolute top-10 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />

          {/* Vertical connector — mobile only */}
          <div className="sm:hidden absolute left-10 top-20 bottom-20 w-px bg-gradient-to-b from-transparent via-pink-500/30 to-transparent" />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="flex sm:flex-col items-start sm:items-center gap-5 sm:gap-0 sm:text-center"
              >
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/30 flex items-center justify-center shadow-lg shadow-pink-500/10">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--color-primary)]" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[var(--color-primary)] text-white text-[10px] sm:text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <div className="sm:mt-6">
                  <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
