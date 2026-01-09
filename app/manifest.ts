import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LovelyGirls Prague - Premium Escort Services',
    short_name: 'LovelyGirls',
    description: 'Premium escort agency in Prague. Beautiful girls available for companionship.',
    start_url: '/cs',
    display: 'standalone',
    background_color: '#1a1216',
    theme_color: '#ec4899',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
