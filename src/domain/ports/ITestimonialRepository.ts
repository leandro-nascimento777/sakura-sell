import { type Testimonial } from '../entities/Testimonial'

export interface ITestimonialRepository {
  getAll(): Promise<Testimonial[]>
  getFeatured(limit?: number): Promise<Testimonial[]>
}
