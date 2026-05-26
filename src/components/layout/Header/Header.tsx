'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/cn'
import { siteConfig } from '@/config/site'
import { MobileMenu } from './MobileMenu'

const navLinks = [
  { label: 'Funcionalidades', href: '/funcionalidades' },
  { label: 'Preços', href: '/precos' },
  { label: 'Como funciona', href: '/como-funciona' },
  { label: 'Parceiros', href: '/parceiros' },
]

export function Header() {
  const scrolled = useScrolled(50)

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[var(--color-glass)] backdrop-blur-[20px] saturate-180 border-b border-white/8 shadow-lg shadow-black/20'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-white">
              sakura<span className="gradient-text">✿</span>
            </span>
            <span className="text-[10px] font-medium text-[var(--color-muted)] uppercase tracking-widest">
              PASS
            </span>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--color-muted)] hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTAs Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={siteConfig.links.login}
              className="text-sm text-[var(--color-muted)] hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Link
              href={siteConfig.links.trial}
              className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] transition-colors duration-200 shadow-lg shadow-pink-500/25"
            >
              Começar no WhatsApp
            </Link>
          </div>

          {/* Mobile Menu */}
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </motion.header>
  )
}
