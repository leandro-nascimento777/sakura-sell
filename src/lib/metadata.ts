import { type Metadata } from 'next'
import { siteConfig } from '@/config/site'

interface MetadataInput {
  title: string
  description: string
  path?: string
  image?: string
  noIndex?: boolean
}

export function buildMetadata({
  title,
  description,
  path = '',
  image,
  noIndex = false,
}: MetadataInput): Metadata {
  const url = `${siteConfig.url}${path}`
  const ogImage = image ?? siteConfig.ogImage

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}
