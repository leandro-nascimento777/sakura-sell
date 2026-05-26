import { type Metadata } from 'next'
import { Header } from '@/components/layout/Header/Header'
import { Footer } from '@/components/layout/Footer/Footer'
import { HeroSection } from '@/components/sections/HeroSection/HeroSection'
import { AirlinesSection } from '@/components/sections/AirlinesSection/AirlinesSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection/FeaturesSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection/HowItWorksSection'
import { PricingSection } from '@/components/sections/PricingSection/PricingSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection/TestimonialsSection'
import { CtaSection } from '@/components/sections/CtaSection/CtaSection'
import { StaticTestimonialAdapter } from '@/adapters/StaticTestimonialAdapter'
import { buildMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Cotação de passagens pelo WhatsApp com IA',
  description:
    'Faça orçamentos de passagens em 2 min direto pelo WhatsApp. IA que responde com velocidade, carinho e precisão para agências de viagem.',
  path: '',
})

export default async function HomePage() {
  const testimonialAdapter = new StaticTestimonialAdapter()
  const testimonials = await testimonialAdapter.getFeatured(3)

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AirlinesSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection testimonials={testimonials} />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
