<div align="center">

# sakura✿ pass — Site de Vendas

**Landing page de alta conversão para a Sakura Pass**
Cotação de passagens aéreas pelo WhatsApp com IA para agências de viagem.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0080?style=flat-square&logo=framer)](https://framer.com/motion)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](#)

[🌐 Ver Site](https://leandro-nascimento777.github.io/sakura-sell) · [📋 Spec](#-spec--requisitos) · [🏗️ Arquitetura](#️-arquitetura-sdd)

</div>

---

## ✨ Funcionalidades

- **Hero animado** com mock de conversa WhatsApp em tempo real
- **Carrossel infinito** de cias aéreas via CSS puro (zero JS overhead)
- **Toggle mensal/anual** nos planos com animação de preço
- **Header glassmorphism** fixo com blur ao scroll
- **Animações de entrada** com Framer Motion + `useInView`
- **SEO técnico completo** — JSON-LD, sitemap, Open Graph, robots.txt
- **Totalmente responsivo** — mobile-first, touch targets >= 44px
- **Segurança** — CSP, HSTS, X-Frame-Options, rate limiting, sanitização de inputs

---

## 🚀 Como rodar

### Pré-requisitos

- Node.js >= 20
- npm >= 10

### Instalação

```bash
git clone https://github.com/leandro-nascimento777/sakura-sell.git
cd sakura-sell
npm install
cp .env.example .env.local
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com Turbopack |
| `npm run build` | Build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | ESLint |
| `npm test` | Testes unitários com Vitest |

### Variáveis de ambiente

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://sakurapass.com.br
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXX
RESEND_API_KEY=re_xxx          # Nunca exposta no cliente
```

---

## 📋 SPEC — Requisitos

### Visão do Produto

A **Sakura Pass** é uma plataforma SaaS para agências de viagem que conecta agentes ao sistema de busca e cotação de passagens aéreas via WhatsApp, com IA. Este repositório contém o **site de vendas**: canal de aquisição principal que apresenta o produto, gera confiança e converte visitantes em assinantes.

### Público-Alvo

| Segmento | Perfil | Dor principal |
|---|---|---|
| Agência solo | 1–3 agentes | Perde tempo cotando manualmente |
| Agência em crescimento | 4–20 agentes | Escalar sem contratar mais |
| Consolidadora / rede | 20+ agentes | Padronização e API própria |

### Seções da Home

| # | Seção | Descrição |
|---|---|---|
| 1 | **Hero** | Headline + subtítulo + CTAs + WhatsApp mock animado |
| 2 | **Airlines** | Carrossel infinito das cias aéreas suportadas |
| 3 | **Features** | Buscas avançadas, Alertas, Ecossistema completo |
| 4 | **How It Works** | Stepper 3 passos: Conecta → Pergunta → Orçamento |
| 5 | **Pricing** | Toggle mensal/anual, 3 planos, card Pro em destaque |
| 6 | **Testimonials** | Carrossel com autoplay de depoimentos reais |
| 7 | **CTA Final** | CTA de fundo escuro com link WhatsApp |
| 8 | **Footer** | Links, redes sociais, créditos |

### Requisitos Não-Funcionais

| Métrica | Meta |
|---|---|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| Lighthouse SEO | >= 95 |
| Lighthouse Performance | >= 90 |
| Bundle JS inicial | < 150 KB gzipped |
| WCAG Acessibilidade | 2.1 AA |

### SEO Strategy

- `Metadata` API do Next.js por rota (title, description, canonical, OG, Twitter Cards)
- Schema.org: `SoftwareApplication`, `Organization`, `FAQPage`
- Sitemap XML gerado programaticamente em build-time
- `robots.txt` via `app/robots.ts`
- Fontes self-hosted via `next/font` (zero round-trip Google Fonts)
- Imagens com `next/image` + WebP/AVIF + lazy loading

### Keywords Target

| Cluster | Keywords |
|---|---|
| Principal | `agência de viagem IA`, `cotação passagens WhatsApp`, `automação agência viagem` |
| Cauda longa | `como automatizar cotação de passagens`, `bot WhatsApp para agências de viagem` |
| Marca | `Sakura Pass`, `Sakura Consolidadora` |

---

## 🏗️ Arquitetura (SDD)

### Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, SSG) |
| Linguagem | TypeScript 5 |
| Estilização | Tailwind CSS v4 |
| Animações | Framer Motion 12 |
| Componentes | Radix UI + shadcn/ui |
| Formulários | React Hook Form + Zod |
| Testes | Vitest + Testing Library + Playwright |
| Deploy | Vercel / GitHub Pages |

### Estrutura de Pastas

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Route group — layout com Header+Footer
│   ├── api/contact/        # API Route com rate limiting + Zod
│   ├── layout.tsx          # Root layout, fontes, JSON-LD global
│   ├── page.tsx            # Home /
│   ├── sitemap.ts          # Sitemap dinâmico
│   └── robots.ts           # robots.txt
│
├── components/
│   ├── ui/                 # Primitivos (shadcn/ui)
│   ├── layout/             # Header (blur), Footer
│   ├── sections/           # Uma pasta por seção da landing page
│   └── common/             # WhatsAppMock, etc.
│
├── domain/                 # Logica de negocio pura
│   ├── entities/           # Plan, Testimonial
│   ├── ports/              # IPricingRepository, ITestimonialRepository
│   └── usecases/           # GetPlansUseCase
│
├── adapters/               # Implementacoes concretas das ports
│   ├── StaticPricingAdapter.ts
│   └── StaticTestimonialAdapter.ts
│
├── lib/                    # Utilitarios
│   ├── cn.ts               # clsx + tailwind-merge
│   ├── metadata.ts         # buildMetadata()
│   ├── schema.ts           # JSON-LD builders
│   ├── motion-variants.ts  # Framer Motion variants reutilizaveis
│   ├── sanitize.ts         # Sanitizacao de inputs (anti-XSS)
│   └── rateLimit.ts        # Rate limiter in-memory
│
├── hooks/
│   ├── useScrolled.ts      # Blur do Header
│   └── usePricingToggle.ts # Toggle mensal/anual
│
├── config/                 # Fonte unica da verdade
│   ├── site.ts             # URL, WhatsApp, social links
│   ├── plans.ts            # Dados dos 3 planos
│   ├── features.ts         # Features cards
│   └── airlines.ts         # Lista de cias aereas
│
├── middleware.ts            # Edge: bloqueia scanners, payload oversized
└── styles/globals.css       # Design tokens, keyframes, utilities
```

### Principios SOLID

| Principio | Aplicacao |
|---|---|
| **S** Single Responsibility | Cada componente, hook e use case tem responsabilidade unica |
| **O** Open/Closed | Componentes extensiveis via props/variantes sem modificar internals |
| **L** Liskov Substitution | Qualquer adapter que implemente `IPricingRepository` e intercambivel |
| **I** Interface Segregation | Ports pequenas e focadas |
| **D** Dependency Inversion | Use cases dependem de abstracoes (ports), nao de implementacoes |

### Seguranca

| Camada | Protecao |
|---|---|
| `next.config.ts` | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| `src/middleware.ts` | Bloqueia scanners (sqlmap, nikto, nmap...), rejeita payloads > 10 KB |
| `src/lib/rateLimit.ts` | Max. 5 req/min por IP em rotas de API |
| `src/lib/sanitize.ts` | Strip de HTML tags em todos os inputs |
| Variaveis de ambiente | API keys exclusivamente server-side |

### Decisoes de Design (ADRs)

**ADR-001: Next.js App Router com SSG**
Todas as paginas estaticas sao pre-geradas em build-time. RSC elimina JS desnecessario no cliente.

**ADR-002: Tailwind v4 sem config JS**
Design tokens via CSS variables nativas. Build mais rapido. Sem arquivo `tailwind.config.js`.

**ADR-003: Carrossel airlines via CSS puro**
Keyframe `airlines-scroll` no CSS evita JS no critical path. Pausa no hover via `animation-play-state`.

**ADR-004: Rate limiter in-memory para MVP**
Map em Node.js suficiente para instancia unica. Para multi-instancia migrar para Upstash Redis.

---

## 📦 Deploy

### Vercel (recomendado)

```bash
npm i -g vercel
vercel deploy
```

### GitHub Pages

O repositorio esta configurado com GitHub Actions para deploy automatico a cada push na branch `main`.
Acesse: **https://leandro-nascimento777.github.io/sakura-sell**

---

## 🤝 Contribuindo

1. Fork o repositorio
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m 'feat: adiciona minha feature'`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📄 Licenca

Proprietario — 2025 Sakura Consolidadora. Todos os direitos reservados.

---

<div align="center">
Desenvolvido com amor por <a href="https://gufly.com">Gufly</a>
</div>
