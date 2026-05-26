import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

/**
 * CSP defines exactly which origins can load scripts, styles, images, etc.
 * Blocks XSS: even if an attacker injects a <script>, the browser refuses to run it
 * because it doesn't match the allowed sources.
 */
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://www.googletagmanager.com https://connect.facebook.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self';
  connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net;
  frame-src 'none';
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim()

const securityHeaders = [
  // Prevents browsers from guessing the MIME type (MIME sniffing attacks)
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Blocks the page from being loaded in an <iframe> — prevents clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },

  // Forces HTTPS for 2 years, including subdomains
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },

  // Controls what browser features the page can use (camera, mic, geolocation, etc.)
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },

  // Limits referrer info sent to external sites
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // Enables XSS auditor in older browsers (defense-in-depth)
  { key: 'X-XSS-Protection', value: '1; mode=block' },

  // Removes "X-Powered-By: Next.js" header (reduces info leakage)
  // Already handled by poweredByHeader: false below

  // CSP — the most important one
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,

  // Static export for GitHub Pages
  ...(isGitHubPages && {
    output: 'export',
    basePath: '/sakura-sell',
    trailingSlash: true,
  }),

  // Apply security headers to every route
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  // Image optimization — restrict external domains to prevent SSRF via next/image
  images: {
    remotePatterns: [
      // Add only trusted domains here, e.g.:
      // { protocol: 'https', hostname: 'cdn.sakurapass.com.br' },
    ],
  },
}

export default nextConfig
