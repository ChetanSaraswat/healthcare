import { axiosInterceptorInstanceClient } from '@/config/axios';
import { Product } from '@/domain/entities/product.entity';
import { ListProductsFilterParams, ListProductsResponse } from './list-products.interface';

export const INITIAL_MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'ResMed AirSense 10 AutoSet CPAP Machine',
    slug: 'resmed-airsense-10-autoset-cpap',
    sku: 'CPAP-RES-10A',
    brand: 'ResMed',
    shortDescription: 'Premium auto-adjusting pressure sleep apnea therapy device with built-in HumidAir humidifier and cellular connectivity.',
    description: 'The ResMed AirSense 10 AutoSet is a premium auto-adjusting sleep therapy machine designed for comfort and ease of use. Featuring AutoRamp with sleep onset detection, quiet Easy-Breathe motor technology, and climate control humidification.',
    categoryId: 'cat-respiratory',
    categoryName: 'Respiratory Care',
    images: [
      '/images/oxygen_concentrator.png',
      '/images/elderly_couple.png'
    ],
    primaryImage: '/images/oxygen_concentrator.png',
    buyPrice: 64999,
    mrp: 78000,
    stock: 14,
    isAvailableForBuy: true,
    isAvailableForRent: true,
    rentalDailyRate: 350,
    rentalWeeklyRate: 2100,
    rentalMonthlyRate: 7500,
    rentalSecurityDeposit: 12000,
    rentalMinDays: 7,
    certifications: ['CDSCO Approved', 'US FDA Cleared', 'ISO 13485'],
    conditionTags: ['sleep-apnea', 'respiratory-care', 'post-icu'],
    sanitizationLevel: 'Hospital-Grade 10-Step Sterilization Certified',
    warrantyMonths: 24,
    warrantyInfo: '24 Months Comprehensive OEM Warranty from ResMed India',
    estimatedDeliveryHours: 4,
    featured: true,
    rating: 4.9,
    reviewsCount: 142,
    specifications: [
      { label: 'Pressure Range', value: '4 to 20 cm H2O' },
      { label: 'Sound Level', value: '26.6 dBA (Whisper Quiet)' },
      { label: 'Humidification', value: 'Built-in HumidAir with ClimateLineAir Tubing' },
      { label: 'Data Connectivity', value: 'Built-in Cellular 4G + SD Card' },
      { label: 'Dimensions', value: '116 mm x 255 mm x 150 mm' },
      { label: 'Weight', value: '1.24 kg' },
      { label: 'Power Supply', value: '90W Universal (100-240V, 50-60Hz)' },
    ],
    translations: {
      en: {
        locale: 'en',
        name: 'ResMed AirSense 10 AutoSet CPAP Machine',
        shortDescription: 'Premium auto-adjusting pressure sleep apnea therapy device with built-in HumidAir humidifier and cellular connectivity.',
        description: 'The ResMed AirSense 10 AutoSet is a premium auto-adjusting sleep therapy machine designed for comfort and ease of use. Featuring AutoRamp with sleep onset detection, quiet Easy-Breathe motor technology, and climate control humidification.',
        warrantyInfo: '24 Months Comprehensive OEM Warranty from ResMed India',
        specifications: [
          { label: 'Pressure Range', value: '4 to 20 cm H2O' },
          { label: 'Sound Level', value: '26.6 dBA (Whisper Quiet)' },
          { label: 'Humidification', value: 'Built-in HumidAir with ClimateLineAir Tubing' },
          { label: 'Data Connectivity', value: 'Built-in Cellular 4G + SD Card' },
          { label: 'Dimensions', value: '116 mm x 255 mm x 150 mm' },
          { label: 'Weight', value: '1.24 kg' },
          { label: 'Power Supply', value: '90W Universal (100-240V, 50-60Hz)' },
        ],
      },
      hi: {
        locale: 'hi',
        name: 'रेसमैड एयरसेंस 10 ऑटोसेट सीपैप मशीन',
        shortDescription: 'बिल्ट-इन ह्यूमिडएयर ह्यूमिडिफायर और सेलुलर कनेक्टिविटी के साथ प्रीमियम ऑटो-एडजस्टिंग स्लीप एप्निया थेरेपी डिवाइस।',
        description: 'रेसमैड एयरसेंस 10 ऑटोसेट एक प्रीमियम ऑटो-एडजस्टिंग स्लीप थेरेपी मशीन है जो रात के समय आरामदायक नींद और निर्बाध श्वास सहायता के लिए डिज़ाइन की गई है। इसमें ऑटो-रैम्प और आसान श्वास मोटर तकनीक शामिल है।',
        warrantyInfo: 'रेसमैड इंडिया की ओर से 24 महीने की व्यापक वारंटी',
        specifications: [
          { label: 'दबाव सीमा (Pressure Range)', value: '4 से 20 cm H2O' },
          { label: 'ध्वनि स्तर (Sound Level)', value: '26.6 dBA (अत्यंत शांत)' },
          { label: 'ह्यूमिडिफिकेशन (Humidification)', value: 'क्लाइमेटलाइनएयर ट्यूबिंग के साथ ह्यूमिडएयर' },
          { label: 'डेटा कनेक्टिविटी', value: 'बिल्ट-इन सेलुलर 4G + एसडी कार्ड' },
          { label: 'आकार (Dimensions)', value: '116 मिमी x 255 मिमी x 150 मिमी' },
          { label: 'वजन (Weight)', value: '1.24 किग्रा' },
          { label: 'बिजली आपूर्ति', value: '90W यूनिवर्सल (100-240V, 50-60Hz)' },
        ],
      },
    },
    hasHindiTranslation: true,
  },
  {
    id: 'prod-002',
    name: 'Modern 10L Medical Grade Oxygen Concentrator',
    slug: 'modern-10l-medical-grade-oxygen-concentrator',
    sku: 'OXC-10L-MED',
    brand: 'AarogyaMed Clinical',
    shortDescription: 'Continuous flow 93% ± 3% purity oxygen delivery for acute COPD, severe hypoxemia, and home patient rehabilitation.',
    description: 'High-output 10-liter medical oxygen concentrator delivering dual outlet capability, ultra-low decibel operation, integrated nebulizer port, and real-time digital LCD oxygen purity percentage readout.',
    categoryId: 'cat-respiratory',
    categoryName: 'Respiratory Care',
    images: [
      '/images/oxygen_concentrator.png',
      '/images/caregiver.png'
    ],
    primaryImage: '/images/oxygen_concentrator.png',
    buyPrice: 58500,
    mrp: 72000,
    stock: 8,
    isAvailableForBuy: true,
    isAvailableForRent: true,
    rentalDailyRate: 400,
    rentalWeeklyRate: 2400,
    rentalMonthlyRate: 8500,
    rentalSecurityDeposit: 15000,
    rentalMinDays: 7,
    certifications: ['CDSCO Registered', 'CE Certified Class IIa'],
    conditionTags: ['copd', 'respiratory-care', 'post-icu', 'elderly-care'],
    sanitizationLevel: 'UV-C Treated & HEPA 0.3μ Filter Replaced',
    warrantyMonths: 24,
    warrantyInfo: '2 Years Comprehensive Replacement Warranty',
    estimatedDeliveryHours: 3,
    featured: true,
    rating: 4.8,
    reviewsCount: 98,
    specifications: [
      { label: 'Flow Rate Range', value: '1 - 10 Liters/min (Continuous)' },
      { label: 'Oxygen Purity', value: '93% ± 3% at all flow rates' },
      { label: 'Outlet Pressure', value: '0.04 - 0.07 Mpa' },
      { label: 'Noise Level', value: '≤ 45 dB(A)' },
      { label: 'Nebulizer Port', value: 'Built-in High Efficiency Atomizer' },
      { label: 'Alarms', value: 'Power failure, High/Low pressure, Purity alert' },
      { label: 'Weight', value: '23.5 kg with omni-directional wheels' },
    ],
    translations: {
      en: {
        locale: 'en',
        name: 'Modern 10L Medical Grade Oxygen Concentrator',
        shortDescription: 'Continuous flow 93% ± 3% purity oxygen delivery for acute COPD, severe hypoxemia, and home patient rehabilitation.',
        description: 'High-output 10-liter medical oxygen concentrator delivering dual outlet capability, ultra-low decibel operation, integrated nebulizer port, and real-time digital LCD oxygen purity percentage readout.',
        specifications: [
          { label: 'Flow Rate Range', value: '1 - 10 Liters/min (Continuous)' },
          { label: 'Oxygen Purity', value: '93% ± 3% at all flow rates' },
          { label: 'Outlet Pressure', value: '0.04 - 0.07 Mpa' },
          { label: 'Noise Level', value: '≤ 45 dB(A)' },
          { label: 'Nebulizer Port', value: 'Built-in High Efficiency Atomizer' },
          { label: 'Alarms', value: 'Power failure, High/Low pressure, Purity alert' },
          { label: 'Weight', value: '23.5 kg with omni-directional wheels' },
        ],
      },
      hi: {
        locale: 'hi',
        name: 'आधुनिक 10L मेडिकल ग्रेड ऑक्सीजन कंसंट्रेटर',
        shortDescription: 'सीओपीडी, गंभीर हाइपोक्सिमिया और घर पर रोगी पुनर्वास के लिए 93% ± 3% शुद्धता वाली निरंतर ऑक्सीजन डिलीवरी।',
        description: 'उच्च-क्षमता वाला 10-लीटर मेडिकल ऑक्सीजन कंसंट्रेटर जो दोहरे आउटलेट, शांत संचालन और एकीकृत नेबुलाइजर पोर्ट के साथ आता है। यह एलसीडी स्क्रीन पर वास्तविक समय की शुद्धता दिखाता है।',
        warrantyInfo: '2 वर्ष की पूर्ण प्रतिस्थापन वारंटी',
        specifications: [
          { label: 'प्रवाह दर सीमा (Flow Rate)', value: '1 - 10 लीटर/मिनट (निरंतर प्रवाह)' },
          { label: 'ऑक्सीजन शुद्धता (Purity)', value: 'सभी प्रवाह दरों पर 93% ± 3%' },
          { label: 'आउटलेट दबाव', value: '0.04 - 0.07 Mpa' },
          { label: 'शोर का स्तर (Noise)', value: '≤ 45 dB(A)' },
          { label: 'नेबुलाइजर पोर्ट', value: 'बिल्ट-इन उच्च दक्षता एटमाइज़र' },
          { label: 'सुरक्षा अलार्म', value: 'बिजली विफलता, उच्च/निम्न दबाव, शुद्धता चेतावनी' },
          { label: 'वजन (Weight)', value: '23.5 किग्रा पहियों के साथ' },
        ],
      },
    },
    hasHindiTranslation: true,
  },
  {
    id: 'prod-003',
    name: '5-Function Motorized ICU Electric Hospital Bed',
    slug: '5-function-motorized-icu-electric-hospital-bed',
    sku: 'BED-ICU-5F',
    brand: 'AarogyaMed ICU Systems',
    shortDescription: 'Full electric ICU patient bed with Trendelenburg, reverse Trendelenburg, CPR quick release, and wireless caregiver remote.',
    description: 'Engineered for critical patient home recovery, this 5-function ICU bed features dual nurse control panels, collapsible aluminium safety rails, central locking brake casters, and high-density anti-microbial medical foam mattress.',
    categoryId: 'cat-icu-beds',
    categoryName: 'Hospital Beds & ICU',
    images: [
      '/images/hospital_bed.png',
      '/images/caregiver.png'
    ],
    primaryImage: '/images/hospital_bed.png',
    buyPrice: 95000,
    mrp: 125000,
    stock: 5,
    isAvailableForBuy: true,
    isAvailableForRent: true,
    rentalDailyRate: 650,
    rentalWeeklyRate: 3900,
    rentalMonthlyRate: 12000,
    rentalSecurityDeposit: 20000,
    rentalMinDays: 14,
    certifications: ['ISO 13485', 'IEC 60601-2-52 Compliant'],
    conditionTags: ['post-icu', 'stroke-rehab', 'elderly-care', 'mobility-support'],
    sanitizationLevel: 'Hospital Chlor-Clean Disinfection + New Waterproof Cover',
    warrantyMonths: 36,
    warrantyInfo: '36 Months On-site Motor & Actuator Warranty',
    estimatedDeliveryHours: 6,
    featured: true,
    rating: 5.0,
    reviewsCount: 64,
    specifications: [
      { label: 'Electric Functions', value: 'Backrest, Knee-rest, Height Adjustment, Trendelenburg, Rev-Trendelenburg' },
      { label: 'Max Patient Weight', value: '250 kg Safe Working Load' },
      { label: 'Actuators', value: 'Medical-Grade TiMOTION Linear Actuators' },
      { label: 'Height Range', value: '450 mm to 750 mm' },
      { label: 'Bed Deck', value: 'Cold-rolled perforated steel with epoxy coating' },
      { label: 'Included Mattress', value: '4-inch High Density Medical Foam with PU Cover' },
      { label: 'Casters', value: '125 mm Central Locking Heavy Duty Swivel Casters' },
    ],
    translations: {
      en: {
        locale: 'en',
        name: '5-Function Motorized ICU Electric Hospital Bed',
        shortDescription: 'Full electric ICU patient bed with Trendelenburg, reverse Trendelenburg, CPR quick release, and wireless caregiver remote.',
        description: 'Engineered for critical patient home recovery, this 5-function ICU bed features dual nurse control panels, collapsible aluminium safety rails, central locking brake casters, and high-density anti-microbial medical foam mattress.',
        specifications: [
          { label: 'Electric Functions', value: 'Backrest, Knee-rest, Height Adjustment, Trendelenburg, Rev-Trendelenburg' },
          { label: 'Max Patient Weight', value: '250 kg Safe Working Load' },
          { label: 'Actuators', value: 'Medical-Grade TiMOTION Linear Actuators' },
          { label: 'Height Range', value: '450 mm to 750 mm' },
          { label: 'Bed Deck', value: 'Cold-rolled perforated steel with epoxy coating' },
          { label: 'Included Mattress', value: '4-inch High Density Medical Foam with PU Cover' },
          { label: 'Casters', value: '125 mm Central Locking Heavy Duty Swivel Casters' },
        ],
      },
      hi: {
        locale: 'hi',
        name: '5-फंक्शन मोटराइज्ड आईसीयू इलेक्ट्रिक अस्पताल बेड',
        shortDescription: 'ट्रेंडेलनबर्ग, रिवर्स ट्रेंडेलनबर्ग, सीपीआर रिलीज और वायरलेस रिमोट कंट्रोल से सुसज्जित पूर्ण इलेक्ट्रिक आईसीयू बेड।',
        description: 'गंभीर मरीज की घर पर रिकवरी के लिए विशेष रूप से निर्मित, इस 5-फंक्शन आईसीयू बेड में दोहरे कंट्रोल पैनल, एल्युमिनियम सेफ्टी रेल और मेडिकल ग्रेड एंटी-माइक्रोबियल फोम गद्दे की सुविधा है।',
        warrantyInfo: '36 महीने की मोटर और एक्चुएटर ऑन-साइट वारंटी',
        specifications: [
          { label: 'इलेक्ट्रिक कार्य (Functions)', value: 'बैकरेस्ट, घुटने की स्थिति, ऊंचाई नियंत्रण, ट्रेंडेलनबर्ग' },
          { label: 'अधिकतम भार क्षमता', value: '250 किग्रा सुरक्षित कार्य भार' },
          { label: 'एक्चुएटर', value: 'मेडिकल ग्रेड TiMOTION रैखिक एक्चुएटर' },
          { label: 'ऊंचाई सीमा (Height)', value: '450 मिमी से 750 मिमी' },
          { label: 'शामिल गद्दे', value: 'पीयू कवर के साथ 4-इंच उच्च घनत्व मेडिकल फोम' },
          { label: 'पहिए (Casters)', value: '125 मिमी सेंट्रल लॉकिंग हैवी ड्यूटी स्विवेल' },
        ],
      },
    },
    hasHindiTranslation: true,
  },
  {
    id: 'prod-004',
    name: 'Philips Respironics DreamStation BiPAP Auto SV',
    slug: 'philips-respironics-dreamstation-bipap-auto-sv',
    sku: 'BIPAP-PHI-DS',
    brand: 'Philips Respironics',
    shortDescription: 'Advanced non-invasive servo-ventilation BiPAP for complex central sleep apnea and hypoventilation syndromes.',
    description: 'The DreamStation BiPAP delivers synchronized bi-level positive airway pressure with dynamic digital Auto-Trak algorithm, providing tailored inspiratory and expiratory support for comfortable spontaneous breathing.',
    categoryId: 'cat-respiratory',
    categoryName: 'Respiratory Care',
    images: [
      '/images/oxygen_concentrator.png',
      '/images/elderly_couple.png'
    ],
    primaryImage: '/images/oxygen_concentrator.png',
    buyPrice: 89000,
    mrp: 110000,
    stock: 6,
    isAvailableForBuy: true,
    isAvailableForRent: true,
    rentalDailyRate: 500,
    rentalWeeklyRate: 3000,
    rentalMonthlyRate: 9800,
    rentalSecurityDeposit: 18000,
    rentalMinDays: 7,
    certifications: ['CDSCO Approved', 'CE Class IIb'],
    conditionTags: ['sleep-apnea', 'copd', 'post-icu'],
    sanitizationLevel: 'Biomedical Certified 10-Step Autoclave Disinfection',
    warrantyMonths: 24,
    warrantyInfo: '24 Months Philips India Warranty',
    estimatedDeliveryHours: 4,
    featured: true,
    rating: 4.8,
    reviewsCount: 46,
    specifications: [
      { label: 'Pressure Range', value: 'IPAP: 4-25 cm H2O | EPAP: 4-20 cm H2O' },
      { label: 'Ventilation Modes', value: 'CPAP, S, S/T, PC, T' },
      { label: 'Humidifier', value: 'Heated Plate with Adaptive Moisture Sensor' },
      { label: 'Dimensions', value: '157 mm x 193 mm x 84 mm' },
      { label: 'Weight', value: '1.33 kg' },
    ],
    translations: {
      en: {
        locale: 'en',
        name: 'Philips Respironics DreamStation BiPAP Auto SV',
        shortDescription: 'Advanced non-invasive servo-ventilation BiPAP for complex central sleep apnea and hypoventilation syndromes.',
        description: 'The DreamStation BiPAP delivers synchronized bi-level positive airway pressure with dynamic digital Auto-Trak algorithm, providing tailored inspiratory and expiratory support for comfortable spontaneous breathing.',
        specifications: [
          { label: 'Pressure Range', value: 'IPAP: 4-25 cm H2O | EPAP: 4-20 cm H2O' },
          { label: 'Ventilation Modes', value: 'CPAP, S, S/T, PC, T' },
          { label: 'Humidifier', value: 'Heated Plate with Adaptive Moisture Sensor' },
          { label: 'Dimensions', value: '157 mm x 193 mm x 84 mm' },
          { label: 'Weight', value: '1.33 kg' },
        ],
      },
      hi: {
        locale: 'hi',
        name: 'फिलिप्स रेस्पिरोनिक्स ड्रीमस्टेशन बाईपैप ऑटो एसवी',
        shortDescription: 'जटिल सेंट्रल स्लीप एप्निया और हाइपोवेंटिलेशन सिंड्रोम के लिए उन्नत नॉन-इनवेसिव सर्वो-वेंटिलेशन बाईपैप।',
        description: 'ड्रीमस्टेशन बाईपैप ऑटो-ट्रैक एल्गोरिदम के साथ सिंक्रोनाइज़्ड बाई-लेवल सकारात्मक वायुमार्ग दबाव प्रदान करता है, जिससे सहज श्वास सहायता मिलती है।',
        warrantyInfo: '24 महीने की फिलिप्स इंडिया वारंटी',
        specifications: [
          { label: 'दबाव सीमा (Pressure Range)', value: 'IPAP: 4-25 cm H2O | EPAP: 4-20 cm H2O' },
          { label: 'वेंटिलेशन मोड (Modes)', value: 'CPAP, S, S/T, PC, T' },
          { label: 'ह्यूमिडिफायर', value: 'अनुकूली नमी सेंसर के साथ गर्म प्लेट' },
          { label: 'वजन (Weight)', value: '1.33 किग्रा' },
        ],
      },
    },
    hasHindiTranslation: true,
  },
  {
    id: 'prod-005',
    name: 'Ergonomic Lightweight Folding Transit Wheelchair',
    slug: 'ergonomic-lightweight-folding-transit-wheelchair',
    sku: 'WCH-LGT-01',
    brand: 'AarogyaMed Mobility',
    shortDescription: 'Aircraft-grade aluminium wheelchair with companion brakes, flip-up armrests, and swing-away footrests.',
    description: 'Designed for effortless elder mobility and post-surgery patient transit. Features puncture-proof PU solid tires, comfortable breathable double-mesh seating, and rapid folding frame weighing just 9.8 kg.',
    categoryId: 'cat-mobility',
    categoryName: 'Mobility & Ortho',
    images: [
      '/images/hospital_bed.png',
      '/images/elderly_couple.png'
    ],
    primaryImage: '/images/hospital_bed.png',
    buyPrice: 9499,
    mrp: 14500,
    stock: 25,
    isAvailableForBuy: true,
    isAvailableForRent: true,
    rentalDailyRate: 80,
    rentalWeeklyRate: 480,
    rentalMonthlyRate: 1500,
    rentalSecurityDeposit: 3000,
    rentalMinDays: 7,
    certifications: ['ISO 7176 Tested', 'CE Certified'],
    conditionTags: ['mobility-support', 'stroke-rehab', 'elderly-care'],
    sanitizationLevel: 'Deep Medical Solvent Cleaned',
    warrantyMonths: 12,
    warrantyInfo: '12 Months Frame Warranty',
    estimatedDeliveryHours: 3,
    featured: false,
    rating: 4.7,
    reviewsCount: 189,
    specifications: [
      { label: 'Total Weight', value: '9.8 kg' },
      { label: 'Weight Capacity', value: '120 kg' },
      { label: 'Seat Width', value: '46 cm (18 inches)' },
      { label: 'Frame Material', value: 'Aerospace Grade 7003 Aluminium' },
      { label: 'Tires', value: 'Solid Flat-Free Polyurethane Wheels' },
    ],
    translations: {
      en: {
        locale: 'en',
        name: 'Ergonomic Lightweight Folding Transit Wheelchair',
        shortDescription: 'Aircraft-grade aluminium wheelchair with companion brakes, flip-up armrests, and swing-away footrests.',
        description: 'Designed for effortless elder mobility and post-surgery patient transit. Features puncture-proof PU solid tires, comfortable breathable double-mesh seating, and rapid folding frame weighing just 9.8 kg.',
        specifications: [
          { label: 'Total Weight', value: '9.8 kg' },
          { label: 'Weight Capacity', value: '120 kg' },
          { label: 'Seat Width', value: '46 cm (18 inches)' },
          { label: 'Frame Material', value: 'Aerospace Grade 7003 Aluminium' },
          { label: 'Tires', value: 'Solid Flat-Free Polyurethane Wheels' },
        ],
      },
      hi: {
        locale: 'hi',
        name: 'एर्गोनोमिक लाइटवेट फोल्डिंग ट्रांजिट व्हीलचेयर',
        shortDescription: 'अटेंडेंट ब्रेक, फ्लिप-अप आर्मरेस्ट और स्विंग-अवे फुटरेस्ट के साथ एयरक्राफ्ट-ग्रेड एल्युमिनियम व्हीलचेयर।',
        description: 'बुजुर्गों और सर्जरी के बाद मरीजों की आवाजाही के लिए आदर्श। पंचर-मुक्त ठोस टायर, सांस लेने योग्य डबल-मेष सीटिंग और मात्र 9.8 किग्रा वजन का त्वरित फोल्डिंग फ्रेम।',
        warrantyInfo: '12 महीने की फ्रेम वारंटी',
        specifications: [
          { label: 'कुल वजन (Weight)', value: '9.8 किग्रा' },
          { label: 'वजन क्षमता (Capacity)', value: '120 किग्रा' },
          { label: 'सीट की चौड़ाई', value: '46 सेमी (18 इंच)' },
          { label: 'फ्रेम सामग्री', value: 'एयरोस्पेस ग्रेड 7003 एल्युमिनियम' },
          { label: 'टायर', value: 'सॉलिड पंचर-मुक्त पॉलीयूरेथेन पहिए' },
        ],
      },
    },
    hasHindiTranslation: true,
  },
  {
    id: 'prod-006',
    name: 'Anti-Decubitus Ripple Medical Air Mattress with Pump',
    slug: 'anti-decubitus-ripple-medical-air-mattress',
    sku: 'MAT-AIR-RPL',
    brand: 'AarogyaMed Care',
    shortDescription: 'Alternating pressure bubble pad overlay with ultra-quiet compressor pump for bed sore prevention and stage I-II ulcer relief.',
    description: 'Essential preventive clinical therapy for bedridden, post-stroke, and ICU recovery patients. Features 130 alternating heat-sealed bubble air cells that systematically relieve pressure points every 6 minutes.',
    categoryId: 'cat-icu-beds',
    categoryName: 'Hospital Beds & ICU',
    images: [
      '/images/hospital_bed.png',
      '/images/caregiver.png'
    ],
    primaryImage: '/images/hospital_bed.png',
    buyPrice: 3200,
    mrp: 4800,
    stock: 40,
    isAvailableForBuy: true,
    isAvailableForRent: true,
    rentalDailyRate: 40,
    rentalWeeklyRate: 240,
    rentalMonthlyRate: 750,
    rentalSecurityDeposit: 1500,
    rentalMinDays: 7,
    certifications: ['CE Certified', 'Medical Grade PVC'],
    conditionTags: ['post-icu', 'elderly-care', 'stroke-rehab'],
    sanitizationLevel: 'Brand New Sealed Tube & Sanitized Compressor',
    warrantyMonths: 12,
    warrantyInfo: '12 Months Compressor Pump Warranty',
    estimatedDeliveryHours: 2,
    featured: false,
    rating: 4.9,
    reviewsCount: 312,
    specifications: [
      { label: 'Cell Type', value: '130 Alternating Bubble Cells' },
      { label: 'Cycle Time', value: '6 Minutes Alternating Inflation' },
      { label: 'Pump Sound', value: '< 20 dB (Continuous Quiet)' },
      { label: 'Mattress Dimensions', value: '200 cm x 90 cm x 7 cm' },
      { label: 'Max Load', value: '135 kg' },
    ],
    translations: {
      en: {
        locale: 'en',
        name: 'Anti-Decubitus Ripple Medical Air Mattress with Pump',
        shortDescription: 'Alternating pressure bubble pad overlay with ultra-quiet compressor pump for bed sore prevention and stage I-II ulcer relief.',
        description: 'Essential preventive clinical therapy for bedridden, post-stroke, and ICU recovery patients. Features 130 alternating heat-sealed bubble air cells that systematically relieve pressure points every 6 minutes.',
        specifications: [
          { label: 'Cell Type', value: '130 Alternating Bubble Cells' },
          { label: 'Cycle Time', value: '6 Minutes Alternating Inflation' },
          { label: 'Pump Sound', value: '< 20 dB (Continuous Quiet)' },
          { label: 'Mattress Dimensions', value: '200 cm x 90 cm x 7 cm' },
          { label: 'Max Load', value: '135 kg' },
        ],
      },
      hi: {
        locale: 'hi',
        name: 'एंटी-डेक्यूबिटस रिपल मेडिकल एयर मैट्रेस और पंप',
        shortDescription: 'बेड सोर (घाव) की रोकथाम और राहत के लिए शांत कंप्रेसर पंप के साथ बारी-बारी से दबाव बदलने वाला बबल पैड गद्दा।',
        description: 'बिस्तर पर पड़े मरीजों और स्ट्रोक रिकवरी के लिए आवश्यक नैदानिक थेरेपी। इसमें 130 बारी-बारी से फूलने वाले एयर सेल हैं जो हर 6 मिनट में शरीर के दबाव बिंदुओं को बदलते हैं।',
        warrantyInfo: '12 महीने की कंप्रेसर पंप वारंटी',
        specifications: [
          { label: 'सेल प्रकार', value: '130 बारी-बारी से फूलने वाले बबल सेल' },
          { label: 'साइकिल समय (Cycle)', value: 'प्रत्येक 6 मिनट में रोटेशन' },
          { label: 'पंप ध्वनि', value: '< 20 dB (अत्यंत शांत)' },
          { label: 'गद्दे का आकार', value: '200 सेमी x 90 सेमी x 7 सेमी' },
          { label: 'अधिकतम भार', value: '135 किग्रा' },
        ],
      },
    },
    hasHindiTranslation: true,
  }
];

