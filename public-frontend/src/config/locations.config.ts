export type LocationType = 'experience_center' | 'warehouse';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface LocationConfig {
  id: string;
  type: LocationType;
  name: {
    en: string;
    hi: string;
  };
  tagline?: {
    en: string;
    hi: string;
  };
  address: {
    en: string;
    hi: string;
  };
  city: string;
  state: string;
  pincode: string;
  mapsUrl: string;
  coordinates?: LocationCoordinates;
  phone?: string;
  hours?: {
    en: string;
    hi: string;
  };
  visitPolicy?: {
    en: string;
    hi: string;
  };
  description?: {
    en: string;
    hi: string;
  };
  embedUrl?: string;
}

export const OMKAR_LOCATIONS: LocationConfig[] = [
  {
    id: 'gurugram-experience-center',
    type: 'experience_center',
    name: {
      en: 'Experience Center, Gurugram',
      hi: 'एक्सपीरियंस सेंटर, गुरुग्राम',
    },
    tagline: {
      en: 'Equipment demonstration, consultation & trial',
      hi: 'उपकरण लाइव डेमो, परामर्श एवं परीक्षण',
    },
    address: {
      en: '247/11, 4th Floor, Street No. 11, Hans Enclave, Sector 33, Gurugram, Haryana 122003',
      hi: '247/11, 4th Floor, Street No. 11, Hans Enclave, Sector 33, Gurugram, Haryana 122003',
    },
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122003',
    mapsUrl: 'https://maps.app.goo.gl/SJ8uHYjoaRHQ4b1EA',
    coordinates: {
      lat: 28.4442995,
      lng: 77.0261175,
    },
    embedUrl: 'https://maps.google.com/maps?q=28.4442995,77.0261175&hl=en&z=15&output=embed',
    description: {
      en: 'Visit our Gurugram Experience Center to see and test hospital-grade oxygen concentrators, CPAP, and BiPAP devices. Our team provides personal guidance on device operation, mask sizing, and rental plans.',
      hi: 'अस्पताल-स्तरीय ऑक्सीजन कंसंट्रेटर, सीपैप और बाईपैप उपकरणों को देखने और परखने के लिए हमारे गुरुग्राम एक्सपीरियंस सेंटर पर पधारें। हमारी टीम डिवाइस संचालन, मास्क साइजिंग और रेंटल विकल्पों पर मार्गदर्शन प्रदान करती है।',
    },
  },
  {
    id: 'mathura-experience-center',
    type: 'experience_center',
    name: {
      en: 'Experience Center, Mathura',
      hi: 'एक्सपीरियंस सेंटर, मथुरा',
    },
    tagline: {
      en: 'Equipment demonstration, consultation & trial',
      hi: 'उपकरण लाइव डेमो, परामर्श एवं परीक्षण',
    },
    address: {
      en: '349, Amar Colony, Bakalpur Road, Mathura, Uttar Pradesh 281004',
      hi: '349, Amar Colony, Bakalpur Road, Mathura, Uttar Pradesh 281004',
    },
    city: 'Mathura',
    state: 'Uttar Pradesh',
    pincode: '281004',
    mapsUrl: 'https://maps.app.goo.gl/U9BYnvxh1EXrHE1Z6',
    coordinates: {
      lat: 27.4960532,
      lng: 77.6446636,
    },
    embedUrl: 'https://maps.google.com/maps?q=27.4960532,77.6446636&hl=en&z=15&output=embed',
    description: {
      en: 'Experience certified respiratory care devices firsthand in Mathura. Meet our clinical care associates to explore direct purchase and flexible monthly rental plans tailored for your home care needs.',
      hi: 'मथुरा में प्रमाणित रेस्पिरेटरी केयर उपकरणों का प्रत्यक्ष अनुभव करें। अपने होम केयर जरूरतों के अनुसार सीधी खरीद एवं सुविधाजनक मासिक रेंटल योजनाओं को समझने के लिए हमारे क्लिनिकल सलाहकारों से संपर्क करें।',
    },
  },
  {
    id: 'central-warehouse',
    type: 'warehouse',
    name: {
      en: 'Warehouse (dispatch & storage, visits by appointment only)',
      hi: 'वेयरहाउस (डिस्पैच एवं स्टोरेज, केवल अपॉइंटमेंट द्वारा)',
    },
    tagline: {
      en: 'Central Dispatch & Storage Facility',
      hi: 'केंद्रीय डिस्पैच एवं स्टोरेज सुविधा',
    },
    address: {
      en: 'Karahari, Mat, Mathura, Uttar Pradesh 281205',
      hi: 'Karahari, Mat, Mathura, Uttar Pradesh 281205',
    },
    city: 'Mathura',
    state: 'Uttar Pradesh',
    pincode: '281205',
    mapsUrl: 'https://maps.app.goo.gl/g9Jaj7baqNtrVNa87',
    coordinates: {
      lat: 27.7313171,
      lng: 77.7855359,
    },
    embedUrl: 'https://maps.google.com/maps?q=27.7313171,77.7855359&hl=en&z=14&output=embed',
    visitPolicy: {
      en: 'Warehouse (dispatch & storage, visits by appointment only)',
      hi: 'वेयरहाउस (डिस्पैच एवं स्टोरेज, आगमन केवल पूर्व अपॉइंटमेंट द्वारा)',
    },
    description: {
      en: 'Our primary medical equipment storage and biomedical dispatch facility. In-person visits are strictly by prior appointment only.',
      hi: 'हमारा मुख्य चिकित्सा उपकरण स्टोरेज एवं बायोमेडिकल डिस्पैच परिसर। व्यक्तिगत आगमन केवल पूर्व अपॉइंटमेंट द्वारा ही संभव है।',
    },
  },
];
