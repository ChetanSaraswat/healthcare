import { Condition } from "@/domain/entities/condition.entity";

export const STATIC_LEARN_CONDITIONS: Condition[] = [
  {
    id: 'cond-sleep-apnea',
    name: 'Sleep Apnea & Hypopnea',
    slug: 'sleep-apnea',
    tag: 'sleep-apnea',
    shortDescription: 'Understanding obstructive and central sleep apnea, overnight oxygen desaturation, and effective PAP therapy.',
    heroImage: '/images/elderly_couple.png',
    symptoms: [
      { title: 'Loud Chronic Snoring', description: 'Gasping or choking sounds during sleep accompanied by witnessed breathing pauses.' },
      { title: 'Morning Headaches & Brain Fog', description: 'Waking up unrefreshed, persistent dry throat, and excessive daytime sleepiness.' },
      { title: 'Cardiovascular Strain', description: 'Hypertension spikes and irregular heartbeat exacerbated by nocturnal hypoxia.' },
    ],
    symptomsIllustration: {
      imageUrl: '/images/sleep-areana-images/original_dual_phase_medical_symptom_guide_infographic_poster_comparing.png',
      altText: {
        en: 'Illustration showing common nighttime and daytime sleep apnea symptoms including breathing pauses, snoring, and restlessness',
        hi: 'स्लीप एप्निया के सामान्य रात्रि और दिन के लक्षणों जैसे सांस रुकना, खर्राटे और बेचैनी को दर्शाने वाला चित्र',
      },
      sourceAttribution: 'Original illustration commissioned for Omkar Healthcare',
    },
    contentBlocks: [
      {
        id: 'block-anatomy-overview',
        slug: 'anatomy-airway-obstruction',
        title: 'Anatomy of Sleep Apnea: How the Airway Collapses',
        items: [
          {
            title: 'Upper Airway Muscle Relaxation',
            description: 'During sleep, the muscles that hold the throat open relax. In people with OSA, the airway narrows or collapses completely, blocking airflow.',
          },
          {
            title: 'Obstructive vs. Central Sleep Apnea',
            description: 'Obstructive sleep apnea (OSA) is caused by physical airway collapse. Central sleep apnea (CSA) occurs when the brain fails to send proper breathing signals — even when the airway is open.',
          },
          {
            title: 'Hypopnea: Partial Obstruction',
            description: 'Hypopneas are partial breathing reductions ≥30% lasting ≥10 seconds, causing measurable SpO₂ drops and sleep fragmentation even without complete airway closure.',
          },
          {
            title: 'Apnea-Hypopnea Index (AHI)',
            description: 'AHI measures the average number of apneas + hypopneas per hour. Mild OSA: 5–14/hr. Moderate: 15–29/hr. Severe: ≥30/hr — requiring immediate PAP therapy.',
          },
        ],
        illustration: {
          imageUrl: '/images/sleep-areana-images/original_full_body_medical_anatomical_infographic_illustration_depicting_the.png',
          altText: {
            en: 'Full-body medical anatomical infographic depicting how obstructive sleep apnea causes airway collapse and systemic oxygen deprivation',
            hi: 'पूर्ण शरीर की चिकित्सा शारीरिक रचना इन्फोग्राफिक जो दर्शाती है कि ऑब्सट्रक्टिव स्लीप एप्निया कैसे वायुमार्ग को अवरुद्ध करता है',
          },
          sourceAttribution: 'Original illustration commissioned for Omkar Healthcare',
        },
      },
      {
        id: 'block-heart-effects',
        slug: 'effects-on-the-heart',
        title: 'Effects on the Heart',
        items: [
          {
            title: 'High Blood Pressure',
            description: 'Oxygen drops during breathing pauses trigger stress hormones like adrenaline, raising blood pressure.',
          },
          {
            title: 'Heart Attack Risk',
            description: 'Sustained low oxygen and increased arterial blockage roughly double the risk of heart attack.',
          },
          {
            title: 'Irregular Heartbeat (Arrhythmia/AFib)',
            description: 'Oxygen imbalance can cause abnormal heart rhythms, including atrial fibrillation.',
          },
          {
            title: 'Heart Failure',
            description: 'Sustained strain on the heart muscle over time can lead to heart failure.',
          },
          {
            title: 'Stroke',
            description: 'Blood vessel inflammation and increased clotting risk raise stroke risk.',
          },
        ],
        illustration: {
          imageUrl: '/images/sleep-areana-images/original_healthcare_awareness_infographic_poster_titled_long_term_health_risks.png',
          altText: {
            en: 'Infographic poster illustrating long-term cardiovascular risks and effects of untreated sleep apnea on the heart',
            hi: 'अनउपचारित स्लीप एप्निया के हृदय पर पड़ने वाले दीर्घकालिक जोखिमों और प्रभावों को दर्शाने वाला इन्फोग्राफिक पोस्टर',
          },
          sourceAttribution: 'Original illustration commissioned for Omkar Healthcare',
        },
      },
      {
        id: 'block-brain-effects',
        slug: 'effects-on-brain-nervous-system',
        title: 'Effects on Brain & Nervous System',
        reversibilityNote: 'With CPAP therapy or other doctor-guided treatment, this nervous-system strain can often be reduced, and some damage may be partially reversed — displayed as a reassuring closing note, not a guarantee.',
        items: [
          {
            title: 'Sympathetic Overdrive',
            description: 'Each breathing pause triggers a "fight or flight" response, keeping stress hormones like cortisol and adrenaline elevated, an effect that can persist into the daytime.',
          },
          {
            title: 'Oxygen Deprivation (Hypoxia)',
            description: 'Repeated low-oxygen episodes stress brain and nerve cells.',
          },
          {
            title: 'Brain Fog & Memory Issues',
            description: 'Fragmented sleep prevents deep and REM sleep, impairing memory consolidation and daytime focus.',
          },
          {
            title: 'White Matter Damage',
            description: 'In severe, long-term cases, chronic inflammation can damage the brain\'s white matter, affecting signal transfer between brain regions.',
          },
          {
            title: 'Increased Stroke Risk',
            description: 'Chronic high blood pressure and vessel stress significantly raise stroke risk.',
          },
          {
            title: 'Mood Disturbances',
            description: 'Chemical imbalance in the nervous system increases irritability, anxiety, and depression risk.',
          },
          {
            title: 'Morning Headaches',
            description: 'Nighttime CO2 buildup and nervous system strain often cause headaches on waking.',
          },
        ],
        illustration: {
          imageUrl: '/images/sleep-areana-images/original_modern_medical_infographic_illustration_showing_the_systemic_impact_of.png',
          altText: {
            en: 'Modern medical anatomical illustration showing the systemic impact of sleep apnea on the brain and nervous system',
            hi: 'मस्तिष्क और तंत्रिका तंत्र पर स्लीप एप्निया के प्रणालीगत प्रभाव को दर्शाने वाला आधुनिक मेडिकल इन्फोग्राफिक चित्र',
          },
          sourceAttribution: 'Original illustration commissioned for Omkar Healthcare',
        },
      },
      {
        id: 'block-metabolic-effects',
        slug: 'effects-on-metabolism-hormones',
        title: 'Metabolic & Hormonal Disruption',
        reversibilityNote: 'Consistent CPAP therapy has been shown to partially restore insulin sensitivity and reduce cortisol levels, with measurable improvements in metabolic markers within 3–6 months of adherent use.',
        items: [
          {
            title: 'Insulin Resistance & Type 2 Diabetes Risk',
            description: 'Intermittent hypoxia and sleep fragmentation impair glucose metabolism, significantly increasing insulin resistance independent of obesity.',
          },
          {
            title: 'Weight Gain & Leptin Dysregulation',
            description: 'Poor sleep disrupts leptin and ghrelin balance — the hormones that control hunger and satiety — leading to increased appetite and weight gain.',
          },
          {
            title: 'Cortisol & Stress Hormone Elevation',
            description: 'Chronic sleep deprivation keeps cortisol levels elevated, which suppresses immune function and accelerates cellular aging.',
          },
          {
            title: 'Testosterone & Libido Reduction',
            description: 'Deep sleep (slow-wave sleep) is essential for testosterone production; its disruption causes clinically significant hormonal decline.',
          },
          {
            title: 'Thyroid Function Interference',
            description: 'Repeated hypoxic episodes affect thyroid hormone secretion patterns, compounding fatigue and metabolic slowdown.',
          },
        ],
        illustration: {
          imageUrl: '/images/sleep-areana-images/original_patient_education_infographic_poster_illustrating_understanding.png',
          altText: {
            en: 'Patient education infographic illustrating the metabolic and hormonal effects of sleep apnea including insulin resistance, weight gain, and cortisol disruption',
            hi: 'स्लीप एप्निया के चयापचय और हार्मोनल प्रभावों जैसे इंसुलिन प्रतिरोध, वजन बढ़ना और कोर्टिसोल असंतुलन को दर्शाने वाला रोगी शिक्षा इन्फोग्राफिक',
          },
          sourceAttribution: 'Original illustration commissioned for Omkar Healthcare',
        },
      },
    ],
    caregiverTips: [
      { title: 'Ensure Mask Seal Compliance', detail: 'Check for air leaks around nasal cushion; use distilled water only in humidifiers.' },
      { title: 'Track Nightly Usage Hours', detail: 'Aim for a minimum of 4–6 hours nightly for therapeutic cardiovascular recovery.' },
      { title: 'Clean Tube & Chamber Weekly', detail: 'Wash tubing and water chamber in warm soapy water to prevent bacterial colonization.' },
    ],
    recommendedEquipmentCategories: ['respiratory-care'],
    translations: {
      en: {
        locale: 'en',
        name: 'Sleep Apnea & Hypopnea',
        shortDescription: 'Understanding obstructive and central sleep apnea, overnight oxygen desaturation, and effective PAP therapy.',
        symptoms: [
          { title: 'Loud Chronic Snoring', description: 'Gasping or choking sounds during sleep accompanied by witnessed breathing pauses.' },
          { title: 'Morning Headaches & Brain Fog', description: 'Waking up unrefreshed, persistent dry throat, and excessive daytime sleepiness.' },
          { title: 'Cardiovascular Strain', description: 'Hypertension spikes and irregular heartbeat exacerbated by nocturnal hypoxia.' },
        ],
        contentBlocks: [
          {
            id: 'block-anatomy-overview',
            slug: 'anatomy-airway-obstruction',
            title: 'Anatomy of Sleep Apnea: How the Airway Collapses',
            items: [
              {
                title: 'Upper Airway Muscle Relaxation',
                description: 'During sleep, the muscles that hold the throat open relax. In people with OSA, the airway narrows or collapses completely, blocking airflow.',
              },
              {
                title: 'Obstructive vs. Central Sleep Apnea',
                description: 'Obstructive sleep apnea (OSA) is caused by physical airway collapse. Central sleep apnea (CSA) occurs when the brain fails to send proper breathing signals — even when the airway is open.',
              },
              {
                title: 'Hypopnea: Partial Obstruction',
                description: 'Hypopneas are partial breathing reductions ≥30% lasting ≥10 seconds, causing measurable SpO₂ drops and sleep fragmentation even without complete airway closure.',
              },
              {
                title: 'Apnea-Hypopnea Index (AHI)',
                description: 'AHI measures the average number of apneas + hypopneas per hour. Mild OSA: 5–14/hr. Moderate: 15–29/hr. Severe: ≥30/hr — requiring immediate PAP therapy.',
              },
            ],
            illustration: {
              imageUrl: '/images/sleep-areana-images/original_full_body_medical_anatomical_infographic_illustration_depicting_the.png',
              altText: {
                en: 'Full-body medical anatomical infographic depicting how obstructive sleep apnea causes airway collapse and systemic oxygen deprivation',
                hi: 'पूर्ण शरीर की चिकित्सा शारीरिक रचना इन्फोग्राफिक जो दर्शाती है कि ऑब्सट्रक्टिव स्लीप एप्निया कैसे वायुमार्ग को अवरुद्ध करता है',
              },
              sourceAttribution: 'Original illustration commissioned for Omkar Healthcare',
            },
          },
          {
            id: 'block-heart-effects',
            slug: 'effects-on-the-heart',
            title: 'Effects on the Heart',
            items: [
              {
                title: 'High Blood Pressure',
                description: 'Oxygen drops during breathing pauses trigger stress hormones like adrenaline, raising blood pressure.',
              },
              {
                title: 'Heart Attack Risk',
                description: 'Sustained low oxygen and increased arterial blockage roughly double the risk of heart attack.',
              },
              {
                title: 'Irregular Heartbeat (Arrhythmia/AFib)',
                description: 'Oxygen imbalance can cause abnormal heart rhythms, including atrial fibrillation.',
              },
              {
                title: 'Heart Failure',
                description: 'Sustained strain on the heart muscle over time can lead to heart failure.',
              },
              {
                title: 'Stroke',
                description: 'Blood vessel inflammation and increased clotting risk raise stroke risk.',
              },
            ],
            illustration: {
              imageUrl: '/images/sleep-areana-images/original_healthcare_awareness_infographic_poster_titled_long_term_health_risks.png',
              altText: {
                en: 'Infographic poster illustrating long-term cardiovascular risks and effects of untreated sleep apnea on the heart',
                hi: 'अनउपचारित स्लीप एप्निया के हृदय पर पड़ने वाले दीर्घकालिक जोखिमों और प्रभावों को दर्शाने वाला इन्फोग्राफिक पोस्टर',
              },
              sourceAttribution: 'Original illustration commissioned for Omkar Healthcare',
            },
          },
          {
            id: 'block-brain-effects',
            slug: 'effects-on-brain-nervous-system',
            title: 'Effects on Brain & Nervous System',
            reversibilityNote: 'With CPAP therapy or other doctor-guided treatment, this nervous-system strain can often be reduced, and some damage may be partially reversed — displayed as a reassuring closing note, not a guarantee.',
            items: [
              {
                title: 'Sympathetic Overdrive',
                description: 'Each breathing pause triggers a "fight or flight" response, keeping stress hormones like cortisol and adrenaline elevated, an effect that can persist into the daytime.',
              },
              {
                title: 'Oxygen Deprivation (Hypoxia)',
                description: 'Repeated low-oxygen episodes stress brain and nerve cells.',
              },
              {
                title: 'Brain Fog & Memory Issues',
                description: 'Fragmented sleep prevents deep and REM sleep, impairing memory consolidation and daytime focus.',
              },
              {
                title: 'White Matter Damage',
                description: 'In severe, long-term cases, chronic inflammation can damage the brain\'s white matter, affecting signal transfer between brain regions.',
              },
              {
                title: 'Increased Stroke Risk',
                description: 'Chronic high blood pressure and vessel stress significantly raise stroke risk.',
              },
              {
                title: 'Mood Disturbances',
                description: 'Chemical imbalance in the nervous system increases irritability, anxiety, and depression risk.',
              },
              {
                title: 'Morning Headaches',
                description: 'Nighttime CO2 buildup and nervous system strain often cause headaches on waking.',
              },
            ],
            illustration: {
              imageUrl: '/images/sleep-areana-images/original_modern_medical_infographic_illustration_showing_the_systemic_impact_of.png',
              altText: {
                en: 'Modern medical anatomical illustration showing the systemic impact of sleep apnea on the brain and nervous system',
                hi: 'मस्तिष्क और तंत्रिका तंत्र पर स्लीप एप्निया के प्रणालीगत प्रभाव को दर्शाने वाला आधुनिक मेडिकल इन्फोग्राफिक चित्र',
              },
              sourceAttribution: 'Original illustration commissioned for Omkar Healthcare',
            },
          },
          {
            id: 'block-metabolic-effects',
            slug: 'effects-on-metabolism-hormones',
            title: 'Metabolic & Hormonal Disruption',
            reversibilityNote: 'Consistent CPAP therapy has been shown to partially restore insulin sensitivity and reduce cortisol levels, with measurable improvements in metabolic markers within 3–6 months of adherent use.',
            items: [
              {
                title: 'Insulin Resistance & Type 2 Diabetes Risk',
                description: 'Intermittent hypoxia and sleep fragmentation impair glucose metabolism, significantly increasing insulin resistance independent of obesity.',
              },
              {
                title: 'Weight Gain & Leptin Dysregulation',
                description: 'Poor sleep disrupts leptin and ghrelin balance — the hormones that control hunger and satiety — leading to increased appetite and weight gain.',
              },
              {
                title: 'Cortisol & Stress Hormone Elevation',
                description: 'Chronic sleep deprivation keeps cortisol levels elevated, which suppresses immune function and accelerates cellular aging.',
              },
              {
                title: 'Testosterone & Libido Reduction',
                description: 'Deep sleep (slow-wave sleep) is essential for testosterone production; its disruption causes clinically significant hormonal decline.',
              },
              {
                title: 'Thyroid Function Interference',
                description: 'Repeated hypoxic episodes affect thyroid hormone secretion patterns, compounding fatigue and metabolic slowdown.',
              },
            ],
            illustration: {
              imageUrl: '/images/sleep-areana-images/original_patient_education_infographic_poster_illustrating_understanding.png',
              altText: {
                en: 'Patient education infographic illustrating the metabolic and hormonal effects of sleep apnea including insulin resistance, weight gain, and cortisol disruption',
                hi: 'स्लीप एप्निया के चयापचय और हार्मोनल प्रभावों जैसे इंसुलिन प्रतिरोध, वजन बढ़ना और कोर्टिसोल असंतुलन को दर्शाने वाला रोगी शिक्षा इन्फोग्राफिक',
              },
              sourceAttribution: 'Original illustration commissioned for Omkar Healthcare',
            },
          },
        ],
        caregiverTips: [
          { title: 'Ensure Mask Seal Compliance', detail: 'Check for air leaks around nasal cushion; use distilled water only in humidifiers.' },
          { title: 'Track Nightly Usage Hours', detail: 'Aim for a minimum of 4–6 hours nightly for therapeutic cardiovascular recovery.' },
          { title: 'Clean Tube & Chamber Weekly', detail: 'Wash tubing and water chamber in warm soapy water to prevent bacterial colonization.' },
        ],
      },
      hi: {
        locale: 'hi',
        name: 'स्लीप एप्निया और हाइपोप्निया',
        shortDescription: 'ऑब्सट्रक्टिव और सेंट्रल स्लीप एप्निया, रात में ऑक्सीजन के स्तर में गिरावट और प्रभावी पीएपी (PAP) थेरेपी की पूरी जानकारी।',
        symptoms: [
          { title: 'तेज आवाज में लगातार खर्राटे', description: 'सोते समय सांस घुटने या हांफने जैसी आवाजें और सांस रुकने के प्रत्यक्ष लक्षण।' },
          { title: 'सुबह सिरदर्द और मानसिक थकान', description: 'जागने पर भी थकान महसूस होना, लगातार गला सूखना और दिन के समय अत्यधिक नींद आना।' },
          { title: 'हृदय और रक्तचाप पर दबाव', description: 'रात में हाइपोक्सिया (ऑक्सीजन की कमी) के कारण अचानक हाई ब्लड प्रेशर और दिल की अनियमित धड़कन।' },
        ],
        contentBlocks: [
          {
            id: 'block-anatomy-overview',
            slug: 'anatomy-airway-obstruction',
            title: 'स्लीप एप्निया की शारीरिक रचना: वायुमार्ग कैसे बंद होता है',
            items: [
              {
                title: 'ऊपरी वायुमार्ग की मांसपेशियों का शिथिल होना',
                description: 'नींद के दौरान गले को खुला रखने वाली मांसपेशियां ढीली हो जाती हैं। OSA से पीड़ित लोगों में वायुमार्ग संकुचित हो जाता है या पूरी तरह से बंद हो जाता है, जिससे हवा का प्रवाह रुक जाता है।',
              },
              {
                title: 'ऑब्सट्रक्टिव बनाम सेंट्रल स्लीप एप्निया',
                description: 'ऑब्सट्रक्टिव स्लीप एप्निया (OSA) शारीरिक वायुमार्ग के बंद होने से होता है। सेंट्रल स्लीप एप्निया (CSA) तब होता है जब मस्तिष्क श्वास के लिए सही संकेत भेजने में विफल हो जाता है।',
              },
              {
                title: 'हाइपोप्निया: आंशिक अवरोध',
                description: 'हाइपोप्निया ≥10 सेकंड तक चलने वाली ≥30% आंशिक श्वास कमी है, जो वायुमार्ग पूरी तरह बंद हुए बिना भी SpO₂ में मापनीय गिरावट और नींद में बाधा उत्पन्न करती है।',
              },
              {
                title: 'एपनिया-हाइपोप्निया इंडेक्स (AHI)',
                description: 'AHI प्रति घंटे औसत एपनिया + हाइपोप्निया की संख्या को मापता है। माइल्ड OSA: 5–14/घंटा। मॉडरेट: 15–29/घंटा। सीवियर: ≥30/घंटा — तत्काल PAP थेरेपी आवश्यक।',
              },
            ],
            illustration: {
              imageUrl: '/images/sleep-areana-images/original_full_body_medical_anatomical_infographic_illustration_depicting_the.png',
              altText: {
                en: 'Full-body medical anatomical infographic depicting how obstructive sleep apnea causes airway collapse and systemic oxygen deprivation',
                hi: 'पूर्ण शरीर की चिकित्सा शारीरिक रचना इन्फोग्राफिक जो दर्शाती है कि ऑब्सट्रक्टिव स्लीप एप्निया कैसे वायुमार्ग को अवरुद्ध करता है',
              },
              sourceAttribution: 'Original illustration commissioned for Omkar Healthcare',
            },
          },
          {
            id: 'block-heart-effects',
            slug: 'effects-on-the-heart',
            title: 'कार्डियोवैस्कुलर प्रभाव',
            items: [
              {
                title: 'उच्च रक्तचाप (High Blood Pressure)',
                description: 'सांस रुकने पर शरीर में ऑक्सीजन कम होती है और एड्रेनालाईन जैसे स्ट्रेस हॉर्मोन निकलते हैं, जिससे ब्लड प्रेशर बढ़ जाता है।',
              },
              {
                title: 'हार्ट अटैक का खतरा',
                description: 'लगातार ऑक्सीजन की कमी और धमनियों में ब्लॉकेज बढ़ने से दिल का दौरा पड़ने का जोखिम दोगुना हो जाता है।',
              },
              {
                title: 'अनियमित धड़कन (Arrhythmia/Atrial Fibrillation)',
                description: 'ऑक्सीजन असंतुलन के कारण दिल की धड़कन असामान्य हो सकती है, जिसे अलिंद फाइब्रिलेशन कहते हैं।',
              },
              {
                title: 'हार्ट फेलियर',
                description: 'दिल की मांसपेशियों पर लगातार दबाव पड़ने से हृदय विफलता की स्थिति पैदा हो सकती है।',
              },
              {
                title: 'स्ट्रोक',
                description: 'रक्त वाहिकाओं में सूजन और ब्लड क्लॉटिंग की संभावना बढ़ने से स्ट्रोक का खतरा बढ़ जाता है।',
              },
            ],
            illustration: {
              imageUrl: '/images/sleep-areana-images/original_healthcare_awareness_infographic_poster_titled_long_term_health_risks.png',
              altText: {
                en: 'Infographic poster illustrating long-term cardiovascular risks and effects of untreated sleep apnea on the heart',
                hi: 'अनउपचारित स्लीप एप्निया के हृदय पर पड़ने वाले दीर्घकालिक जोखिमों और प्रभावों को दर्शाने वाला इन्फोग्राफिक पोस्टर',
              },
              sourceAttribution: 'Original illustration commissioned for Omkar Healthcare',
            },
          },
          {
            id: 'block-brain-effects',
            slug: 'effects-on-brain-nervous-system',
            title: 'मस्तिष्क और नर्वस सिस्टम पर प्रभाव',
            reversibilityNote: 'सीपीएपी (CPAP) थेरेपी या डॉक्टर द्वारा निर्देशित अन्य उपचार से नर्वस सिस्टम पर पड़ने वाले इस तनाव को कम किया जा सकता है और कुछ नुकसान को आंशिक रूप से ठीक किया जा सकता है — यह आश्वस्त करने वाला एक सकारात्मक नोट है, कोई गारंटी नहीं।',
            items: [
              {
                title: 'सिम्पैथेटिक ओवरड्राइव',
                description: 'सांस रुकने की हर घटना "फाइट या फ्लाइट" प्रतिक्रिया को सक्रिय करती है, जिससे कोर्टिसोल और एड्रेनालाईन जैसे स्ट्रेस हॉर्मोन बढ़ जाते हैं, जिसका असर दिन में भी बना रहता है।',
              },
              {
                title: 'ऑक्सीजन की कमी (हाइपोक्सिया)',
                description: 'बार-बार ऑक्सीजन का स्तर कम होने से मस्तिष्क और तंत्रिका कोशिकाओं (नर्व सेल्स) पर अत्यधिक दबाव पड़ता है।',
              },
              {
                title: 'ब्रेन फॉग और याददाश्त संबंधी समस्याएं',
                description: 'बार-बार नींद टूटने से गहरी नींद (Deep Sleep) और आरईएम (REM) नींद पूरी नहीं हो पाती, जिससे याददाश्त और दिन में एकाग्रता प्रभावित होती है।',
              },
              {
                title: 'व्हाइट मैटर डैमेज',
                description: 'लंबे समय तक गंभीर स्थिति रहने पर क्रॉनिक सूजन मस्तिष्क के व्हाइट मैटर को नुकसान पहुंचा सकती है, जिससे मस्तिष्क के विभिन्न हिस्सों के बीच सिग्नल संचार प्रभावित होता है।',
              },
              {
                title: 'स्ट्रोक का बढ़ता खतरा',
                description: 'पुराना उच्च रक्तचाप और रक्त वाहिकाओं पर तनाव स्ट्रोक के जोखिम को काफी बढ़ा देते हैं।',
              },
              {
                title: 'मूड में बदलाव और अशांति',
                description: 'नर्वस सिस्टम में रासायनिक असंतुलन से चिड़चिड़ापन, घबराहट (चिंता) और अवसाद (डिप्रेशन) का खतरा बढ़ जाता है।',
              },
              {
                title: 'सुबह सिरदर्द',
                description: 'रात में शरीर में कार्बन डाइऑक्साइड (CO2) जमा होने और तंत्रिका तंत्र पर तनाव के कारण सुबह जागने पर सिरदर्द होता है।',
              },
            ],
            illustration: {
              imageUrl: '/images/sleep-areana-images/original_modern_medical_infographic_illustration_showing_the_systemic_impact_of.png',
              altText: {
                en: 'Modern medical anatomical illustration showing the systemic impact of sleep apnea on the brain and nervous system',
                hi: 'मस्तिष्क और तंत्रिका तंत्र पर स्लीप एप्निया के प्रणालीगत प्रभाव को दर्शाने वाला आधुनिक मेडिकल इन्फोग्राफिक चित्र',
              },
              sourceAttribution: 'Original illustration commissioned for Omkar Healthcare',
            },
          },
          {
            id: 'block-metabolic-effects',
            slug: 'effects-on-metabolism-hormones',
            title: 'चयापचय और हार्मोनल असंतुलन',
            reversibilityNote: 'नियमित CPAP थेरेपी से इंसुलिन संवेदनशीलता में आंशिक सुधार और कोर्टिसोल के स्तर में कमी देखी गई है — नियमित उपयोग के 3–6 महीनों के भीतर चयापचय सूचकांकों में मापनीय सुधार होता है।',
            items: [
              {
                title: 'इंसुलिन प्रतिरोध और टाइप 2 मधुमेह का खतरा',
                description: 'बार-बार हाइपोक्सिया और नींद में बाधा ग्लूकोज चयापचय को कमजोर करती है, जिससे मोटापे से स्वतंत्र रूप से इंसुलिन प्रतिरोध काफी बढ़ जाता है।',
              },
              {
                title: 'वजन बढ़ना और लेप्टिन असंतुलन',
                description: 'खराब नींद लेप्टिन और घ्रेलिन के संतुलन को बिगाड़ती है — ये हार्मोन भूख और तृप्ति को नियंत्रित करते हैं — जिससे भूख बढ़ती है और वजन बढ़ता है।',
              },
              {
                title: 'कोर्टिसोल और तनाव हार्मोन का बढ़ना',
                description: 'पुरानी नींद की कमी कोर्टिसोल का स्तर लगातार ऊंचा रखती है, जिससे प्रतिरक्षा प्रणाली कमजोर होती है और कोशिकाओं की उम्र तेजी से बढ़ती है।',
              },
              {
                title: 'टेस्टोस्टेरोन और यौन इच्छा में कमी',
                description: 'गहरी नींद (स्लो-वेव स्लीप) टेस्टोस्टेरोन उत्पादन के लिए जरूरी है; इसके बाधित होने से हार्मोनल स्तर में चिकित्सकीय रूप से महत्वपूर्ण गिरावट आती है।',
              },
              {
                title: 'थायरॉइड कार्यक्षमता पर प्रभाव',
                description: 'बार-बार हाइपोक्सिया की घटनाएं थायरॉइड हार्मोन के स्राव पैटर्न को प्रभावित करती हैं, जिससे थकान और चयापचय में और अधिक मंदी आती है।',
              },
            ],
            illustration: {
              imageUrl: '/images/sleep-areana-images/original_patient_education_infographic_poster_illustrating_understanding.png',
              altText: {
                en: 'Patient education infographic illustrating the metabolic and hormonal effects of sleep apnea including insulin resistance, weight gain, and cortisol disruption',
                hi: 'स्लीप एप्निया के चयापचय और हार्मोनल प्रभावों जैसे इंसुलिन प्रतिरोध, वजन बढ़ना और कोर्टिसोल असंतुलन को दर्शाने वाला रोगी शिक्षा इन्फोग्राफिक',
              },
              sourceAttribution: 'Original illustration commissioned for Omkar Healthcare',
            },
          },
        ],
        caregiverTips: [
          { title: 'मास्क सील की ठीक से जांच करें', detail: 'नाक के कुशन के आसपास हवा लीक न हो; ह्यूमिडिफायर में हमेशा केवल डिस्टिल्ड पानी का ही उपयोग करें।' },
          { title: 'प्रति रात उपयोग के घंटों को ट्रैक करें', detail: 'हृदय और फेफड़ों के स्वस्थ सुधार के लिए प्रति रात कम से कम 4 से 6 घंटे निरंतर उपयोग सुनिश्चित करें।' },
          { title: 'ट्यूब और पानी के चैंबर को हर हफ्ते साफ करें', detail: 'बैक्टीरिया के संक्रमण से बचाव के लिए ट्यूबिंग और वाटर चैंबर को हल्के गर्म साबुन के पानी से अच्छी तरह धोएं।' },
        ],
      },
    },
    hasHindiTranslation: true,
  },
  {
    id: 'cond-copd',
    name: 'COPD & Hypoxemia Recovery',
    slug: 'copd',
    tag: 'copd',
    shortDescription: 'Clinical guidance for managing Chronic Obstructive Pulmonary Disease, emphysema, and long-term home oxygen therapy.',
    heroImage: '/images/oxygen_concentrator.png',
    symptoms: [
      { title: 'Exertional Breathlessness', description: 'Severe dyspnea during routine walking or changing positions at home.' },
      { title: 'Low SpO2 Levels (<90%)', description: 'Frequent oxygen saturation drops requiring prescribed supplementary oxygen flow.' },
      { title: 'Chronic Productive Cough', description: 'Persistent mucus production requiring regular saline nebulization.' },
    ],
    caregiverTips: [
      { title: 'Continuous Flow Monitoring', detail: 'Never increase oxygen flow rate above physician-prescribed liters/min (usually 1-3 LPM in COPD).' },
      { title: 'Keep Backup Cylinders Ready', detail: 'Ensure 1-2 portable oxygen cylinders or UPS power backup for concentrators during outages.' },
      { title: 'Check Pressure Sores behind Ears', detail: 'Inspect caregiver contact points where nasal cannula rests; apply silicone cushions.' },
    ],
    recommendedEquipmentCategories: ['respiratory-care'],
    contentBlocks: [
      {
        id: 'block-copd-pulmonary',
        slug: 'pulmonary-mechanics-alveolar-destruction',
        title: 'Pulmonary Mechanics & Alveolar Air Trapping',
        reversibilityNote: 'With calibrated low-flow oxygen and physician-prescribed bronchodilator nebulization, dynamic air trapping can be moderated, stabilizing functional daily capacity.',
        items: [
          {
            title: 'Loss of Alveolar Elastic Recoil',
            description: 'Damaged alveolar walls collapse prematurely during exhalation, trapping stale carbon dioxide-rich air inside the lower lung chambers.',
          },
          {
            title: 'Ventilation-Perfusion (V/Q) Mismatch',
            description: 'Non-uniform airflow across scarred lung zones causes severe systemic hypoxemia, dropping resting blood oxygen below 88% without supplemental flow.',
          },
          {
            title: 'Diaphragmatic Flattening',
            description: 'Chronic hyperinflation pushes the primary respiratory muscle into an inefficient flat configuration, tripling the muscular work required to breathe.',
          },
          {
            title: 'Dynamic Breath Stacking',
            description: 'Even minor exertion shortens exhalation time, compounding trapped volume and triggering sudden respiratory distress or panic.',
          },
        ],
      },
      {
        id: 'block-copd-cor-pulmonale',
        slug: 'cor-pulmonale-cardiovascular-strain',
        title: 'Cor Pulmonale & Right Ventricular Strain',
        reversibilityNote: 'Adhering to ≥15 hours/day of physician-prescribed home oxygen therapy significantly relieves pulmonary arterial hypertension, halting right-heart decompensation.',
        items: [
          {
            title: 'Hypoxic Pulmonary Vasoconstriction',
            description: 'Chronically low alveolar oxygen signals pulmonary arterioles to constrict, dangerously elevating pulmonary vascular resistance.',
          },
          {
            title: 'Right Ventricular Hypertrophy',
            description: 'The right side of the heart is forced to pump against elevated pulmonary pressure, causing progressive muscular enlargement and eventual dilation.',
          },
          {
            title: 'Peripheral Edema & Jugular Distension',
            description: 'Back-pressure from failing right-heart chambers causes fluid retention and swelling across the feet, ankles, and neck veins.',
          },
          {
            title: 'Secondary Polycythemia Risk',
            description: 'The body attempts to compensate for chronic hypoxia by overproducing red blood cells, which thickens blood viscosity and increases thrombosis risk.',
          },
        ],
      },
    ],
    translations: {
      en: {
        locale: 'en',
        name: 'COPD & Hypoxemia Recovery',
        shortDescription: 'Clinical guidance for managing Chronic Obstructive Pulmonary Disease, emphysema, and long-term home oxygen therapy.',
        symptoms: [
          { title: 'Exertional Breathlessness', description: 'Severe dyspnea during routine walking or changing positions at home.' },
          { title: 'Low SpO2 Levels (<90%)', description: 'Frequent oxygen saturation drops requiring prescribed supplementary oxygen flow.' },
          { title: 'Chronic Productive Cough', description: 'Persistent mucus production requiring regular saline nebulization.' },
        ],
        caregiverTips: [
          { title: 'Continuous Flow Monitoring', detail: 'Never increase oxygen flow rate above physician-prescribed liters/min (usually 1-3 LPM in COPD).' },
          { title: 'Keep Backup Cylinders Ready', detail: 'Ensure 1-2 portable oxygen cylinders or UPS power backup for concentrators during outages.' },
          { title: 'Check Pressure Sores behind Ears', detail: 'Inspect caregiver contact points where nasal cannula rests; apply silicone cushions.' },
        ],
        contentBlocks: [
          {
            id: 'block-copd-pulmonary',
            slug: 'pulmonary-mechanics-alveolar-destruction',
            title: 'Pulmonary Mechanics & Alveolar Air Trapping',
            reversibilityNote: 'With calibrated low-flow oxygen and physician-prescribed bronchodilator nebulization, dynamic air trapping can be moderated, stabilizing functional daily capacity.',
            items: [
              {
                title: 'Loss of Alveolar Elastic Recoil',
                description: 'Damaged alveolar walls collapse prematurely during exhalation, trapping stale carbon dioxide-rich air inside the lower lung chambers.',
              },
              {
                title: 'Ventilation-Perfusion (V/Q) Mismatch',
                description: 'Non-uniform airflow across scarred lung zones causes severe systemic hypoxemia, dropping resting blood oxygen below 88% without supplemental flow.',
              },
              {
                title: 'Diaphragmatic Flattening',
                description: 'Chronic hyperinflation pushes the primary respiratory muscle into an inefficient flat configuration, tripling the muscular work required to breathe.',
              },
              {
                title: 'Dynamic Breath Stacking',
                description: 'Even minor exertion shortens exhalation time, compounding trapped volume and triggering sudden respiratory distress or panic.',
              },
            ],
          },
          {
            id: 'block-copd-cor-pulmonale',
            slug: 'cor-pulmonale-cardiovascular-strain',
            title: 'Cor Pulmonale & Right Ventricular Strain',
            reversibilityNote: 'Adhering to ≥15 hours/day of physician-prescribed home oxygen therapy significantly relieves pulmonary arterial hypertension, halting right-heart decompensation.',
            items: [
              {
                title: 'Hypoxic Pulmonary Vasoconstriction',
                description: 'Chronically low alveolar oxygen signals pulmonary arterioles to constrict, dangerously elevating pulmonary vascular resistance.',
              },
              {
                title: 'Right Ventricular Hypertrophy',
                description: 'The right side of the heart is forced to pump against elevated pulmonary pressure, causing progressive muscular enlargement and eventual dilation.',
              },
              {
                title: 'Peripheral Edema & Jugular Distension',
                description: 'Back-pressure from failing right-heart chambers causes fluid retention and swelling across the feet, ankles, and neck veins.',
              },
              {
                title: 'Secondary Polycythemia Risk',
                description: 'The body attempts to compensate for chronic hypoxia by overproducing red blood cells, which thickens blood viscosity and increases thrombosis risk.',
              },
            ],
          },
        ],
      },
      hi: {
        locale: 'hi',
        name: 'सीओपीडी (COPD) और हाइपोक्सिमिया केयर',
        shortDescription: 'क्रॉनिक ऑब्सट्रक्टिव पल्मोनरी डिजीज (COPD), एम्फाइमा और दीर्घकालिक होम ऑक्सीजन थेरेपी के प्रबंधन हेतु नैदानिक दिशा-निर्देश।',
        symptoms: [
          { title: 'हल्की गतिविधि में भी सांस फूलना', description: 'घर पर सामान्य चलने-फिरने या करवट बदलने पर भी गंभीर सांस लेने में कठिनाई।' },
          { title: 'रक्त में कम ऑक्सीजन स्तर (SpO2 < 90%)', description: 'ऑक्सीजन सेचुरेशन में बार-बार गिरावट, जिसके लिए डॉक्टर द्वारा निर्धारित ऑक्सीजन फ्लो आवश्यक है।' },
          { title: 'पुरानी खांसी और बलगम', description: 'लगातार कफ बनना जिसके लिए नियमित सेलाइन नेबुलाइजेशन की आवश्यकता होती है।' },
        ],
        caregiverTips: [
          { title: 'ऑक्सीजन फ्लो की निरंतर निगरानी', detail: 'डॉक्टर द्वारा निर्धारित लीटर/मिनट (COPD में आमतौर पर 1-3 LPM) से अधिक फ्लो कभी न बढ़ाएं।' },
          { title: 'बैकअप सिलेंडर हमेशा तैयार रखें', detail: 'बिजली जाने की स्थिति में 1-2 पोर्टेबल ऑक्सीजन सिलेंडर या इन्वर्टर बैकअप तैयार रखें।' },
          { title: 'कान के पीछे दबाव के घावों की जांच करें', detail: 'जहां नेजल कैनुला टिकती है वहां की त्वचा का निरीक्षण करें; राहत के लिए सिलिकॉन कुशन पैड लगाएं।' },
        ],
        contentBlocks: [
          {
            id: 'block-copd-pulmonary',
            slug: 'pulmonary-mechanics-alveolar-destruction',
            title: 'फेफड़ों की कार्यप्रणाली और एल्वियोली में हवा का रुकना',
            reversibilityNote: 'सटीक कम-फ्लो वाली ऑक्सीजन और डॉक्टर द्वारा निर्धारित नेबुलाइजेशन से फेफड़ों में हवा फंसने की समस्या को नियंत्रित किया जा सकता है।',
            items: [
              {
                title: 'एल्वियोली का लचीलापन समाप्त होना',
                description: 'सांस छोड़ते समय वायुमार्ग समय से पहले बंद हो जाते हैं, जिससे फेफड़ों में कार्बन डाइऑक्साइड युक्त हवा फंस जाती है।',
              },
              {
                title: 'वेंटिलेशन-परफ्यूजन असंतुलन',
                description: 'फेफड़ों के क्षतिग्रस्त हिस्सों में असमान वायु प्रवाह के कारण रक्त में ऑक्सीजन का स्तर 88% से नीचे गिर जाता है।',
              },
              {
                title: 'डायाफ्राम का चपटा होना',
                description: 'फेफड़ों में हवा भरने से डायाफ्राम नीचे दब जाता है, जिससे सांस लेने के लिए मांसपेशियों को तीन गुना अधिक मेहनत करनी पड़ती है।',
              },
              {
                title: 'परिश्रम के समय सांस का अटकना',
                description: 'थोड़ा चलने पर भी सांस छोड़ने का समय कम हो जाता है, जिससे मरीज घबराहट और गंभीर सांस फूलने का शिकार होता है।',
              },
            ],
          },
          {
            id: 'block-copd-cor-pulmonale',
            slug: 'cor-pulmonale-cardiovascular-strain',
            title: 'कोर पल्मोनेल और हृदय के दाहिने हिस्से पर दबाव',
            reversibilityNote: 'डॉक्टर द्वारा निर्धारित प्रतिदिन ≥15 घंटे होम ऑक्सीजन थेरेपी लेने से फेफड़ों की धमनियों पर दबाव कम होता है और हार्ट फेलियर का जोखिम टलता है।',
            items: [
              {
                title: 'हाइपोक्सिक पल्मोनरी वाहिका संकुचन',
                description: 'ऑक्सीजन की कमी के कारण फेफड़ों की रक्त नलिकाएं सिकुड़ जाती हैं, जिससे पल्मोनरी आर्टरी का दबाव खतरनाक रूप से बढ़ जाता है।',
              },
              {
                title: 'दाहिने वेंट्रिकल का बढ़ना (कोर पल्मोनेल)',
                description: 'हृदय के दाहिने हिस्से को अधिक दबाव के विरुद्ध रक्त पंप करना पड़ता है, जिससे उसकी मांसपेशियां असामान्य रूप से बढ़ जाती हैं।',
              },
              {
                title: 'पैरों में सूजन और गर्दन की नसें फूलना',
                description: 'हृदय पर दबाव बढ़ने के कारण पैरों, टखनों और गर्दन की नसों में तरल पदार्थ जमा होने लगता है।',
              },
              {
                title: 'रक्त गाढ़ा होने का जोखिम (पॉलीसिथेमिया)',
                description: 'ऑक्सीजन की कमी से शरीर अधिक लाल रक्त कोशिकाएं बनाने लगता है, जिससे खून गाढ़ा होकर थक्के बनने का खतरा बढ़ता है।',
              },
            ],
          },
        ],
      },
    },
    hasHindiTranslation: true,
  },
  {
    id: 'cond-post-icu',
    name: 'Post-ICU & Step-Down Home Care',
    slug: 'post-icu',
    tag: 'post-icu',
    shortDescription: 'Comprehensive protocols for transitioning critical care patients from hospital ICU to home clinical setup.',
    heroImage: '/images/caregiver.png',
    symptoms: [
      { title: 'Muscle Atrophy & Generalized Weakness', description: 'Severe respiratory muscle fatigue and immobility requiring structured rehabilitation.' },
      { title: 'Tracheostomy or Airway Clearance', description: 'Copious secretions needing scheduled suctioning and humidification.' },
      { title: 'Vital Sign Fluctuations', description: 'Frequent blood pressure, heart rate, and oxygen saturation shifts.' },
    ],
    caregiverTips: [
      { title: 'Systematic 2-Hour Repositioning', detail: 'Rotate patient lateral positions every 2 hours to maintain circulation and comfort.' },
      { title: 'Elevate Upper Body (30°–45°)', detail: 'Maintain backrest elevation to prevent pulmonary aspiration pneumonia during enteral feeds.' },
      { title: 'Disinfect Suction Canisters Daily', detail: 'Sterilize collection jars and replace suction catheters using aseptic no-touch technique.' },
    ],
    recommendedEquipmentCategories: ['respiratory-care', 'patient-monitoring'],
    contentBlocks: [
      {
        id: 'block-icu-respiratory',
        slug: 'respiratory-rehab-oxygen-titration',
        title: 'Respiratory Rehabilitation & Continuous Oxygen Titration',
        reversibilityNote: 'Structured daily oxygen weaning protocols alongside low-resistance incentive spirometry help 80% of step-down patients safely regain functional lung volumes.',
        items: [
          {
            title: 'Ventilator Deconditioning & Diaphragmatic Weakness',
            description: 'Prolonged mechanical ventilation weakens diaphragmatic musculature, necessitating calibrated non-invasive ventilation (BiPAP) or high-flow oxygen support.',
          },
          {
            title: 'Microvascular Perfusion & Hypoxemia',
            description: 'Post-critical illness hypoxemia damages peripheral capillary beds; continuous pulse oximetry and titrated oxygen delivery maintain vital organ perfusion.',
          },
          {
            title: 'Secretory Stasis & Pulmonary Atelectasis',
            description: 'Reduced tidal volume leads to dependent alveolar collapse; regular repositioning and airway suctioning prevent recurrent nosocomial infections.',
          },
          {
            title: 'Monitoring Work of Breathing',
            description: 'Tachypnea (>25 breaths/min) or intercostal retractions indicate respiratory fatigue requiring immediate physician review and flow adjustments.',
          },
        ],
      },
      {
        id: 'block-icu-airway',
        slug: 'airway-clearance-aspiration-prevention',
        title: 'Airway Clearance & Silent Aspiration Prevention',
        reversibilityNote: 'With semi-upright 45° Fowler’s positioning during enteral feeds and routine subglottic suctioning, post-ICU aspiration pneumonia incidence is reduced by up to 85%.',
        items: [
          {
            title: 'Laryngeal Sensory Blunting Post-Extubation',
            description: 'Prolonged endotracheal intubation numbs vocal cord touch receptors, permitting saliva and liquid nutrition to enter the trachea without triggering a cough reflex.',
          },
          {
            title: 'Micro-Aspiration Chemical Pneumonitis',
            description: 'Silent bacterial colonization from saliva entering the dependent lung lobes initiates acute nosocomial chemical pneumonia within 24 to 48 hours.',
          },
          {
            title: 'Recumbent Atelectasis',
            description: 'Continuous flat recumbent positioning causes abdominal organs to press against the diaphragm, collapsing the lower lung alveoli and creating stagnant mucus traps.',
          },
          {
            title: 'Secretory Plugging & Tracheostomy Hygiene',
            description: 'Thickened tracheobronchial mucus blocks artificial airways; requires continuous heated ultrasonic humidification and sterile catheter suctioning.',
          },
        ],
      },
    ],
    translations: {
      en: {
        locale: 'en',
        name: 'Post-ICU & Step-Down Home Care',
        shortDescription: 'Comprehensive protocols for transitioning critical care patients from hospital ICU to home clinical setup.',
        symptoms: [
          { title: 'Muscle Atrophy & Generalized Weakness', description: 'Severe respiratory muscle fatigue and immobility requiring structured rehabilitation.' },
          { title: 'Tracheostomy or Airway Clearance', description: 'Copious secretions needing scheduled suctioning and humidification.' },
          { title: 'Vital Sign Fluctuations', description: 'Frequent blood pressure, heart rate, and oxygen saturation shifts.' },
        ],
        caregiverTips: [
          { title: 'Systematic 2-Hour Repositioning', detail: 'Rotate patient lateral positions every 2 hours to maintain circulation and comfort.' },
          { title: 'Elevate Upper Body (30°–45°)', detail: 'Maintain backrest elevation to prevent pulmonary aspiration during enteral feeds.' },
          { title: 'Disinfect Suction Canisters Daily', detail: 'Sterilize collection jars and replace suction catheters using aseptic no-touch technique.' },
        ],
        contentBlocks: [
          {
            id: 'block-icu-respiratory',
            slug: 'respiratory-rehab-oxygen-titration',
            title: 'Respiratory Rehabilitation & Continuous Oxygen Titration',
            reversibilityNote: 'Structured daily oxygen weaning protocols alongside low-resistance incentive spirometry help 80% of step-down patients safely regain functional lung volumes.',
            items: [
              {
                title: 'Ventilator Deconditioning & Diaphragmatic Weakness',
                description: 'Prolonged mechanical ventilation weakens diaphragmatic musculature, necessitating calibrated non-invasive ventilation (BiPAP) or high-flow oxygen support.',
              },
              {
                title: 'Microvascular Perfusion & Hypoxemia',
                description: 'Post-critical illness hypoxemia damages peripheral capillary beds; continuous pulse oximetry and titrated oxygen delivery maintain vital organ perfusion.',
              },
              {
                title: 'Secretory Stasis & Pulmonary Atelectasis',
                description: 'Reduced tidal volume leads to dependent alveolar collapse; regular repositioning and airway suctioning prevent recurrent nosocomial infections.',
              },
              {
                title: 'Monitoring Work of Breathing',
                description: 'Tachypnea (>25 breaths/min) or intercostal retractions indicate respiratory fatigue requiring immediate physician review and flow adjustments.',
              },
            ],
          },
          {
            id: 'block-icu-airway',
            slug: 'airway-clearance-aspiration-prevention',
            title: 'Airway Clearance & Silent Aspiration Prevention',
            reversibilityNote: 'With semi-upright 45° Fowler’s positioning during enteral feeds and routine subglottic suctioning, post-ICU aspiration pneumonia incidence is reduced by up to 85%.',
            items: [
              {
                title: 'Laryngeal Sensory Blunting Post-Extubation',
                description: 'Prolonged endotracheal intubation numbs vocal cord touch receptors, permitting saliva and liquid nutrition to enter the trachea without triggering a cough reflex.',
              },
              {
                title: 'Micro-Aspiration Chemical Pneumonitis',
                description: 'Silent bacterial colonization from saliva entering the dependent lung lobes initiates acute nosocomial chemical pneumonia within 24 to 48 hours.',
              },
              {
                title: 'Recumbent Atelectasis',
                description: 'Continuous flat recumbent positioning causes abdominal organs to press against the diaphragm, collapsing the lower lung alveoli and creating stagnant mucus traps.',
              },
              {
                title: 'Secretory Plugging & Tracheostomy Hygiene',
                description: 'Thickened tracheobronchial mucus blocks artificial airways; requires continuous heated ultrasonic humidification and sterile catheter suctioning.',
              },
            ],
          },
        ],
      },
      hi: {
        locale: 'hi',
        name: 'पोस्ट-आईसीयू और स्टेप-डाउन होम केयर',
        shortDescription: 'क्रिटिकल केयर मरीजों को अस्पताल के आईसीयू से सुरक्षित घरेलू नैदानिक सेटअप में स्थानांतरित करने के संपूर्ण प्रोटोकॉल।',
        symptoms: [
          { title: 'मांसपेशियों की कमजोरी और थकान', description: 'सांस लेने में अत्यधिक थकान और कमजोरी जिसके लिए संरचित पुनर्वास और श्वसन निगरानी की आवश्यकता होती है।' },
          { title: 'ट्रेकियोस्टॉमी या एयरवे क्लीयरेंस', description: 'श्वसन नली में कफ जमा होना जिसके लिए निर्धारित अंतराल पर सक्शनिंग और ह्यूमिडिफिकेशन की आवश्यकता होती है।' },
          { title: 'वाइटल संकेतों में उतार-चढ़ाव', description: 'ब्लड प्रेशर, पल्स रेट और ऑक्सीजन सेचुरेशन में बार-बार होने वाले बदलाव।' },
        ],
        caregiverTips: [
          { title: 'हर 2 घंटे में मरीज की स्थिति बदलें', detail: 'मरीज की करवट हर 2 घंटे में बदलें ताकि रक्त संचार और आराम बना रहे।' },
          { title: 'ऊपरी शरीर को 30° से 45° ऊपर रखें', detail: 'भोजन और दवाओं के समय फेफड़ों में खाना जाने (एस्पिरेशन) से बचाव के लिए मरीज को अर्ध-बैठी स्थिति में रखें।' },
          { title: 'सक्शन जार को रोजाना स्टेरलाइज करें', detail: 'कलेक्शन जार को रोज साफ करें और संक्रमण से बचाव के लिए एसेप्टिक नो-टच तकनीक का उपयोग करें।' },
        ],
        contentBlocks: [
          {
            id: 'block-icu-respiratory',
            slug: 'respiratory-rehab-oxygen-titration',
            title: 'श्वसन पुनर्वास और निरंतर ऑक्सीजन नियंत्रण',
            reversibilityNote: 'संरचित दैनिक ऑक्सीजन वीनिंग प्रोटोकॉल और स्पाइरोमेट्री के उपयोग से 80% मरीज फेफड़ों की कार्यक्षमता सुरक्षित रूप से पुनः प्राप्त कर लेते हैं।',
            items: [
              {
                title: 'वेंटिलेटर के बाद डायाफ्राम की कमजोरी',
                description: 'लंबे समय तक आईसीयू वेंटिलेटर पर रहने से श्वसन मांसपेशियां कमजोर हो जाती हैं, जिसके लिए बाईपैप (BiPAP) या कंसंट्रेटर से निरंतर ऑक्सीजन सहायता जरूरी होती है।',
              },
              {
                title: 'हाइपोक्सिमिया और सूक्ष्म रक्त संचार',
                description: 'ऑक्सीजन की कमी से अंगों को नुकसान पहुंच सकता है; निरंतर पल्स ऑक्सीमीटर निगरानी और सही ऑक्सीजन फ्लो महत्वपूर्ण अंगों की सुरक्षा करता है।',
              },
              {
                title: 'कफ का जमाव और फेफड़ों का सिकुड़ना',
                description: 'कम सांस लेने से फेफड़े के निचले हिस्से सिकुड़ सकते हैं; समय पर स्थिति बदलना और सक्शन मशीन से कफ निकालना संक्रमण से बचाता है।',
              },
              {
                title: 'सांस लेने की गति पर निगरानी',
                description: 'प्रति मिनट 25 से अधिक सांसें लेना या सांस लेने में जोर लगना फेफड़ों की थकान का संकेत है, जिस पर तुरंत डॉक्टर से परामर्श लेना चाहिए।',
              },
            ],
          },
          {
            id: 'block-icu-airway',
            slug: 'airway-clearance-aspiration-prevention',
            title: 'श्वसन नली की सफाई और भोजन फेफड़ों में जाने से बचाव',
            reversibilityNote: 'ट्यूब से भोजन देते समय मरीज को 45° कोण पर रखने और नियमित सक्शनिंग से निमोनिया का खतरा 85% तक कम हो जाता है।',
            items: [
              {
                title: 'गले की संवेदनशीलता में कमी (साइलेंट एस्पिरेशन)',
                description: 'लंबे समय तक वेंटिलेटर ट्यूब लगे रहने से वोकल कॉर्ड सुन्न हो जाते हैं, जिससे लार या तरल भोजन बिना खांसी आए फेफड़ों में चला जाता है।',
              },
              {
                title: 'एस्पिरेशन निमोनिया का संक्रमण',
                description: 'फेफड़ों में लार या भोजन चले जाने से 24 से 48 घंटे के भीतर गंभीर बैक्टीरियल निमोनिया हो सकता है।',
              },
              {
                title: 'लगातार लेटे रहने से फेफड़े सिकुड़ना (एटेलेक्टेसिस)',
                description: 'सीधे लेटे रहने से पेट के अंग फेफड़ों पर दबाव डालते हैं, जिससे फेफड़ों के निचले हिस्से सिकुड़कर कफ के जाल बन जाते हैं।',
              },
              {
                title: 'ट्रेकियोस्टॉमी ट्यूब में बलगम का जमना',
                description: 'गाढ़ा बलगम सांस की नली को अवरुद्ध कर सकता है; इसके लिए गर्म ह्यूमिडिफिकेशन और नियमित सक्शनिंग आवश्यक है।',
              },
            ],
          },
        ],
      },
    },
    hasHindiTranslation: true,
  },
  {
    id: 'cond-stroke-rehab',
    name: 'Stroke Rehabilitation & Hemiplegia',
    slug: 'stroke-rehab',
    tag: 'stroke-rehab',
    shortDescription: 'Empowering caregivers with ergonomic equipment and rehabilitation aids for neuro-recovery and mobility restoration.',
    heroImage: '/images/caregiver.png',
    symptoms: [
      { title: 'Unilateral Muscle Weakness', description: 'Hemiparesis affecting safe seated transfers, posture, and balance.' },
      { title: 'Difficulty Swallowing (Dysphagia)', description: 'Risk of aspiration requiring specialized upright seated positioning.' },
      { title: 'Dependent Mobility', description: 'Requires wheelchair or assisted gait support for all activities of daily living.' },
    ],
    caregiverTips: [
      { title: 'Use Transfer Belts Safely', detail: 'Never pull the patient by weak arm or shoulder; secure gait belt firmly around waist.' },
      { title: 'Lock Wheelchair Brakes Every Time', detail: 'Engage both caster brakes before initiating any sit-to-stand movement.' },
      { title: 'Encourage Affected Side Engagement', detail: 'Position nightstand and caregiver interaction on the patient’s hemiplegic side.' },
    ],
    recommendedEquipmentCategories: ['mobility-ortho', 'respiratory-care'],
    translations: {
      en: {
        locale: 'en',
        name: 'Stroke Rehabilitation & Hemiplegia',
        shortDescription: 'Empowering caregivers with ergonomic equipment and rehabilitation aids for neuro-recovery and mobility restoration.',
        symptoms: [
          { title: 'Unilateral Muscle Weakness', description: 'Hemiparesis affecting safe seated transfers, posture, and balance.' },
          { title: 'Difficulty Swallowing (Dysphagia)', description: 'Risk of aspiration requiring specialized upright seated positioning.' },
          { title: 'Dependent Mobility', description: 'Requires wheelchair or assisted gait support for all activities of daily living.' },
        ],
        caregiverTips: [
          { title: 'Use Transfer Belts Safely', detail: 'Never pull the patient by weak arm or shoulder; secure gait belt firmly around waist.' },
          { title: 'Lock Wheelchair Brakes Every Time', detail: 'Engage both caster brakes before initiating any sit-to-stand movement.' },
          { title: 'Encourage Affected Side Engagement', detail: 'Position nightstand and caregiver interaction on the patient’s hemiplegic side.' },
        ],
      },
      hi: {
        locale: 'hi',
        name: 'स्ट्रोक पुनर्वास और हेमिप्लेजिया (लकवा)',
        shortDescription: 'न्यूरोलॉजिकल रिकवरी और शारीरिक गतिशीलता की बहाली हेतु एर्गोनॉमिक उपकरण और केयरगिवर गाइड।',
        symptoms: [
          { title: 'शरीर के एक तरफ मांसपेशियों की कमजोरी', description: 'एक तरफ लकवा (हेमिपेरेसिस) जिसके कारण सुरक्षित बैठने और स्थानांतरण में संतुलन की समस्या होती है।' },
          { title: 'निगलने में कठिनाई (डिस्फेगिया)', description: 'खाना या पानी फेफड़ों में जाने का खतरा, जिसके लिए विशेष रूप से सीधे बैठकर खिलाना अनिवार्य है।' },
          { title: 'दैनिक कार्यों के लिए निर्भरता', description: 'दैनिक क्रियाकलापों के लिए व्हीलचेयर या वॉकर सहायता की अनिवार्य आवश्यकता।' },
        ],
        caregiverTips: [
          { title: 'ट्रांसफर बेल्ट का सुरक्षित उपयोग', detail: 'मरीज को कमजोर हाथ या कंधे से कभी न खींचें; कमर पर ट्रांसफर/गेट बेल्ट मजबूती से बांधकर सहारा दें।' },
          { title: 'हर बार व्हीलचेयर के ब्रेक लॉक करें', detail: 'मरीज को बैठाने या उठाने से पहले दोनों पहियों के ब्रेक पूरी तरह लॉक करें।' },
          { title: 'कमजोर हिस्से की ओर से बातचीत को बढ़ावा दें', detail: 'मरीज की मेज और बातचीत प्रभावित हिस्से की ओर रखें ताकि न्यूरो-रिकवरी को सक्रिय प्रोत्साहन मिले।' },
        ],
      },
    },
    hasHindiTranslation: true,
  },
];;

export const SLEEP_APNEA_LEARN_DATA: Condition = STATIC_LEARN_CONDITIONS.find(
  (c) => c.slug === "sleep-apnea"
)!;

export function getStaticConditionBySlug(slug: string): Condition | undefined {
  return STATIC_LEARN_CONDITIONS.find(
    (c) => c.slug === slug || c.tag === slug
  );
}
