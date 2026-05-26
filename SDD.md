# SDD — Software Design Document · Sakura Pass Site de Vendas

> Versão 1.0 · 2026-05-26  
> Status: Draft  
> Owner: Leandro (leandro@gufly.com)

---

## 1. Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | **Next.js 15** (App Router) | SSG/SSR nativo, RSC, `next/image`, `next/font` — melhor SEO do mercado |
| Linguagem | **TypeScript 5.x** | Type safety, SOLID facilitado |
| Estilização | **Tailwind CSS v4** | Utility-first, design tokens nativos, purge automático |
| Animações | **Framer Motion 11** | Declarativo, performance via GPU, `useInView` para entrance animations |
| Componentes | **Radix UI** (primitivos) + **shadcn/ui** | Acessibilidade WCAG built-in, sem opinião visual |
| Formulários | **React Hook Form** + **Zod** | Validação type-safe, performance otimizada |
| Conteúdo Blog | **Contentlayer 2** + **MDX** | Type-safe MDX, build-time parsing, frontmatter tipado |
| Testes unit | **Vitest** + **@testing-library/react** | Velocidade, compatibilidade com Vite transform |
| Testes E2E | **Playwright** | Cross-browser, screenshot diff, CI-friendly |
| Linting | **ESLint** (next/core-web-vitals) + **Prettier** | Consistência de código |
| CI/CD | **GitHub Actions** + **Vercel** | Preview deploys automáticos por PR |
| Analytics | **@next/third-parties** (GA4) | Carregamento otimizado, sem penalidade de performance |

---

## 2. Arquitetura Geral

```
Sakura-sell/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (marketing)/            # Route group — layout de marketing
│   │   │   ├── page.tsx            # Home /
│   │   │   ├── funcionalidades/
│   │   │   ├── precos/
│   │   │   ├── como-funciona/
│   │   │   ├── parceiros/
│   │   │   └── blog/
│   │   ├── (legal)/                # Route group — termos, privacidade
│   │   ├── sitemap.ts              # Sitemap gerado programaticamente
│   │   ├── robots.ts               # robots.txt
│   │   └── layout.tsx              # Root layout — fontes, providers, analytics
│   │
│   ├── components/
│   │   ├── ui/                     # Primitivos (shadcn/ui) — Button, Card, Badge...
│   │   ├── layout/                 # Header, Footer, Navigation
│   │   ├── sections/               # Seções da landing page
│   │   │   ├── HeroSection/
│   │   │   ├── AirlinesSection/
│   │   │   ├── FeaturesSection/
│   │   │   ├── HowItWorksSection/
│   │   │   ├── PricingSection/
│   │   │   ├── TestimonialsSection/
│   │   │   └── CtaSection/
│   │   ├── common/                 # WhatsAppMock, AnimatedCounter, etc.
│   │   └── blog/                   # BlogCard, BlogGrid, Mdx renderer
│   │
│   ├── domain/                     # Lógica de negócio pura (sem dependências de framework)
│   │   ├── entities/               # Plan, Testimonial, BlogPost, Feature
│   │   ├── ports/                  # Interfaces de repositório (ISP)
│   │   │   ├── IBlogRepository.ts
│   │   │   ├── ITestimonialRepository.ts
│   │   │   └── IPricingRepository.ts
│   │   └── usecases/               # GetPlansUseCase, GetFeaturedPostsUseCase
│   │
│   ├── adapters/                   # Implementações concretas das ports
│   │   ├── ContentlayerBlogAdapter.ts
│   │   ├── StaticPricingAdapter.ts
│   │   └── StaticTestimonialAdapter.ts
│   │
│   ├── lib/                        # Utilitários e helpers
│   │   ├── cn.ts                   # clsx + tailwind-merge
│   │   ├── metadata.ts             # Gerador de metadata Next.js
│   │   ├── schema.ts               # JSON-LD builders
│   │   └── analytics.ts            # Helpers de eventos GA4
│   │
│   ├── hooks/                      # Custom hooks React
│   │   ├── useScrolled.ts          # Detecta scroll para blur do header
│   │   ├── usePricingToggle.ts     # Mensal / Anual
│   │   └── useIntersectionReveal.ts
│   │
│   ├── config/
│   │   ├── site.ts                 # siteUrl, siteName, social links
│   │   ├── plans.ts                # Dados dos planos (fonte única da verdade)
│   │   ├── features.ts             # Lista de funcionalidades
│   │   └── airlines.ts             # Lista de cias aéreas
│   │
│   └── styles/
│       ├── globals.css             # Tailwind directives + CSS vars de tema
│       └── animations.css          # Keyframes customizados
│
├── content/                        # MDX do blog (Contentlayer)
│   └── posts/
├── public/
│   ├── images/
│   ├── icons/
│   └── og/                         # OG images estáticas
├── tests/
│   ├── unit/
│   └── e2e/
└── ...config files
```

