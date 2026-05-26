import { type IPricingRepository } from '../ports/IPricingRepository'
import { type Plan } from '../entities/Plan'

export class GetPlansUseCase {
  constructor(private readonly pricing: IPricingRepository) {}

  async execute(): Promise<Plan[]> {
    return this.pricing.getAll()
  }
}
