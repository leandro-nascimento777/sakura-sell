import { type Plan } from '../entities/Plan'

export interface IPricingRepository {
  getAll(): Promise<Plan[]>
  getById(id: string): Promise<Plan | null>
}
