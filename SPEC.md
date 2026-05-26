# SPEC — Sakura Pass · Site de Vendas

> Versão 1.0 · 2026-05-26  
> Status: Draft  
> Owner: Leandro (leandro@gufly.com)

---

## 1. Visão do Produto

**Sakura Pass** é uma plataforma SaaS para agências de viagem que conecta agentes ao sistema de busca e cotação de passagens aéreas via WhatsApp, com IA. O **site de vendas** é o canal de aquisição principal: apresenta o produto, gera confiança, captura leads e converte visitantes em assinantes.

### Problema
Agências de viagem perdem tempo respondendo clientes manualmente sobre voos — datas, tarifas e regras. A Sakura Pass automatiza esse processo, mas precisa de um site que comunique o valor com clareza e converta bem.

### Proposta de Valor
- Orçamentos de passagens em 2 min direto pelo WhatsApp
- IA que responde com velocidade, carinho e precisão
- Sem trocar entre várias abas
- Sem cadastro no cliente final

---

## 2. Público-Alvo

| Segmento | Perfil | Dor principal |
|---|---|---|
| Agência pequena | 1-3 agentes, baixo volume | Perda de tempo cotando manualmente |
| Agência em crescimento | 4-20 agentes | Escalar atendimento sem contratar |
| Consolidadora / rede | 20+ agentes, múltiplas filiais | Padronização, API própria, SLA |

---

## 3. Objetivos do Site

1. **Awareness** — Comunicar claramente o que é a Sakura Pass
2. **Conversão** — Trial gratuito de 7 dias (planos Starter e Pro)
3. **Confiança** — Logos de cias aéreas, depoimentos, casos de sucesso
4. **SEO orgânico** — Ranquear para termos como "agência de viagem IA WhatsApp", "cotação de passagens automática"

### KPIs
- Taxa de conversão CTR → Trial ≥ 5%
- Tempo médio na página ≥ 2 min
- Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
- Score Lighthouse SEO ≥ 95

---

## 4. Seções / Páginas

### 4.1 Página Principal (`/`)

| # | Seção | Descrição |
|---|---|---|
| 1 | **Hero** | Headline impactante + subtítulo + CTA primário "Assinar agora" + CTA secundário "Ver demo". Mock de conversa WhatsApp animado |
| 2 | **Logos de cias aéreas** | Carrossel infinito: GOL, Azul, Emirates, United, Delta, Itapria, LATAM, Copa, American |
| 3 | **Funcionalidades** | 3 cards: Buscas avançadas / Alertas personalizados / Ecossistema completo — cada card com ícone animado e exemplo de conversa WhatsApp |
| 4 | **Como funciona** | Stepper horizontal 3 passos animado: 1. Conecta o número → 2. Agente pergunta via WhatsApp → 3. IA responde + orçamento pronto |
| 5 | **Planos** | Toggle mensal/anual (economia 30%). 3 cards: Starter R$97 / Pro R$197 / Enterprise. Card Pro em destaque. CTA "Começar com 7 dias grátis" |
| 6 | **Depoimentos** | Carrossel de depoimentos de agências reais |
| 7 | **CTA Final** | Seção escura com headline + botão grande "Acessar Sakura Pass pelo WhatsApp" |
| 8 | **Footer** | Links, redes sociais, links legais |

### 4.2 Páginas secundárias

- `/funcionalidades` — Detalhamento de cada feature
- `/precos` — Tabela comparativa detalhada de planos
- `/como-funciona` — Guia passo a passo
- `/parceiros` — Programa de parceiros / afiliados
- `/blog` — Conteúdo SEO (artigos, casos de sucesso)
- `/termos-de-uso`, `/politica-de-privacidade`, `/changelog`
- `/central-de-ajuda` — FAQ

---

## 5. User Stories

### Visitante (potencial cliente)
```
US-01: Como agente de viagens, quero entender em 10 segundos o que a Sakura Pass faz, para decidir se vale explorar.
US-02: Como agente, quero ver um exemplo real de conversa WhatsApp, para visualizar como usarei no dia a dia.
US-03: Como agente, quero comparar os planos e preços, para escolher o que cabe no meu orçamento.
US-04: Como agente, quero iniciar um trial sem cartão de crédito, para testar sem risco.
US-05: Como gestor de uma rede, quero entender o plano Enterprise, para solicitar uma proposta personalizada.
```

### SEO / Conteúdo
```
US-06: Como visitante vindo do Google, quero que a página carregue em < 2s, para não abandonar antes de ler.
US-07: Como bot do Google, quero encontrar meta tags, schema markup e sitemap, para indexar corretamente.
```

---

