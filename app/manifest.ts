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
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
