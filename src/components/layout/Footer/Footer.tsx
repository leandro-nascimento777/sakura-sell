import Link from 'next/link'
import { siteConfig } from '@/config/site'

const footerLinks = {
  Produto: [
    { label: 'Funcionalidades', href: '/funcionalidades' },
    { label: 'Planos e Preços', href: '/precos' },
    { label: 'Como funciona', href: '/como-funciona' },
    { label: 'API para parceiros', href: '/parceiros' },
    { label: 'Changelog', href: '/changelog' },
  ],
  Empresa: [
    { label: 'Sobre a Sakura', href: '/sobre' },
    { label: 'Blog', href: '/blog' },
    { label: 'Casos de sucesso', href: '/casos' },
    { label: 'Parceiros', href: '/parceiros' },
    { label: 'Contato', href: '/contato' },
  ],
  Suporte: [
    { label: 'Central de ajuda', href: '/ajuda' },
    { label: 'Termos de uso', href: '/termos-de-uso' },
    { label: 'Política de privacidade', href: '/politica-de-privacidade' },
    { label: 'Status do sistema', href: '/status' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[var(--color-bg-card)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="text-xl font-bold text-white">sakura<span className="gradient-text">✿</span></span>
              <span className="text-[10px] font-medium text-[var(--color-muted)] uppercase tracking-widest">PASS</span>
            </Link>
            <p className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed max-w-xs">
              A agência de viagens ideal atende melhor, responde mais rápido e mantém o cliente humano.
            </p>
            <div className="mt-4 flex gap-4">
              {[
                { href: siteConfig.social.instagram, label: 'Instagram' },
                { href: siteConfig.social.linkedin, label: 'LinkedIn' },
              ].map(({ href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-[var(--color-muted)] hover:text-white transition-colors min-h-[44px] flex items-center">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs sm:text-sm text-[var(--color-muted)] hover:text-white transition-colors leading-none min-h-[36px] flex items-center">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/8 pt-8">
          <p className="text-xs text-[var(--color-muted)] text-center sm:text-left">
            © 2025 Sakura Consolidadora. Todos os direitos reservados.
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            Desenvolvido com ♥ pela{' '}
            <a href="https://gufly.com" className="hover:text-white transition-colors">Gufly</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
