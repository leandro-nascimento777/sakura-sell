'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  from: 'user' | 'bot'
  text: string
  type?: 'text' | 'card'
}

const messages: Message[] = [
  { from: 'user', text: 'GRU → FLN, 2 adultos, ida e volta, julho, mais barato?' },
  { from: 'bot', text: 'Pesquisa encontrada! Melhor opção para julho:' },
  {
    from: 'bot',
    type: 'card',
    text: '✈ GRU → FLN\n07:45 → 09:30 | LATAM\nR$ 3.887,00 (2 adultos)\nBagagem incluída',
  },
  { from: 'bot', text: '👆 Toque para enviar ao cliente' },
]

export function WhatsAppMock() {
  const [visible, setVisible] = useState<Message[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index >= messages.length) {
      const reset = setTimeout(() => { setVisible([]); setIndex(0) }, 3000)
      return () => clearTimeout(reset)
    }
    const delay = index === 0 ? 600 : 1200
    const timer = setTimeout(() => {
      setVisible((prev) => [...prev, messages[index]])
      setIndex((i) => i + 1)
    }, delay)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div className="relative w-[280px] rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10">
      {/* WhatsApp Header */}
      <div className="flex items-center gap-3 bg-[#1F2C34] px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
          S
        </div>
        <div>
          <p className="text-[13px] font-semibold text-white leading-none">Sakura Pass</p>
          <p className="text-[11px] text-green-400">online agora</p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="min-h-[220px] bg-[#0B141A] px-3 py-4 flex flex-col gap-2"
        style={{ backgroundImage: "url('/images/whatsapp-bg.png')", backgroundSize: '400px' }}
      >
        <AnimatePresence>
          {visible.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-[12px] leading-relaxed whitespace-pre-line ${
                  msg.from === 'user'
                    ? 'bg-[#005C4B] text-white rounded-tr-sm'
                    : msg.type === 'card'
                    ? 'bg-[#1F2C34] text-white rounded-tl-sm border border-pink-500/30 font-mono'
                    : 'bg-[#1F2C34] text-white rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {index < messages.length && index > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-[#1F2C34] rounded-xl rounded-tl-sm px-4 py-2 flex gap-1 items-center">
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  className="w-1.5 h-1.5 rounded-full bg-gray-400"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, delay: dot * 0.15, repeat: Infinity }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input bar */}
      <div className="bg-[#1F2C34] px-3 py-2 flex items-center gap-2">
        <div className="flex-1 bg-[#2A3942] rounded-full px-3 py-1.5 text-[11px] text-gray-500">
          Digite uma busca...
        </div>
        <div className="w-8 h-8 rounded-full bg-[#00A884] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
