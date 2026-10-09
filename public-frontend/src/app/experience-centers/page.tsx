import type { Metadata } from 'next';
import { ExperienceCentersClient } from './ExperienceCentersClient';

export const metadata: Metadata = {
  title: 'Experience Centers & Facilities | Omkar Healthcare',
  description:
    'Visit Omkar Healthcare Experience Centers in Gurugram and Mathura to inspect and test certified medical equipment with caregiver guidance.',
  alternates: {
    canonical: 'https://omkarhealthcare.com/experience-centers',
  },
  openGraph: {
    title: 'Experience Centers | Omkar Healthcare',
    description:
      'Visit Omkar Healthcare Experience Centers in Gurugram and Mathura for equipment demonstration, trial, and rental consultation.',
    url: 'https://omkarhealthcare.com/experience-centers',
    siteName: 'Omkar Healthcare',
    type: 'website',
  },
};

// LocalBusiness structured data (JSON-LD)
// Restricted strictly to the two verified public Experience Centers (Warehouse excluded)
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://omkarhealthcare.com/experience-centers#gurugram',
      name: 'Omkar Healthcare Experience Center - Gurugram',
      description:
        'Official experience center for hands-on trial and demonstration of hospital-grade oxygen concentrators, BiPAP/CPAP, and ICU home care equipment.',
      url: 'https://omkarhealthcare.com/experience-centers',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '247/11, 4th Floor, Street No. 11, Hans Enclave, Sector 33',
        addressLocality: 'Gurugram',
        addressRegion: 'Haryana',
        postalCode: '122003',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 28.4442995,
        longitude: 77.0261175,
      },
      hasMap: 'https://maps.app.goo.gl/SJ8uHYjoaRHQ4b1EA',
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://omkarhealthcare.com/experience-centers#mathura',
      name: 'Omkar Healthcare Experience Center - Mathura',
      description:
        'Official experience center for hands-on trial and demonstration of hospital-grade oxygen concentrators, BiPAP/CPAP, and ICU home care equipment.',
      url: 'https://omkarhealthcare.com/experience-centers',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '349, Amar Colony, Bakalpur Road',
        addressLocality: 'Mathura',
        addressRegion: 'Uttar Pradesh',
        postalCode: '281004',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 27.4960532,
        longitude: 77.6446636,
      },
      hasMap: 'https://maps.app.goo.gl/U9BYnvxh1EXrHE1Z6',
    },
  ],
};

export default function ExperienceCentersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <ExperienceCentersClient />
    </>
  );
}
