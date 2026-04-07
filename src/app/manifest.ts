import type { MetadataRoute } from 'next';
import { eventConfig } from '@/config/event';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${eventConfig.appName} - ${eventConfig.eventName}`,
    short_name: eventConfig.appName,
    description: eventConfig.heroDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#f5e6c8',
    theme_color: '#333333',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
