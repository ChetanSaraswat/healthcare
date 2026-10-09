import { BlogPost } from '@/domain/entities/blog.entity';

export const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'BiPAP vs. CPAP Therapy: Choosing the Right Positive Airway Pressure Support',
    slug: 'bipap-vs-cpap-therapy-guide',
    summary:
      'Understand the key clinical differences between continuous CPAP and bi-level BiPAP therapy for COPD, sleep apnea, and chronic respiratory insufficiency.',
    body: `Positive Airway Pressure (PAP) therapy is the frontline clinical intervention for obstructive sleep apnea, neuromuscular weakness, and acute-on-chronic respiratory failure.

### CPAP (Continuous Positive Airway Pressure)
CPAP delivers a constant, single preset pressure level throughout both inhalation and exhalation. It acts as a pneumatic splint keeping upper airway walls patent during sleep.

### BiPAP (Bi-Level Positive Airway Pressure)
BiPAP delivers two distinct pressure levels:
- **IPAP (Inspiratory Positive Airway Pressure)**: Higher pressure during inhalation to assist ventilation and improve oxygen uptake.
- **EPAP (Expiratory Positive Airway Pressure)**: Lower baseline pressure during exhalation to keep airways open with minimal exhalation resistance.

### When is BiPAP Indicated?
BiPAP is prescribed when patients suffer from COPD with hypercapnia (elevated CO2), ALS/MND, obesity hypoventilation syndrome, or inability to tolerate high continuous CPAP pressures.

### Clinical Titration Protocol
All machines provided by Omkar Healthcare are calibrated by certified biomedical engineers and set precisely to your pulmonologist's titration prescription.`,
    coverImage: '/images/elderly_couple.png',
    authorName: 'Dr. Arvind Sharma (Clinical Critical Care Specialist)',
    status: 'published',
    publishedAt: '2026-09-15T10:00:00.000Z',
    category: 'Respiratory Care',
    equipmentTag: 'CPAP & BiPAP',
    shopLink: '/shop?category=5',
    readTime: '5 min read',
    readTimeMinutes: 5,
    hasHindiTranslation: true,
    translations: {
      hi: {
        locale: 'hi',
        title: 'बाईपैप बनाम सीपैप थेरेपी: सही श्वसन सहायता उपकरण का चयन',
        summary:
          'सीओपीडी, स्लीप एप्निया और श्वसन विफलता के लिए निरंतर सीपैप और बाई-लेवल बाईपैप थेरेपी के बीच महत्वपूर्ण क्लीनिकल अंतर समझें।',
        body: `पॉजिटिव एयरवे प्रेशर (PAP) थेरेपी स्लीप एप्निया और सांस की बीमारियों के लिए सबसे प्रभावी उपचार है।

### सीपैप (CPAP)
सांस लेने और छोड़ने के दौरान एक समान निरंतर दबाव प्रदान करता है ताकि सांस की नली खुली रहे।

### बाईपैप (BiPAP)
सांस लेते समय उच्च दबाव (IPAP) और सांस छोड़ते समय कम दबाव (EPAP) प्रदान करता है, जिससे फेफड़ों पर दबाव कम पड़ता है।

### डॉक्टर की सलाह
ओमकार हेल्थकेयर से मिलने वाली सभी मशीनें प्रमाणित बायोमेडिकल इंजीनियरों द्वारा सटीक डॉक्टर पर्चे के अनुसार कैलिब्रेट की जाती हैं।`,
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

### Recommended Omkar Healthcare Protocol
Use an electrically powered 10L/5L concentrator as the primary source with an emergency B-type or D-type cylinder kept charged as a failsafe during power anomalies.`,
    coverImage: '/images/oxygen_concentrator.png',
    authorName: 'Biomedical Engineering Review Board',
    status: 'published',
    publishedAt: '2026-09-18T14:30:00.000Z',
    category: 'Respiratory Care',
    equipmentTag: 'Respiratory & Oxygen',
    shopLink: '/shop?category=6',
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
    title: 'Medical Suction Machine Operation & Airway Care: Home Nursing Guidelines',
    slug: 'suction-machine-airway-clearing-nursing-protocol',
    summary:
      'Proper vacuum pressure settings, aseptic catheter handling, and secretion clearance techniques to prevent airway occlusion in tracheostomy and stroke care.',
    body: `Airway clearance via medical high-vacuum suction machines is life-saving for patients with impaired cough reflexes, tracheostomies, or post-stroke dysphagia.

### 1. Calibrated Vacuum Pressure Guidelines
- Adults: 100 to 120 mmHg (never exceed 150 mmHg to protect delicate mucosal membranes).
- Children/Pediatric: 80 to 100 mmHg.
- Verify gauge accuracy on the suction regulator before catheter insertion.

### 2. Aseptic Technique
- Always use sterile disposable suction catheters with thumb-control valves.
- Lubricate tip only with sterile water-soluble gel.
- Limit each suction pass to 10-15 seconds to prevent hypoxemia.

### 3. Canister Sanitization
Empty and disinfect the anti-overflow collection canister daily using hospital-grade antimicrobial solutions to prevent bacterial aerosolization.`,
    coverImage: '/images/caregiver.png',
    authorName: 'Sister Maya Verghese (Senior Palliative Nurse)',
    status: 'published',
    publishedAt: '2026-09-20T08:15:00.000Z',
    category: 'Airway Management',
    equipmentTag: 'Nebulizers & Suction',
    shopLink: '/shop?category=10',
    readTime: '4 min read',
    readTimeMinutes: 4,
    hasHindiTranslation: true,
    translations: {
      hi: {
        locale: 'hi',
        title: 'सक्शन मशीन संचालन एवं श्वसन नली सफाई: घरेलू नर्सिंग दिशानिर्देश',
        summary:
          'ट्रेकियोस्टॉमी और स्ट्रोक मरीजों में श्वसन मार्ग खुला रखने के लिए वैक्यूम दबाव नियंत्रण और रोगाणुरहित कैथेटर उपयोग के क्लीनिकल नियम।',
        body: `श्वसन मार्ग से कफ साफ करने के लिए मेडिकल सक्शन मशीन का सही उपयोग मरीज के जीवन की सुरक्षा के लिए अत्यंत महत्वपूर्ण है।

### 1. वैक्यूम दबाव मानक
वयस्कों के लिए 100-120 mmHg का सुरक्षित दबाव रखें ताकि श्वासनली की आंतरिक परत सुरक्षित रहे।

### 2. स्वच्छता नियम
प्रत्येक सक्शन के लिए स्वच्छ कैथेटर का उपयोग करें और एक बार में 10-15 सेकंड से अधिक सक्शन न करें।

### 3. कैनिस्टर की सफाई
कलेक्शन जार को रोजाना कीटाणुनाशक घोल से साफ करें।`,
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
    shopLink: '/shop?category=5',
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

export const getStaticPostBySlug = (slug: string): BlogPost | undefined => {
  return STATIC_BLOG_POSTS.find((p) => p.slug === slug || String(p.id) === slug);
};