---

## 3. Princípios SOLID Aplicados

### S — Single Responsibility
Cada componente tem responsabilidade única:
- `HeroSection` → apenas renderiza o Hero
- `WhatsAppMock` → apenas simula a conversa animada
- `PricingCard` → apenas exibe um plano
- `useScrolled` → apenas detecta scroll

### O — Open/Closed
Componentes extensíveis via props sem modificar o core:
```typescript
// Aberto para extensão via variantes, fechado para modificação
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}
```

### L — Liskov Substitution
Adaptadores de dados são intercambiáveis:
```typescript
// Qualquer adapter que implemente IBlogRepository pode ser injetado
interface IBlogRepository {
  getAll(): Promise<BlogPost[]>
  getBySlug(slug: string): Promise<BlogPost | null>
  getFeatured(limit: number): Promise<BlogPost[]>
}
```

### I — Interface Segregation
Ports pequenas e focadas — `IBlogRepository` não mistura lógica de pricing.  
Componentes recebem apenas as props que precisam, sem "prop drilling" desnecessário.

### D — Dependency Inversion
Use cases dependem de abstrações (ports), não de implementações concretas:
```typescript
class GetFeaturedPostsUseCase {
  constructor(private readonly blog: IBlogRepository) {}
  async execute(limit = 3): Promise<BlogPost[]> {
    return this.blog.getFeatured(limit)
  }
}
```

---

## 4. Design de Componentes Principais

### 4.1 Header

```typescript
// components/layout/Header/Header.tsx
// Responsabilidades:
// - Renderizar logo, nav e CTAs
// - Aplicar blur + sombra suave ao rolar
// - Fechar menu mobile ao navegar

interface HeaderProps {
  transparent?: boolean  // hero usa versão transparente
}
```

**Comportamento de scroll**:
```css
/* Estado inicial */
header { background: transparent; backdrop-filter: none; }

/* Após 50px de scroll */
header { 
  background: rgba(13, 13, 26, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
```

Implementado via `useScrolled` hook + Framer Motion `animate` prop.

---

### 4.2 HeroSection

