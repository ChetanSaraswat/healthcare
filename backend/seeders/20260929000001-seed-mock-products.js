'use strict';

const { v4: uuidv4 } = require('uuid');

const MOCK_PRODUCTS = [
  {
    name: 'ResMed AirSense 10 AutoSet CPAP Machine',
    slug: 'resmed-airsense-10-autoset-cpap',
    sku: 'CPAP-RES-10A',
    brand: 'ResMed',
    categorySlug: 'respiratory-sleep',
    subcategorySlug: 'cpap-bipap-machines',
    description: 'The ResMed AirSense 10 AutoSet is a premium auto-adjusting sleep therapy machine designed for comfort and ease of use. Featuring AutoRamp with sleep onset detection, quiet Easy-Breathe motor technology, and climate control humidification.',
    images: ['/images/oxygen_concentrator.png', '/images/elderly_couple.png'],
    specifications: [
      { label: 'Pressure Range', value: '4 to 20 cm H2O' },
      { label: 'Sound Level', value: '26.6 dBA (Whisper Quiet)' },
      { label: 'Humidification', value: 'Built-in HumidAir with ClimateLineAir Tubing' },
      { label: 'Data Connectivity', value: 'Built-in Cellular 4G + SD Card' },
      { label: 'Dimensions', value: '116 mm x 255 mm x 150 mm' },
      { label: 'Weight', value: '1.24 kg' },
      { label: 'Power Supply', value: '90W Universal (100-240V, 50-60Hz)' },
    ],
    buy_price: 64999.00,
    buy_mrp: 78000.00,
    buy_available: true,
    rent_price_daily: 350.00,
    rent_price_weekly: 2100.00,
    rent_price_monthly: 7500.00,
    rent_deposit: 12000.00,
    rent_min_period_days: 7,
    rent_available: true,
    stock_quantity: 14,
    warranty_info: '24 Months Comprehensive OEM Warranty from ResMed India',
    status: 'active',
    conditionTags: ['sleep-apnea', 'copd'],
    translations: {
      en: {
        name: 'ResMed AirSense 10 AutoSet CPAP Machine',
        description: 'The ResMed AirSense 10 AutoSet is a premium auto-adjusting sleep therapy machine designed for comfort and ease of use. Featuring AutoRamp with sleep onset detection, quiet Easy-Breathe motor technology, and climate control humidification.',
        warranty_info: '24 Months Comprehensive OEM Warranty from ResMed India',
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
        name: 'रेसमैड एयरसेंस 10 ऑटोसेट सीपैप मशीन',
        description: 'रेसमैड एयरसेंस 10 ऑटोसेट एक प्रीमियम ऑटो-एडजस्टिंग स्लीप थेरेपी मशीन है जो रात के समय आरामदायक नींद और निर्बाध श्वास सहायता के लिए डिज़ाइन की गई है। इसमें ऑटो-रैम्प और आसान श्वास मोटर तकनीक शामिल है।',
        warranty_info: 'रेसमैड इंडिया की ओर से 24 महीने की व्यापक वारंटी',
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
  },
  {
    name: 'Modern 10L Medical Grade Oxygen Concentrator',
    slug: 'modern-10l-medical-grade-oxygen-concentrator',
    sku: 'OXC-10L-MED',
    brand: 'AarogyaMed Clinical',
    categorySlug: 'respiratory-sleep',
    subcategorySlug: 'oxygen-concentrators',
    description: 'High-output 10-liter medical oxygen concentrator delivering dual outlet capability, ultra-low decibel operation, integrated nebulizer port, and real-time digital LCD oxygen purity percentage readout.',
    images: ['/images/oxygen_concentrator.png', '/images/caregiver.png'],
    specifications: [
      { label: 'Flow Rate Range', value: '1 - 10 Liters/min (Continuous)' },
      { label: 'Oxygen Purity', value: '93% ± 3% at all flow rates' },
      { label: 'Outlet Pressure', value: '0.04 - 0.07 Mpa' },
      { label: 'Noise Level', value: '≤ 45 dB(A)' },
      { label: 'Nebulizer Port', value: 'Built-in High Efficiency Atomizer' },
      { label: 'Alarms', value: 'Power failure, High/Low pressure, Purity alert' },
      { label: 'Weight', value: '23.5 kg with omni-directional wheels' },
    ],
    buy_price: 58500.00,
    buy_mrp: 72000.00,
    buy_available: true,
    rent_price_daily: 400.00,
    rent_price_weekly: 2400.00,
    rent_price_monthly: 8500.00,
    rent_deposit: 15000.00,
    rent_min_period_days: 7,
    rent_available: true,
    stock_quantity: 8,
    warranty_info: '2 Years Comprehensive Replacement Warranty',
    status: 'active',
    conditionTags: ['copd', 'elderly-care'],
    translations: {
      en: {
        name: 'Modern 10L Medical Grade Oxygen Concentrator',
        description: 'High-output 10-liter medical oxygen concentrator delivering dual outlet capability, ultra-low decibel operation, integrated nebulizer port, and real-time digital LCD oxygen purity percentage readout.',
        warranty_info: '2 Years Comprehensive Replacement Warranty',
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
        name: 'आधुनिक 10L मेडिकल ग्रेड ऑक्सीजन कंसंट्रेटर',
        description: 'उच्च-क्षमता वाला 10-लीटर मेडिकल ऑक्सीजन कंसंट्रेटर जो दोहरे आउटलेट, शांत संचालन और एकीकृत नेबुलाइजर पोर्ट के साथ आता है। यह एलसीडी स्क्रीन पर वास्तविक समय की शुद्धता दिखाता है।',
        warranty_info: '2 वर्ष की पूर्ण प्रतिस्थापन वारंटी',
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
  },
  {
    name: '5-Function Motorized ICU Electric Hospital Bed',
    slug: '5-function-motorized-icu-electric-hospital-bed',
    sku: 'BED-ICU-5F',
    brand: 'AarogyaMed ICU Systems',
    categorySlug: 'home-care',
    subcategorySlug: 'icu-hospital-beds',
    description: 'Engineered for critical patient home recovery, this 5-function ICU bed features dual nurse control panels, collapsible aluminium safety rails, central locking brake casters, and high-density anti-microbial medical foam mattress.',
    images: ['/images/hospital_bed.png', '/images/caregiver.png'],
    specifications: [
      { label: 'Electric Functions', value: 'Backrest, Knee-rest, Height Adjustment, Trendelenburg, Rev-Trendelenburg' },
      { label: 'Max Patient Weight', value: '250 kg Safe Working Load' },
      { label: 'Actuators', value: 'Medical-Grade TiMOTION Linear Actuators' },
      { label: 'Height Range', value: '450 mm to 750 mm' },
      { label: 'Bed Deck', value: 'Cold-rolled perforated steel with epoxy coating' },
      { label: 'Included Mattress', value: '4-inch High Density Medical Foam with PU Cover' },
      { label: 'Casters', value: '125 mm Central Locking Heavy Duty Swivel Casters' },
    ],
    buy_price: 95000.00,
    buy_mrp: 125000.00,
    buy_available: true,
    rent_price_daily: 650.00,
    rent_price_weekly: 3900.00,
    rent_price_monthly: 12000.00,
    rent_deposit: 20000.00,
    rent_min_period_days: 14,
    rent_available: true,
    stock_quantity: 5,
    warranty_info: '36 Months On-site Motor & Actuator Warranty',
    status: 'active',
    conditionTags: ['post-surgery-mobility', 'elderly-care'],
    translations: {
      en: {
        name: '5-Function Motorized ICU Electric Hospital Bed',
        description: 'Engineered for critical patient home recovery, this 5-function ICU bed features dual nurse control panels, collapsible aluminium safety rails, central locking brake casters, and high-density anti-microbial medical foam mattress.',
        warranty_info: '36 Months On-site Motor & Actuator Warranty',
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
        name: '5-फंक्शन मोटराइज्ड आईसीयू इलेक्ट्रिक अस्पताल बेड',
        description: 'गंभीर मरीज की घर पर रिकवरी के लिए विशेष रूप से निर्मित, इस 5-फंक्शन आईसीयू बेड में दोहरे कंट्रोल पैनल, एल्युमिनियम सेफ्टी रेल और मेडिकल ग्रेड एंटी-माइक्रोबियल फोम गद्दे की सुविधा है।',
        warranty_info: '36 महीने की मोटर और एक्चुएटर ऑन-साइट वारंटी',
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
  },
  {
    name: 'Philips Respironics DreamStation BiPAP Auto SV',
    slug: 'philips-respironics-dreamstation-bipap-auto-sv',
    sku: 'BIPAP-PHI-DS',
    brand: 'Philips Respironics',
    categorySlug: 'respiratory-sleep',
    subcategorySlug: 'cpap-bipap-machines',
    description: 'The DreamStation BiPAP delivers synchronized bi-level positive airway pressure with dynamic digital Auto-Trak algorithm, providing tailored inspiratory and expiratory support for comfortable spontaneous breathing.',
    images: ['/images/oxygen_concentrator.png', '/images/elderly_couple.png'],
    specifications: [
      { label: 'Pressure Range', value: 'IPAP: 4-25 cm H2O | EPAP: 4-20 cm H2O' },
      { label: 'Ventilation Modes', value: 'CPAP, S, S/T, PC, T' },
      { label: 'Humidifier', value: 'Heated Plate with Adaptive Moisture Sensor' },
      { label: 'Dimensions', value: '157 mm x 193 mm x 84 mm' },
      { label: 'Weight', value: '1.33 kg' },
    ],
    buy_price: 89000.00,
    buy_mrp: 110000.00,
    buy_available: true,
    rent_price_daily: 500.00,
    rent_price_weekly: 3000.00,
    rent_price_monthly: 9800.00,
    rent_deposit: 18000.00,
    rent_min_period_days: 7,
    rent_available: true,
    stock_quantity: 6,
    warranty_info: '24 Months Philips India Warranty',
    status: 'active',
    conditionTags: ['sleep-apnea', 'copd'],
    translations: {
      en: {
        name: 'Philips Respironics DreamStation BiPAP Auto SV',
        description: 'The DreamStation BiPAP delivers synchronized bi-level positive airway pressure with dynamic digital Auto-Trak algorithm, providing tailored inspiratory and expiratory support for comfortable spontaneous breathing.',
        warranty_info: '24 Months Philips India Warranty',
        specifications: [
          { label: 'Pressure Range', value: 'IPAP: 4-25 cm H2O | EPAP: 4-20 cm H2O' },
          { label: 'Ventilation Modes', value: 'CPAP, S, S/T, PC, T' },
          { label: 'Humidifier', value: 'Heated Plate with Adaptive Moisture Sensor' },
          { label: 'Dimensions', value: '157 mm x 193 mm x 84 mm' },
          { label: 'Weight', value: '1.33 kg' },
        ],
      },
      hi: {
        name: 'फिलिप्स रेस्पिरोनिक्स ड्रीमस्टेशन बाईपैप ऑटो एसवी',
        description: 'ड्रीमस्टेशन बाईपैप ऑटो-ट्रैक एल्गोरिदम के साथ सिंक्रोनाइज़्ड बाई-लेवल सकारात्मक वायुमार्ग दबाव प्रदान करता है, जिससे सहज श्वास सहायता मिलती है।',
        warranty_info: '24 महीने की फिलिप्स इंडिया वारंटी',
        specifications: [
          { label: 'दबाव सीमा (Pressure Range)', value: 'IPAP: 4-25 cm H2O | EPAP: 4-20 cm H2O' },
          { label: 'वेंटिलेशन मोड (Modes)', value: 'CPAP, S, S/T, PC, T' },
          { label: 'ह्यूमिडिफायर', value: 'अनुकूली नमी सेंसर के साथ गर्म प्लेट' },
          { label: 'वजन (Weight)', value: '1.33 किग्रा' },
        ],
      },
    },
  },
  {
    name: 'Ergonomic Lightweight Folding Transit Wheelchair',
    slug: 'ergonomic-lightweight-folding-transit-wheelchair',
    sku: 'WCH-LGT-01',
    brand: 'AarogyaMed Mobility',
    categorySlug: 'mobility-aids',
    subcategorySlug: 'electric-wheelchairs',
    description: 'Designed for effortless elder mobility and post-surgery patient transit. Features puncture-proof PU solid tires, comfortable breathable double-mesh seating, and rapid folding frame weighing just 9.8 kg.',
    images: ['/images/hospital_bed.png', '/images/elderly_couple.png'],
    specifications: [
      { label: 'Total Weight', value: '9.8 kg' },
      { label: 'Weight Capacity', value: '120 kg' },
      { label: 'Seat Width', value: '46 cm (18 inches)' },
      { label: 'Frame Material', value: 'Aerospace Grade 7003 Aluminium' },
      { label: 'Tires', value: 'Solid Flat-Free Polyurethane Wheels' },
    ],
    buy_price: 9499.00,
    buy_mrp: 14500.00,
    buy_available: true,
    rent_price_daily: 80.00,
    rent_price_weekly: 480.00,
    rent_price_monthly: 1500.00,
    rent_deposit: 3000.00,
    rent_min_period_days: 7,
    rent_available: true,
    stock_quantity: 25,
    warranty_info: '12 Months Frame Warranty',
    status: 'active',
    conditionTags: ['post-surgery-mobility', 'elderly-care'],
    translations: {
      en: {
        name: 'Ergonomic Lightweight Folding Transit Wheelchair',
        description: 'Designed for effortless elder mobility and post-surgery patient transit. Features puncture-proof PU solid tires, comfortable breathable double-mesh seating, and rapid folding frame weighing just 9.8 kg.',
        warranty_info: '12 Months Frame Warranty',
        specifications: [
          { label: 'Total Weight', value: '9.8 kg' },
          { label: 'Weight Capacity', value: '120 kg' },
          { label: 'Seat Width', value: '46 cm (18 inches)' },
          { label: 'Frame Material', value: 'Aerospace Grade 7003 Aluminium' },
          { label: 'Tires', value: 'Solid Flat-Free Polyurethane Wheels' },
        ],
      },
      hi: {
        name: 'एर्गोनोमिक लाइटवेट फोल्डिंग ट्रांजिट व्हीलचेयर',
        description: 'बुजुर्गों और सर्जरी के बाद मरीजों की आवाजाही के लिए आदर्श। पंचर-मुक्त ठोस टायर, सांस लेने योग्य डबल-मेष सीटिंग और मात्र 9.8 किग्रा वजन का त्वरित फोल्डिंग फ्रेम।',
        warranty_info: '12 महीने की फ्रेम वारंटी',
        specifications: [
          { label: 'कुल वजन (Weight)', value: '9.8 किग्रा' },
          { label: 'वजन क्षमता (Capacity)', value: '120 किग्रा' },
          { label: 'सीट की चौड़ाई', value: '46 सेमी (18 इंच)' },
          { label: 'फ्रेम सामग्री', value: 'एयरोस्पेस ग्रेड 7003 एल्युमिनियम' },
          { label: 'टायर', value: 'सॉलिड पंचर-मुक्त पॉलीयूरेथेन पहिए' },
        ],
      },
    },
  },
  {
    name: 'Anti-Decubitus Ripple Medical Air Mattress with Pump',
    slug: 'anti-decubitus-ripple-medical-air-mattress',
    sku: 'MAT-AIR-RPL',
    brand: 'AarogyaMed Care',
    categorySlug: 'home-care',
    subcategorySlug: 'icu-hospital-beds',
    description: 'Essential preventive clinical therapy for bedridden, post-stroke, and ICU recovery patients. Features 130 alternating heat-sealed bubble air cells that systematically relieve pressure points every 6 minutes.',
    images: ['/images/hospital_bed.png', '/images/caregiver.png'],
    specifications: [
      { label: 'Cell Type', value: '130 Alternating Bubble Cells' },
      { label: 'Cycle Time', value: '6 Minutes Alternating Inflation' },
      { label: 'Pump Sound', value: '< 20 dB (Continuous Quiet)' },
      { label: 'Mattress Dimensions', value: '200 cm x 90 cm x 7 cm' },
      { label: 'Max Load', value: '135 kg' },
    ],
    buy_price: 3200.00,
    buy_mrp: 4800.00,
    buy_available: true,
    rent_price_daily: 40.00,
    rent_price_weekly: 240.00,
    rent_price_monthly: 750.00,
    rent_deposit: 1500.00,
    rent_min_period_days: 7,
    rent_available: true,
    stock_quantity: 40,
    warranty_info: '12 Months Compressor Pump Warranty',
    status: 'active',
    conditionTags: ['elderly-care', 'post-surgery-mobility'],
    translations: {
      en: {
        name: 'Anti-Decubitus Ripple Medical Air Mattress with Pump',
        description: 'Essential preventive clinical therapy for bedridden, post-stroke, and ICU recovery patients. Features 130 alternating heat-sealed bubble air cells that systematically relieve pressure points every 6 minutes.',
        warranty_info: '12 Months Compressor Pump Warranty',
        specifications: [
          { label: 'Cell Type', value: '130 Alternating Bubble Cells' },
          { label: 'Cycle Time', value: '6 Minutes Alternating Inflation' },
          { label: 'Pump Sound', value: '< 20 dB (Continuous Quiet)' },
          { label: 'Mattress Dimensions', value: '200 cm x 90 cm x 7 cm' },
          { label: 'Max Load', value: '135 kg' },
        ],
      },
      hi: {
        name: 'एंटी-डेक्यूबिटस रिपल मेडिकल एयर मैट्रेस और पंप',
        description: 'बिस्तर पर पड़े मरीजों और स्ट्रोक रिकवरी के लिए आवश्यक नैदानिक थेरेपी। इसमें 130 बारी-बारी से फूलने वाले एयर सेल हैं जो हर 6 मिनट में शरीर के दबाव बिंदुओं को बदलते हैं।',
        warranty_info: '12 महीने की कंप्रेसर पंप वारंटी',
        specifications: [
          { label: 'सेल प्रकार', value: '130 बारी-बारी से फूलने वाले बबल सेल' },
          { label: 'साइकिल समय (Cycle)', value: 'प्रत्येक 6 मिनट में रोटेशन' },
          { label: 'पंप ध्वनि', value: '< 20 dB (अत्यंत शांत)' },
          { label: 'गद्दे का आकार', value: '200 सेमी x 90 सेमी x 7 सेमी' },
          { label: 'अधिकतम भार', value: '135 किग्रा' },
        ],
      },
    },
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // 1. Fetch categories map
    const [categories] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM categories`
    );
    const categoryMap = new Map();
    categories.forEach((c) => categoryMap.set(c.slug, c.id));

    // 2. Fetch tags map
    const [tags] = await queryInterface.sequelize.query(
      `SELECT id, name FROM tags`
    );
    const tagMap = new Map();
    tags.forEach((t) => tagMap.set(t.name, t.id));

    // 3. Process each product idempotently
    for (const p of MOCK_PRODUCTS) {
      const categoryId = categoryMap.get(p.categorySlug) || null;
      const subcategoryId = categoryMap.get(p.subcategorySlug) || null;

      // Check if product already exists
      const [existing] = await queryInterface.sequelize.query(
        `SELECT id, uuid FROM products WHERE slug = :slug LIMIT 1`,
        { replacements: { slug: p.slug } }
      );

      let productId;
      if (existing && existing.length > 0) {
        productId = existing[0].id;
        // Update product attributes
        await queryInterface.sequelize.query(
          `UPDATE products SET
            name = :name,
            category_id = :category_id,
            subcategory_id = :subcategory_id,
            brand = :brand,
            description = :description,
            images = :images,
            specifications = :specifications,
            buy_price = :buy_price,
            buy_mrp = :buy_mrp,
            buy_available = :buy_available,
            rent_price_daily = :rent_price_daily,
            rent_price_weekly = :rent_price_weekly,
            rent_price_monthly = :rent_price_monthly,
            rent_deposit = :rent_deposit,
            rent_min_period_days = :rent_min_period_days,
            rent_available = :rent_available,
            stock_quantity = :stock_quantity,
            warranty_info = :warranty_info,
            status = :status,
            updated_at = :now
          WHERE id = :id`,
          {
            replacements: {
              id: productId,
              name: p.name,
              category_id: categoryId,
              subcategory_id: subcategoryId,
              brand: p.brand,
              description: p.description,
              images: JSON.stringify(p.images),
              specifications: JSON.stringify(p.specifications),
              buy_price: p.buy_price,
              buy_mrp: p.buy_mrp,
              buy_available: p.buy_available,
              rent_price_daily: p.rent_price_daily,
              rent_price_weekly: p.rent_price_weekly,
              rent_price_monthly: p.rent_price_monthly,
              rent_deposit: p.rent_deposit,
              rent_min_period_days: p.rent_min_period_days,
              rent_available: p.rent_available,
              stock_quantity: p.stock_quantity,
              warranty_info: p.warranty_info,
              status: p.status,
              now,
            },
          }
        );
      } else {
        const productUuid = uuidv4();
        const [inserted] = await queryInterface.sequelize.query(
          `INSERT INTO products (
            uuid, name, slug, category_id, subcategory_id, brand, description,
            images, videos, specifications, buy_price, buy_mrp, buy_available,
            rent_price_daily, rent_price_weekly, rent_price_monthly, rent_deposit,
            rent_min_period_days, rent_available, stock_quantity, warranty_info,
            status, related_product_ids, created_at, updated_at
          ) VALUES (
            :uuid, :name, :slug, :category_id, :subcategory_id, :brand, :description,
            :images, '[]', :specifications, :buy_price, :buy_mrp, :buy_available,
            :rent_price_daily, :rent_price_weekly, :rent_price_monthly, :rent_deposit,
            :rent_min_period_days, :rent_available, :stock_quantity, :warranty_info,
            :status, '[]', :now, :now
          ) RETURNING id`,
          {
            replacements: {
              uuid: productUuid,
              name: p.name,
              slug: p.slug,
              category_id: categoryId,
              subcategory_id: subcategoryId,
              brand: p.brand,
              description: p.description,
              images: JSON.stringify(p.images),
              specifications: JSON.stringify(p.specifications),
              buy_price: p.buy_price,
              buy_mrp: p.buy_mrp,
              buy_available: p.buy_available,
              rent_price_daily: p.rent_price_daily,
              rent_price_weekly: p.rent_price_weekly,
              rent_price_monthly: p.rent_price_monthly,
              rent_deposit: p.rent_deposit,
              rent_min_period_days: p.rent_min_period_days,
              rent_available: p.rent_available,
              stock_quantity: p.stock_quantity,
              warranty_info: p.warranty_info,
              status: p.status,
              now,
            },
          }
        );
        productId = inserted[0].id;
      }

      // 4. Upsert Translations (en & hi)
      for (const [locale, trans] of Object.entries(p.translations)) {
        const [existingTrans] = await queryInterface.sequelize.query(
          `SELECT id FROM product_translations WHERE product_id = :product_id AND locale = :locale LIMIT 1`,
          { replacements: { product_id: productId, locale } }
        );

        if (existingTrans && existingTrans.length > 0) {
          await queryInterface.sequelize.query(
            `UPDATE product_translations SET
              name = :name,
              description = :description,
              specifications = :specifications,
              warranty_info = :warranty_info,
              updated_at = :now
            WHERE id = :id`,
            {
              replacements: {
                id: existingTrans[0].id,
                name: trans.name,
                description: trans.description,
                specifications: JSON.stringify(trans.specifications),
                warranty_info: trans.warranty_info || '',
                now,
              },
            }
          );
        } else {
          await queryInterface.sequelize.query(
            `INSERT INTO product_translations (
              product_id, locale, name, description, specifications, warranty_info, created_at, updated_at
            ) VALUES (
              :product_id, :locale, :name, :description, :specifications, :warranty_info, :now, :now
            )`,
            {
              replacements: {
                product_id: productId,
                locale,
                name: trans.name,
                description: trans.description,
                specifications: JSON.stringify(trans.specifications),
                warranty_info: trans.warranty_info || '',
                now,
              },
            }
          );
        }
      }

      // 5. Link Tags
      for (const tagName of p.conditionTags) {
        const tagId = tagMap.get(tagName);
        if (tagId) {
          const [existingTagLink] = await queryInterface.sequelize.query(
            `SELECT id FROM product_tags WHERE product_id = :product_id AND tag_id = :tag_id LIMIT 1`,
            { replacements: { product_id: productId, tag_id: tagId } }
          );

          if (!existingTagLink || existingTagLink.length === 0) {
            await queryInterface.sequelize.query(
              `INSERT INTO product_tags (product_id, tag_id, created_at, updated_at)
               VALUES (:product_id, :tag_id, :now, :now)`,
              { replacements: { product_id: productId, tag_id: tagId, now } }
            );
          }
        }
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const slugs = MOCK_PRODUCTS.map((p) => p.slug);
    const [products] = await queryInterface.sequelize.query(
      `SELECT id FROM products WHERE slug IN (:slugs)`,
      { replacements: { slugs } }
    );

    if (products && products.length > 0) {
      const productIds = products.map((p) => p.id);
      await queryInterface.sequelize.query(
        `DELETE FROM product_translations WHERE product_id IN (:productIds)`,
        { replacements: { productIds } }
      );
      await queryInterface.sequelize.query(
        `DELETE FROM product_tags WHERE product_id IN (:productIds)`,
        { replacements: { productIds } }
      );
      await queryInterface.sequelize.query(
        `DELETE FROM products WHERE id IN (:productIds)`,
        { replacements: { productIds } }
      );
    }
  },
};
