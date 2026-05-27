'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: number
  from: 'user' | 'bot'
  text: string
  type?: 'text' | 'card'
}

const SCRIPT: Omit<Message, 'id'>[] = [
  { from: 'user', text: 'GRU → FLN, 2 adultos, ida e volta, julho, mais barato?' },
  { from: 'bot',  text: 'Pesquisa encontrada! Melhor opção para julho:' },
  { from: 'bot',  type: 'card', text: '✈ GRU → FLN\n07:45 → 09:30 | LATAM\nR$ 3.887,00 (2 adultos)\nBagagem incluída' },
  { from: 'bot',  text: '👆 Toque para enviar ao cliente' },
]

function wait(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

// ─── Inner chat (re-mounted each loop) ───────────────────────────────────────

function ChatInner({ onDone }: { onDone: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping]     = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Keep scroll pinned to bottom
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  // Run the message sequence once
  useEffect(() => {
    let cancelled = false

    async function run() {
      await wait(700)

      for (let i = 0; i < SCRIPT.length; i++) {
        if (cancelled) return
        const msg = SCRIPT[i]

        if (msg.from === 'bot') {
          setTyping(true)
          await wait(msg.type === 'card' ? 1500 : 950)
          if (cancelled) return
          setTyping(false)
          await wait(80)
        }

        if (cancelled) return
        setMessages(prev => [...prev, { ...msg, id: Date.now() + i }])

        if (i < SCRIPT.length - 1) {
          await wait(msg.from === 'user' ? 800 : 650)
        }
      }

      // Hold complete conversation, then signal parent to loop
      await wait(4200)
      if (!cancelled) onDone()
    }

    run()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* Fixed-height message area — no resize, messages rise from bottom */}
      <div
        ref={scrollRef}
        className="h-[220px] bg-[#0B141A] px-3 py-3 flex flex-col gap-2 overflow-hidden"
      >
        {/* Pushes content to bottom */}
        <div className="flex-1" />

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              className={`flex shrink-0 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[12px] leading-relaxed whitespace-pre-line ${
                msg.from === 'user'
                  ? 'bg-[#005C4B] text-white rounded-tr-sm'
                  : msg.type === 'card'
                  ? 'bg-[#1F2C34] text-white rounded-tl-sm border border-pink-500/30 font-mono'
                  : 'bg-[#1F2C34] text-white rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing dots */}
        <AnimatePresence>
          {typing && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="flex justify-start shrink-0"
            >
              <div className="bg-[#1F2C34] rounded-xl rounded-tl-sm px-4 py-2 flex gap-1 items-center">
                {[0, 1, 2].map((dot) => (
                  <motion.div
                    key={dot}
                    className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.55, delay: dot * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

// ─── Shell (stable size, loops ChatInner) ────────────────────────────────────

export function WhatsAppMock() {
  const [iteration, setIteration] = useState(0)

  return (
    <div className="relative w-[280px] rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10 select-none">

      {/* Header — never moves */}
      <div className="flex items-center gap-3 bg-[#1F2C34] px-4 py-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
          S
        </div>
        <div>
          <p className="text-[13px] font-semibold text-white leading-none">Sakura Pass</p>
          <p className="text-[11px] text-green-400">online agora</p>
        </div>
      </div>

      {/* Chat — re-mounted each loop via key */}
      <ChatInner key={iteration} onDone={() => setIteration(i => i + 1)} />

      {/* Input bar — never moves */}
      <div className="bg-[#1F2C34] px-3 py-2 flex items-center gap-2 shrink-0">
        <div className="flex-1 bg-[#2A3942] rounded-full px-3 py-1.5 text-[11px] text-gray-500">
          Digite uma busca...
        </div>
        <div className="w-8 h-8 rounded-full bg-[#00A884] flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
