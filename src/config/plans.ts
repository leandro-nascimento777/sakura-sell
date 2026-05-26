export interface PlanFeature {
  label: string
  included: boolean
}

export interface Plan {
  id: 'starter' | 'pro' | 'enterprise'
  name: string
  description: string
  monthlyPrice: number | null
  highlighted: boolean
  badge?: string
  features: PlanFeature[]
  ctaLabel: string
  ctaHref: string
}

export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Para agências solo',
    monthlyPrice: 97,
    highlighted: false,
    features: [
      { label: '1 usuário WhatsApp', included: true },
      { label: '200 buscas por mês', included: true },
      { label: 'Orçamentos ilimitados', included: true },
      { label: 'Acesso ao painel web', included: true },
      { label: 'Suporte por chat', included: true },
      { label: 'RAV em tempo real', included: false },
      { label: 'Regras de tarifa completas', included: false },
      { label: 'Alertas automáticos', included: false },
    ],
    ctaLabel: 'Começar com 7 dias grátis',
    ctaHref: 'https://app.sakurapass.com.br/signup?plan=starter',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para agências em crescimento',
    monthlyPrice: 197,
    highlighted: true,
    badge: 'Mais popular',
    features: [
      { label: '3 usuários WhatsApp', included: true },
      { label: 'Buscas ilimitadas', included: true },
      { label: 'RAV em tempo real', included: true },
      { label: 'Regras de tarifa completas', included: true },
      { label: 'Painel web completo', included: true },
      { label: 'Alertas automáticos de preço', included: true },
      { label: 'Suporte Sakura Avançado', included: true },
      { label: 'API própria', included: false },
    ],
    ctaLabel: 'Começar com 7 dias grátis',
    ctaHref: 'https://app.sakurapass.com.br/signup?plan=pro',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para consolidadoras e redes',
    monthlyPrice: null,
    highlighted: false,
    features: [
      { label: 'Usuários ilimitados', included: true },
      { label: 'API personalizada', included: true },
      { label: 'White label disponível', included: true },
      { label: 'Integração com sistema próprio', included: true },
      { label: 'SLA garantido', included: true },
      { label: 'Gerente de conta dedicado', included: true },
      { label: 'Treinamento incluído', included: true },
    ],
    ctaLabel: 'Falar com especialista',
    ctaHref: '/parceiros#enterprise',
  },
]
