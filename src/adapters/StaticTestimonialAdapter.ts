import { type ITestimonialRepository } from '@/domain/ports/ITestimonialRepository'
import { type Testimonial } from '@/domain/entities/Testimonial'

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ana Paula Rocha',
    role: 'Proprietária',
    agency: 'Rocha Viagens',
    avatar: '/images/testimonials/ana.jpg',
    content:
      'A Sakura Pass transformou meu atendimento. Antes levava 20 minutos para cotar um voo, agora em 2 minutos meu cliente já tem a resposta no WhatsApp.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    role: 'Gerente Comercial',
    agency: 'Viajar Premium',
    avatar: '/images/testimonials/carlos.jpg',
    content:
      'A IA realmente entende o que o cliente quer. As regras de tarifa e o RAV em tempo real nos salvam de erros que antes aconteciam toda semana.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Fernanda Lima',
    role: 'Agente de Viagens',
    agency: 'Horizonte Tours',
    avatar: '/images/testimonials/fernanda.jpg',
    content:
      'Uso o plano Starter há 3 meses e já paguei o investimento várias vezes. Os clientes adoram receber a cotação direto no WhatsApp deles.',
    rating: 5,
  },
]

export class StaticTestimonialAdapter implements ITestimonialRepository {
  async getAll(): Promise<Testimonial[]> {
    return testimonials
  }

  async getFeatured(limit = 3): Promise<Testimonial[]> {
    return testimonials.slice(0, limit)
  }
}
