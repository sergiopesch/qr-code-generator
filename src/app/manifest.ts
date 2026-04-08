import type { MetadataRoute } from 'next';
import { eventConfig } from '@/config/event';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${eventConfig.appName} - ${eventConfig.eventName}`,
    short_name: eventConfig.appName,
    description: eventConfig.heroDescription,
    start_url: '/',
    display: 'standalone',
    display_override: ['standalone', 'browser'],
    background_color: '#fbfaf6',
    theme_color: '#f7f3ea',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
