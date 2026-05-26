'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { siteConfig } from '@/config/site'

interface NavLink {
  label: string
  href: string
}

interface MobileMenuProps {
  links: NavLink[]
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        className="p-2 text-white"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute top-16 left-0 right-0 bg-[var(--color-bg-card)] border-b border-white/8 overflow-hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm text-[var(--color-muted)] hover:text-white transition-colors border-b border-white/5 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={siteConfig.links.trial}
                onClick={() => setOpen(false)}
                className="mt-3 w-full rounded-full bg-[var(--color-primary)] py-3 text-center text-sm font-semibold text-white"
              >
                Começar grátis
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
