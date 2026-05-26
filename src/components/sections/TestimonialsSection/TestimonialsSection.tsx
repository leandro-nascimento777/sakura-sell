'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { type Testimonial } from '@/domain/entities/Testimonial'
import { fadeInUp, staggerChildren } from '@/lib/motion-variants'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [current, setCurrent] = useState(0)

  // Auto-advance every 5s
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(id)
  }, [testimonials.length])

  const prev = () => setCurrent((i) => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((i) => (i + 1) % testimonials.length)

  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg-card)]">
      <div className="mx-auto max-w-3xl">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-10 sm:mb-12"
        >
          <motion.p variants={fadeInUp} className="text-xs sm:text-sm font-medium text-[var(--color-primary)] mb-3 uppercase tracking-widest">
            Depoimentos
          </motion.p>
          <motion.h2 variants={fadeInUp} className="font-bold text-white">
            Agências que já confiam na{' '}
            <span className="gradient-text">Sakura Pass</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass-card rounded-2xl p-6 sm:p-10 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-base sm:text-lg text-gray-200 leading-relaxed mb-6 max-w-2xl">
                  &ldquo;{testimonials[current].content}&rdquo;
                </blockquote>
                <p className="font-semibold text-white">{testimonials[current].name}</p>
                <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-0.5">
                  {testimonials[current].role} · {testimonials[current].agency}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <button onClick={prev} className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px]" aria-label="Anterior">
              <ChevronLeft size={18} />
            </button>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-[var(--color-primary)] w-6' : 'bg-white/20 w-2'}`}
                aria-label={`Depoimento ${i + 1}`}
              />
            ))}
            <button onClick={next} className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px]" aria-label="Próximo">
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
