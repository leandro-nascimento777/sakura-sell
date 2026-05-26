export interface PlanFeature {
  label: string
  included: boolean
}

export interface Plan {
  id: string
  name: string
  description: string
  monthlyPrice: number | null
  highlighted: boolean
  badge?: string
  features: PlanFeature[]
  ctaLabel: string
  ctaHref: string
}
