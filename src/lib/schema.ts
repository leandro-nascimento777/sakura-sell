import { siteConfig } from '@/config/site'
import { plans } from '@/config/plans'

export function buildSoftwareAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'WhatsApp, Web',
    offers: plans
      .filter((p) => p.monthlyPrice !== null)
      .map((p) => ({
        '@type': 'Offer',
        name: p.name,
        price: p.monthlyPrice,
        priceCurrency: 'BRL',
        priceSpecification: {
          '@type': 'RecurringCharge',
          billingDuration: 'P1M',
        },
      })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '120',
      bestRating: '5',
    },
  }
}

export function buildFaqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.svg`,
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
  }
}
