import { axiosInterceptorInstanceClient } from '@/config/axios';
import { BlogPost } from '@/domain/entities/blog.entity';
import { ListBlogPostsResponse } from './list-posts.interface';

export const INITIAL_MOCK_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'How to Set Up a Hospital-Grade Home ICU: The 7 Essential Devices',
    slug: 'home-icu-setup-essential-devices',
    summary:
      'Transitioning a patient from hospital ICU to home requires strict adherence to infection control, back-up oxygen, motorized 5-function positioning, and continuous vitals monitoring.',
    body: `Transitioning a patient from a hospital intensive care unit (ICU) to home care is a critical milestone that requires precision, clinical vigilance, and reliable biomedical equipment.

### 1. 5-Function Motorized Hospital ICU Bed
A 5-function motorized bed provides cardiac chair positioning, Trendelenburg, reverse Trendelenburg, height elevation, and back/knee rest adjustments. These postures reduce pulmonary aspiration risk, assist in venous return, and facilitate daily nursing maneuvers.

### 2. High-Flow Oxygen Concentrator (10L Dual Flow)
For patients with compromised respiratory drive, continuous medical-grade oxygen purity (>93% ± 3%) is essential. Dual-flow ports permit concurrent nebulization or two-point delivery.

### 3. Medical Suction Machine (Continuous & Intermittent)
Clearing bronchial secretions in tracheostomy or stroke patients prevents fatal airway occlusion and aspiration pneumonia.

### 4. Multi-Parameter Patient Vitals Monitor
Continuous tracking of ECG, SpO2, Non-Invasive Blood Pressure (NIBP), respiratory rate, and core body temperature ensures early warning of septic or respiratory decompensation.

### 5. Alternating Pressure Ripple Bubble Mattress
Essential for patients immobile for over 12 hours a day to prevent stage 3 and 4 pressure decubitus ulcers.

### 6. Emergency Oxygen Cylinder Backup (B-Type / D-Type)
A loaded oxygen cylinder with preset regulator must be kept on standby to counter unexpected power outages or concentrator maintenance periods.

### 7. Portable Emergency Resuscitation & AMBU Bag
Essential bedside emergency equipment for immediate manual ventilation support.`,
    coverImage: '/images/hospital_bed.png',
    authorName: 'Dr. Arvind Sharma (Clinical Critical Care Specialist)',
    status: 'published',
    publishedAt: '2026-09-15T10:00:00.000Z',
    category: 'Home ICU Setup',
    equipmentTag: 'Hospital Beds & ICU',
    shopLink: '/shop?category=cat-icu-beds',
    readTime: '6 min read',
    readTimeMinutes: 6,
    hasHindiTranslation: true,
    translations: {
      hi: {
        locale: 'hi',
        title: 'होम आईसीयू कैसे सेटअप करें: 7 अनिवार्य जीवनरक्षक चिकित्सा उपकरण',
        summary:
          'अस्पताल आईसीयू से मरीज को घर स्थानांतरित करते समय संक्रमण नियंत्रण, बैकअप ऑक्सीजन, 5-फंक्शन मोटराइज्ड बेड और निरंतर वाइटल्स मॉनिटरिंग का कड़ाई से पालन आवश्यक है।',
        body: `अस्पताल के आईसीयू से मरीज को घर की देखभाल में स्थानांतरित करना एक महत्वपूर्ण चरण है जिसके लिए पूर्ण सटीकता और प्रमाणित बायोमेडिकल उपकरणों की आवश्यकता होती है।

### 1. 5-फंक्शन मोटराइज्ड आईसीयू अस्पताल बेड
कार्डिएक चेयर, ट्रेंडेलेनबर्ग और पीठ/घुटने के कोण नियंत्रण से फेफड़ों में भोजन जाने का खतरा न्यूनतम होता है।

### 2. 10 लीटर हाई-फ्लो ऑक्सीजन कंसंट्रेटर
निरंतर 93% शुद्धता वाली ऑक्सीजन की आपूर्ति श्वसन विफलता से ग्रस्त मरीजों के लिए अनिवार्य है।

### 3. सक्शन मशीन
ट्रेकियोस्टॉमी या लकवाग्रस्त मरीजों के श्वसन मार्ग से कफ साफ करने के लिए।

### 4. मल्टी-पैरामीटर पेशेंट मॉनिटर
ईसीजी, ऑक्सीजन संतृप्ति (SpO2), रक्तचाप और श्वसन दर की निरंतर निगरानी।

### 5. अल्टरनेटिंग एयर प्रेशर मैट्रेस (एंटी-बेडसोर गद्दा)
लगातार लेटे रहने वाले मरीजों में दबाव के छालों (बेड सोर) की रोकथाम हेतु।`,
      },
    },
  },
  {
    id: 2,
    title: 'Oxygen Concentrator vs. Oxygen Cylinder: A Caregiver’s Decision Matrix',
    slug: 'oxygen-concentrator-vs-cylinder-caregiver-guide',
    summary:
      'Continuous flow 10L concentrators eliminate recurring cylinder refills. Learn when continuous flow is required, how purity alarms work, and when cylinders are used as emergency backups.',
    body: `Caregivers often face the dilemma of choosing between a stationary oxygen concentrator and high-pressure oxygen cylinders.

### Working Principles Compared
An oxygen concentrator extracts ambient room air, runs it through synthetic zeolite molecular sieve beds, and removes nitrogen to deliver up to 95% pure oxygen on demand. Oxygen cylinders, conversely, hold compressed medical gas under 150-200 bar pressure.

### Cost & Logistics
- **Concentrators**: Higher initial acquisition or rental cost, but zero refill logistics. Highly economical for patients requiring >15 hours of daily therapy.
- **Cylinders**: Low unit rental cost, but recurring logistics charges and frequent refills (a B-type cylinder lasts only 3-5 hours at 4 LPM).

### Recommended AarogyaMed Protocol
Use an electrically powered 10L/5L concentrator as the primary source with an emergency B-type or D-type cylinder kept charged as a failsafe during power anomalies.`,
    coverImage: '/images/oxygen_concentrator.png',
    authorName: 'Biomedical Engineering Review Board',
    status: 'published',
    publishedAt: '2026-09-18T14:30:00.000Z',
    category: 'Respiratory Care',
    equipmentTag: 'Respiratory & Oxygen',
    shopLink: '/shop?category=cat-respiratory',
    readTime: '5 min read',
    readTimeMinutes: 5,
    hasHindiTranslation: true,
    translations: {
      hi: {
        locale: 'hi',
        title: 'ऑक्सीजन कंसंट्रेटर बनाम ऑक्सीजन सिलेंडर: देखभालकर्ताओं के लिए तुलनात्मक गाइड',
        summary:
          '10L कंसंट्रेटर बार-बार सिलेंडर रीफिल के झंझट को समाप्त करते हैं। जानें कब निरंतर फ्लो की आवश्यकता होती है और कब सिलेंडर आपातकालीन बैकअप के रूप में आवश्यक हैं।',
        body: `होम केयर में श्वसन सहायता के लिए कंसंट्रेटर और सिलेंडर का सही चयन मरीज की सुरक्षा के लिए निर्णायक है।

### मुख्य अंतर
- **कंसंट्रेटर**: कमरे की हवा से नाइट्रोजन अलग करके 24 घंटे लगातार ऑक्सीजन प्रदान करता है। रीफिल की आवश्यकता नहीं होती।
- **सिलेंडर**: अत्यधिक दबाव पर गैस भरी होती है जो 4-5 घंटे में समाप्त हो जाती है।

### अनुशंसित प्रोटोकॉल
दैनिक उपयोग के लिए 10L कंसंट्रेटर और बिजली कटौती के बैकअप के लिए एक आपातकालीन सिलेंडर रखें।`,
      },
    },
  },
  {
    id: 3,
    title: 'Preventing Decubitus Pressure Ulcers (Bed Sores): Clinical Guidelines',
    slug: 'preventing-bed-sores-clinical-nursing-protocol',
    summary:
      'Stage I and II pressure ulcers can develop within 48 hours of bed rest. Discover how 6-minute alternating ripple bubble air mattresses protect fragile skin.',
    body: `Pressure ulcers (decubitus ulcers or bed sores) represent one of the most preventable yet devastating complications in bedbound home healthcare.

### Mechanism of Tissue Breakdown
When external pressure over a bony prominence (sacrum, heels, ischial tuberosities) exceeds normal capillary arteriolar pressure (32 mmHg), localized ischemia ensues. If sustained for as little as 2 hours, cellular necrosis triggers ulceration.

### The 4-Pillar Prevention Protocol
1. **Alternating Pressure Therapy**: Medical-grade alternating air mattresses cycle inflate/deflate cells every 6 to 10 minutes, relieving peak capillary pressure points.
2. **2-Hour Q2H Repositioning**: Turn the patient 30 degrees obliquely left and right every 2 hours using slide sheets.
3. **Moisture & Shear Management**: Use silicone barrier creams and breathable drawsheets.
4. **Nutrition & Hydration**: High-protein enteral nutritional support accelerates skin barrier integrity.`,
    coverImage: '/images/caregiver.png',
    authorName: 'Sister Maya Verghese (Senior Palliative Nurse)',
    status: 'published',
    publishedAt: '2026-09-20T08:15:00.000Z',
    category: 'Geriatric Care',
    equipmentTag: 'Anti-Decubitus Care',
    shopLink: '/shop?category=cat-icu-beds',
    readTime: '4 min read',
    readTimeMinutes: 4,
    hasHindiTranslation: true,
    translations: {
      hi: {
        locale: 'hi',
        title: 'बेड सोर (दबाव के छालों) की रोकथाम: क्लीनिकल नर्सिंग दिशानिर्देश',
        summary:
          'लंबे समय तक बिस्तर पर रहने वाले मरीजों में 48 घंटे के भीतर बेड सोर विकसित हो सकते हैं। जानें कैसे 6-मिनट का एयर गद्दा त्वचा की सुरक्षा करता है।',
        body: `बिस्तर पर निर्भर मरीजों के लिए बेड सोर की रोकथाम प्राथमिक प्राथमिकता है।

### 4-स्तंभ रोकथाम प्रोटोकॉल
1. **अल्टरनेटिंग प्रेशर गद्दा**: हवा के कक्ष बारी-बारी से फूलते और खाली होते हैं जिससे त्वचा पर लगातार दबाव नहीं बनता।
2. **हर 2 घंटे में करवट बदलना**: मरीज की स्थिति 30 डिग्री कोण पर बदलें।
3. **नमी नियंत्रण**: त्वचा को सूखा और साफ रखें।
4. **उच्च प्रोटीन आहार**: ऊतकों के पुनर्निर्माण के लिए।`,
      },
    },
  },
  {
    id: 4,
    title: 'Sleep Apnea Care: Adapting to CPAP Therapy in the First 14 Days',
    slug: 'sleep-apnea-adapting-to-cpap-therapy-first-14-days',
    summary:
      'Desensitization techniques, selecting the right full-face vs nasal mask seal, and preventing nasal dryness with heated HumidAir climate control.',
    body: `Continuous Positive Airway Pressure (CPAP) remains the gold standard treatment for Obstructive Sleep Apnea (OSA). However, up to 40% of patients discontinue therapy during the first fortnight without structured acclimation.

### Overcoming Initial Barriers
- **Claustrophobia**: Practice wearing the silicone mask for 20-30 minutes during daytime reading or television before sleeping.
- **Nasal Congestion & Dryness**: Enable heated humidification (HumidAir level 3-4) and heated tubing to prevent mucosal irritation.
- **Expiratory Pressure Discomfort**: Use EPR (Expiratory Pressure Relief) to gently drop pressure by 2-3 cmH2O during exhalation.

### Nightly Compliance Tracking
Target at least 4 hours of consecutive nightly use for >70% of nights within the initial 30 days to observe significant cardiovascular risk reduction.`,
    coverImage: '/images/elderly_couple.png',
    authorName: 'Dr. Nikhil Kulkarni (Pulmonologist & Sleep Specialist)',
    status: 'published',
    publishedAt: '2026-09-22T11:45:00.000Z',
    category: 'Sleep & Pulmonology',
    equipmentTag: 'CPAP & BiPAP',
    shopLink: '/shop?category=cat-respiratory',
    readTime: '5 min read',
    readTimeMinutes: 5,
    hasHindiTranslation: true,
    translations: {
      hi: {
        locale: 'hi',
        title: 'स्लीप एप्निया केयर: पहले 14 दिनों में CPAP थेरेपी अपनाने की व्यावहारिक गाइड',
        summary:
          'मास्क सील का सही चयन, अनुकूलन तकनीकें, और हीटेड ह्यूमिडिफायर से नाक के सूखेपन को रोकने के क्लीनिकल तरीके।',
        body: `सीपीएपी थेरेपी स्लीप एप्निया के इलाज का सबसे प्रभावी तरीका है। पहले 14 दिन मरीज के अनुकूलन के लिए सबसे महत्वपूर्ण होते हैं।

### अनुकूलन के उपाय
- **दिन में अभ्यास**: दिन में टीवी देखते या पढ़ते समय 20 मिनट मास्क पहनें।
- **हीटेड ह्यूमिडिफायर का उपयोग**: नाक के सूखेपन और छींक से बचने के लिए ह्यूमिडिटी स्तर 3 पर रखें।
- **नियमितता**: कार्डियोवैस्कुलर स्वास्थ्य लाभ के लिए प्रति रात कम से कम 4 घंटे उपयोग सुनिश्चित करें।`,
      },
    },
  },
];

export const listBlogPostsService = async (params?: {
  locale?: string;
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ListBlogPostsResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get('/blog', { params });
    if (response.data && response.data.data && Array.isArray(response.data.data.posts)) {
      return response.data;
    }
  } catch (err) {
    // Graceful fallback to rich mock data
  }

  return {
    success: true,
    data: {
      total: INITIAL_MOCK_POSTS.length,
      page: 1,
      limit: 10,
      totalPages: 1,
      posts: INITIAL_MOCK_POSTS,
    },
  };
};
