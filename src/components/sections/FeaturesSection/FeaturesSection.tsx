'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, Bell, LayoutGrid } from 'lucide-react'
import { features } from '@/config/features'
import { fadeInUp, staggerChildren } from '@/lib/motion-variants'

const iconMap = { Search, Bell, LayoutGrid } as Record<string, React.ElementType>

export function FeaturesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} id="funcionalidades" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-10 sm:mb-16"
        >
          <motion.p variants={fadeInUp} className="text-xs sm:text-sm font-medium text-[var(--color-primary)] mb-3 uppercase tracking-widest">
            Possibilidades
          </motion.p>
          <motion.h2 variants={fadeInUp} className="font-bold text-white">
            Com a Sakura Pass no WhatsApp você:{' '}
            <span className="gradient-text">busca passagens por conversa</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-sm sm:text-base text-[var(--color-muted)] max-w-2xl mx-auto">
            Transforma pedidos soltos de clientes em pesquisas, alertas e orçamentos claros — sem trocar entre várias abas.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {features.map((feature) => {
            const Icon = iconMap[feature.icon]
            return (
              <motion.div
                key={feature.id}
                variants={fadeInUp}
                className="glass-card rounded-2xl p-5 sm:p-6 hover:border-pink-500/30 transition-all duration-300 group"
              >
                <div className="bg-[#0B141A] rounded-xl p-3 mb-5 space-y-2">
                  {feature.exampleMessage.map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span className={`text-[11px] rounded-lg px-2.5 py-1.5 max-w-[85%] leading-relaxed ${
                        msg.from === 'user' ? 'bg-[#005C4B] text-white' : 'bg-[#1F2C34] text-gray-200'
                      }`}>
                        {msg.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/20 flex items-center justify-center shrink-0 group-hover:border-pink-500/40 transition-colors">
                    {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary)]" />}
                  </div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