## 6. Requisitos Funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF-01 | Header fixo com blur + efeito transparência ao scroll | Alta |
| RF-02 | Animação da conversa WhatsApp no Hero (mensagens aparecendo sequencialmente) | Alta |
| RF-03 | Carrossel infinito de logos de cias aéreas | Alta |
| RF-04 | Toggle mensal/anual nos planos com atualização de preço | Alta |
| RF-05 | Botões CTA com tracking de eventos (GA4 + Meta Pixel) | Alta |
| RF-06 | Formulário de contato para Enterprise (nome, email, telefone, número de agentes) | Média |
| RF-07 | Carrossel de depoimentos com autoplay + navegação manual | Média |
| RF-08 | Blog com MDX, categorias e RSS feed | Média |
| RF-09 | Modo escuro / claro | Baixa |
| RF-10 | i18n — pt-BR (padrão) + en-US | Baixa |

---

## 7. Requisitos Não-Funcionais

| ID | Requisito | Meta |
|---|---|---|
| RNF-01 | Performance — LCP | < 2.5s |
| RNF-02 | Performance — INP | < 200ms |
| RNF-03 | Performance — CLS | < 0.1 |
| RNF-04 | SEO Lighthouse Score | ≥ 95 |
| RNF-05 | Acessibilidade WCAG | 2.1 AA |
| RNF-06 | SOLID + Clean Architecture | Obrigatório |
| RNF-07 | Cobertura de testes | ≥ 80% |
| RNF-08 | Build time | < 60s |
| RNF-09 | Bundle JS inicial | < 150kb gzipped |

---

## 8. Design & Branding

- **Paleta**: Fundo escuro (#0D0D1A), rosa primário (#E91E8C), gradientes roxo/rosa
- **Tipografia**: Inter ou Geist (sistema), display weight nos títulos
- **Motion**: Framer Motion — entrada suave (fade+slide), elementos flutuar, parallax sutil no hero
- **WhatsApp mock**: componente fiel ao visual do WhatsApp com bolhas de mensagem animadas
- **Glassmorphism**: cards com `backdrop-filter: blur` + borda sutil luminosa

---

## 9. SEO Strategy

### On-page
- `<title>` e `<meta description>` únicos por página
- Open Graph + Twitter Cards
- Schema.org: `SoftwareApplication`, `Product`, `FAQPage`, `BreadcrumbList`
- Canonical tags
- Hreflang quando i18n ativo

### Técnico
- SSG para todas as páginas estáticas (Next.js `generateStaticParams`)
- ISR para blog posts (revalidate 3600s)
- `sitemap.xml` e `robots.txt` gerados automaticamente
- Imagens com `next/image` + WebP/AVIF + lazy loading
- Fontes self-hosted para evitar FOUT e chamadas externas

### Conteúdo / Keywords
| Cluster | Keywords |
|---|---|
| Principal | "agência de viagem IA", "cotação de passagens WhatsApp", "automação agência viagem" |
| Cauda longa | "como automatizar cotação de passagens", "bot WhatsApp para agências de viagem" |
| Marca | "Sakura Pass", "Sakura Consolidadora" |

---

## 10. Analytics & Tracking

- Google Analytics 4 (GA4) via `@next/third-parties`
- Meta Pixel para campanhas
- Eventos customizados: `cta_click`, `plan_toggle`, `trial_start`, `contact_form_submit`
- Hotjar ou Microsoft Clarity para heatmaps

---

## 11. Metodologia Ágil

**Framework**: Scrum adaptado (sprints de 1 semana)

### Épicos
| Épico | Descrição |
|---|---|
| E1 | Setup & Infraestrutura |
| E2 | Design System & Componentes Base |
| E3 | Seções da Home |
| E4 | Páginas Secundárias |
| E5 | SEO & Performance |
| E6 | Analytics & Tracking |
| E7 | Testes & QA |
| E8 | Deploy & CI/CD |

### Roadmap macro
| Sprint | Foco |
|---|---|
| S1 | Setup Next.js, design tokens, componentes atômicos, Header/Footer |
| S2 | Hero, logos, Funcionalidades, Como Funciona |
| S3 | Planos, Depoimentos, CTA Final |
| S4 | Páginas secundárias, Blog MDX |
| S5 | SEO técnico, performance, acessibilidade |
| S6 | Analytics, testes E2E, deploy produção |

---

## 12. Critérios de Aceite (DoD)

- [ ] Lighthouse score ≥ 95 em todas as categorias
- [ ] Testes unitários passando com ≥ 80% coverage
- [ ] Testes E2E cobrindo fluxo principal (hero → planos → CTA)
- [ ] Sem erros de TypeScript (`tsc --noEmit`)
- [ ] ESLint + Prettier sem warnings
- [ ] Deploy automático via CI/CD (Vercel)
- [ ] Schema.org validado no Rich Results Test
- [ ] Core Web Vitals verde no PageSpeed Insights
