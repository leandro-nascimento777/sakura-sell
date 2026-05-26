import { type MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/funcionalidades', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/precos', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/como-funciona', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/parceiros', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
  ]

  return staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