```
┌─────────────────────────────────────────────────────┐
│  [Gradient BG]                                      │
│                                                     │
│   Faça seu orçamento em          ┌──────────────┐   │
│   2 min direto pelo              │ WhatsApp     │   │
│   WhatsApp              ←fade    │ Mock         │   │
│                                  │ (animado)    │   │
│   [Assinar agora] [Ver demo]     └──────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**WhatsApp Mock Animation** — sequência de mensagens com `useEffect` + `setTimeout`:
```typescript
const messages = [
  { from: 'user', text: 'GRU → FLN, 2 adultos, ida e volta em julho', delay: 0 },
  { from: 'bot', text: 'Pesquisa encontrada! Melhor opção:', delay: 1200 },
  { from: 'bot', type: 'card', data: flightCard, delay: 2000 },
  { from: 'bot', text: 'Toque para enviar ao cliente →', delay: 3200 },
]
```

---

### 4.3 PricingSection

**Estado gerenciado por `usePricingToggle`:**
```typescript
function usePricingToggle() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const discount = 0.3
  const price = (base: number) =>
    billing === 'annual' ? Math.round(base * (1 - discount)) : base
  return { billing, setBilling, price }
}
```

**Dados centralizados em `config/plans.ts`** — fonte única, compartilhada entre a Home e `/precos`.

---

### 4.4 AirlinesSection (carrossel infinito)

Implementado com CSS `animation: scroll linear infinite` — sem JavaScript para melhor performance:
```css
@keyframes scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.track { display: flex; width: max-content; animation: scroll 30s linear infinite; }
/* Duplica os logos para criar loop seamless */
```

---

## 5. SEO Architecture

### 5.1 Metadata por página (Next.js Metadata API)

```typescript
// lib/metadata.ts
export function buildMetadata({
  title,
  description,
  path,
  image,
}: MetadataInput): Metadata {
  const url = `${siteConfig.url}${path}`
  return {
    title: `${title} | Sakura Pass`,
    description,
    alternates: { canonical: url },
    openGraph: { url, title, description, images: [image ?? defaultOgImage] },
    twitter: { card: 'summary_large_image', title, description },
  }
}
```

### 5.2 JSON-LD Schema.org

Builders tipados em `lib/schema.ts`:

```typescript
export const softwareAppSchema = (): WithContext<SoftwareApplication> => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Sakura Pass',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'WhatsApp',
  offers: plans.map(planToOffer),
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '120' },
})

export const faqSchema = (items: FAQ[]): WithContext<FAQPage> => ({ ... })
```

Injetado via `<Script type="application/ld+json">` em RSC — zero runtime JS.

### 5.3 Sitemap dinâmico

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await blogRepository.getAll()
  const staticRoutes = ['/','funcionalidades','precos','como-funciona','parceiros']
  return [
    ...staticRoutes.map(route => ({ url: `${siteUrl}/${route}`, changeFrequency: 'monthly', priority: route === '' ? 1 : 0.8 })),
    ...posts.map(post => ({ url: `${siteUrl}/blog/${post.slug}`, lastModified: post.updatedAt, changeFrequency: 'weekly', priority: 0.6 })),
  ]
}
```

---

## 6. Performance Architecture

### 6.1 Imagens
- `next/image` com `sizes` prop por breakpoint
- Formato AVIF com fallback WebP
- Logos SVG inline quando possível
- OG images geradas com `@vercel/og` em Edge Runtime

### 6.2 Fontes
```typescript
// app/layout.tsx
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})
```
Self-hosted via `next/font` — elimina round-trip para Google Fonts.

### 6.3 Bundle Splitting
- Framer Motion: importado via `LazyMotion` com feature bundle mínimo
- Ícones: `lucide-react` tree-shakeable (import individual)
- Seções below-the-fold: `React.lazy` + `Suspense`

### 6.4 Critical CSS
Tailwind v4 purga classes não usadas. CSS crítico inline via Next.js automático.

---

## 7. Animações — Design System

### Tokens de animação (globals.css)
```css
:root {
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 200ms;
  --duration-base: 400ms;
  --duration-slow: 700ms;
}
```

### Variantes Framer Motion reutilizáveis
```typescript
// lib/motion-variants.ts
export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
}

export const staggerChildren = {
  visible: { transition: { staggerChildren: 0.12 } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
}
```

### Parallax no Hero
```typescript
const { scrollY } = useScroll()
const y = useTransform(scrollY, [0, 500], [0, -80])
// Aplicado no background gradient do Hero — movimento sutil
```

### Respeita `prefers-reduced-motion`
```typescript
const prefersReducedMotion = useReducedMotion()
const variants = prefersReducedMotion ? {} : fadeInUp
```

---

## 8. Testes

### 8.1 Unitários (Vitest)
```
tests/unit/
├── components/
│   ├── PricingCard.test.tsx     — renderização e variantes
│   ├── WhatsAppMock.test.tsx    — sequência de animação
│   └── Header.test.tsx          — blur em scroll
├── hooks/
│   ├── usePricingToggle.test.ts — toggle + cálculo de desconto
│   └── useScrolled.test.ts
└── domain/
    └── GetFeaturedPostsUseCase.test.ts
```