export const listProductsService = async (
  params?: ListProductsFilterParams & { locale?: 'en' | 'hi' }
): Promise<ListProductsResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get('/products', {
      params,
    });
    const rawItems = response.data?.data?.items || response.data?.data?.products;
    if (Array.isArray(rawItems) && rawItems.length > 0) {
      const mappedProducts: Product[] = rawItems.map((p: any) => ({
        id: p.uuid || String(p.id),
        name: p.name,
        slug: p.slug,
        sku: p.sku || `SKU-${p.id}`,
        shortDescription: p.short_description || p.shortDescription || p.description?.slice(0, 150),
        description: p.description || '',
        categoryId: String(p.category_id || p.categoryId || 'cat-respiratory'),
        categoryName: p.category?.name || p.categoryName || 'Medical Equipment',
        brand: p.brand || 'AarogyaMed',
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['/images/oxygen_concentrator.png'],
        primaryImage: p.primary_image || p.primaryImage || '/images/oxygen_concentrator.png',
        buyPrice: parseFloat(p.buy_price || p.buyPrice || 0),
        mrp: parseFloat(p.mrp || (parseFloat(p.buy_price || 0) * 1.2)),
        stock: p.stock_quantity ?? p.stock ?? 10,
        isAvailableForBuy: Boolean(p.buy_available ?? p.isAvailableForBuy),
        isAvailableForRent: Boolean(p.rent_available ?? p.isAvailableForRent),
        rentalDailyRate: parseFloat(p.rent_daily_price || p.rentalDailyRate || 350),
        rentalWeeklyRate: parseFloat(p.rent_weekly_price || p.rentalWeeklyRate || 2100),
        rentalMonthlyRate: parseFloat(p.rent_monthly_price || p.rentalMonthlyRate || 7500),
        rentalSecurityDeposit: parseFloat(p.rent_security_deposit || p.rentalSecurityDeposit || 12000),
        rentalMinDays: p.rent_min_days || p.rentalMinDays || 7,
        specifications: p.specifications || [],
        translations: p.translations,
      }));

      return {
        success: true,
        data: {
          products: mappedProducts,
          total: response.data.data.pagination?.total || mappedProducts.length,
          page: response.data.data.pagination?.page || 1,
          totalPages: response.data.data.pagination?.totalPages || 1,
        },
      };
    }
  } catch (err) {
    // Graceful fallback to initial catalog
  }

  const locale = params?.locale || 'en';
  let filtered = [...INITIAL_MOCK_PRODUCTS];

  if (params?.category) {
    filtered = filtered.filter(
      (p) => p.categoryId === params.category || p.categoryName?.toLowerCase().includes(params.category!.toLowerCase())
    );
  }

  if (params?.condition) {
    filtered = filtered.filter((p) =>
      p.conditionTags?.includes(params.condition!)
    );
  }

  if (params?.mode === 'buy') {
    filtered = filtered.filter((p) => p.isAvailableForBuy);
  } else if (params?.mode === 'rent') {
    filtered = filtered.filter((p) => p.isAvailableForRent);
  }

  if (params?.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        (p.translations?.hi?.name && p.translations.hi.name.includes(query))
    );
  }

  if (params?.sort === 'price_low') {
    filtered.sort((a, b) => a.buyPrice - b.buyPrice);
  } else if (params?.sort === 'price_high') {
    filtered.sort((a, b) => b.buyPrice - a.buyPrice);
  }

  // Map to localized fields
  const localized = filtered.map((p) => {
    const loc = p.translations?.[locale] || p.translations?.en;
    return {
      ...p,
      name: loc?.name || p.name,
      shortDescription: loc?.shortDescription || p.shortDescription,
      description: loc?.description || p.description,
      specifications: loc?.specifications || p.specifications,
    };
  });

  return {
    success: true,
    data: {
      products: localized,
      total: localized.length,
      page: params?.page || 1,
      totalPages: 1,
    },
  };
};
