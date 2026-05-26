import { type IPricingRepository } from '@/domain/ports/IPricingRepository'
import { type Plan } from '@/domain/entities/Plan'
import { plans } from '@/config/plans'

export class StaticPricingAdapter implements IPricingRepository {
  async getAll(): Promise<Plan[]> {
    return plans
  }

  async getById(id: string): Promise<Plan | null> {
    return plans.find((p) => p.id === id) ?? null
  }
}