### 8.2 E2E (Playwright)
```
tests/e2e/
├── home.spec.ts         — Golden path: hero → planos → CTA
├── pricing.spec.ts      — Toggle mensal/anual
├── blog.spec.ts         — Listagem e artigo individual
└── accessibility.spec.ts — axe-core scan em todas as páginas
```

### 8.3 Visual Regression
Playwright screenshots + CI comparison em PRs.

---

## 9. CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]

jobs:
  quality:
    steps:
      - tsc --noEmit
      - eslint + prettier check
      - vitest --coverage (≥80%)
      
  e2e:
    steps:
      - playwright install
      - next build
      - playwright test
      
  lighthouse:
    steps:
      - Deploy preview Vercel
      - lhci autorun (assert LCP<2.5s, scores≥95)

  deploy:
    needs: [quality, e2e, lighthouse]
    steps:
      - vercel deploy --prod
```

---

## 10. Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://sakurapass.com.br
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXX
NEXT_PUBLIC_WHATSAPP_CTA_URL=https://wa.me/5511XXXXXXXXX
RESEND_API_KEY=re_xxx          # Email do formulário Enterprise
```

---

## 11. Decisões de Design (ADRs)

### ADR-001: Next.js 15 App Router
**Decisão**: Usar App Router com RSC  
**Motivo**: Server Components eliminam JS desnecessário no cliente; `generateMetadata` por rota é mais ergonômico que `Head`; streaming HTML melhora TTFB  
**Tradeoff**: Curva de aprendizado em RSC vs Client Components

### ADR-002: Tailwind v4
**Decisão**: Tailwind CSS v4 (beta estável)  
**Motivo**: CSS-native variables, melhor performance no build, sem config JS  
**Tradeoff**: Menos recursos na comunidade que v3

### ADR-003: Contentlayer para Blog
**Decisão**: Contentlayer + MDX em vez de CMS externo  
**Motivo**: Build-time parsing, type-safe, zero custo, controle total no Git  
**Tradeoff**: Requer re-deploy para novo post (mitigado com ISR + webhook)

### ADR-004: Radix UI + shadcn/ui
**Decisão**: Primitivos sem estilo com tokens customizados  
**Motivo**: Acessibilidade built-in (focus trap, ARIA, keyboard nav), sem lock-in visual  
**Tradeoff**: Setup inicial mais trabalhoso que bibliotecas opinionadas

---

## 12. Estrutura de Dados

### Plan
```typescript
interface Plan {
  id: 'starter' | 'pro' | 'enterprise'
  name: string
  monthlyPrice: number | null  // null = sob consulta
  highlighted: boolean
  badge?: string
  features: PlanFeature[]
  ctaLabel: string
  ctaHref: string
}
```

### BlogPost
```typescript
interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: Date
  updatedAt: Date
  author: Author
  tags: string[]
  featured: boolean
  image: string
  readingTime: number  // em minutos
  body: MDXContent
}
```

### Testimonial
```typescript
interface Testimonial {
  id: string
  name: string
  role: string
  agency: string
  avatar: string
  content: string
  rating: 1 | 2 | 3 | 4 | 5
}
```

---

## 13. Checklist de Setup Inicial

```bash
# 1. Criar projeto
npx create-next-app@latest sakura-sell \
  --typescript --tailwind --app --src-dir --turbopack

# 2. Instalar dependências
npm install framer-motion @radix-ui/react-navigation-menu \
  @radix-ui/react-dialog lucide-react clsx tailwind-merge \
  react-hook-form zod @hookform/resolvers \
  contentlayer next-contentlayer

npm install -D vitest @testing-library/react @testing-library/jest-dom \
  @playwright/test @types/testing-library__jest-dom

# 3. shadcn/ui
npx shadcr@latest init

# 4. Configurar Contentlayer
# 5. Configurar Vitest
# 6. Configurar Playwright
# 7. Configurar GitHub Actions
# 8. Conectar Vercel
```
