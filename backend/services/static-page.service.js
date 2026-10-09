'use strict';

const { staticPageRepository } = require('../repository');

const DEFAULT_POLICIES = {
  terms: {
    slug: 'terms',
    en: {
      title: 'Terms & Conditions of Healthcare Service',
      body: `## 1. Introduction & Acceptance
Welcome to Omkar Healthcare. By using our platform, mobile site, or clinical fulfillment services, you agree to comply with and be bound by these Terms & Conditions. All critical care devices provided (CPAP, BiPAP, Oxygen Concentrators, Suction Units, Wheelchairs) are regulated biomedical equipment governed by CDSCO standards.

## 2. Equipment Quality & Clinical Verification
Every item dispatched for rental or sale undergoes a verified 10-step sterilization and clinical calibration protocol performed by certified biomedical engineers prior to doorstep delivery. Equipment rented or purchased must be operated in accordance with the user manual and physician prescription where applicable.

## 3. Account & Responsibilities
Users must provide accurate patient and caregiver contact details, delivery address, and emergency contact information. Customers agree to exercise reasonable care with all rented equipment and notify Omkar Healthcare immediately in the event of device malfunction.

## 4. Limitation of Medical Liability
Omkar Healthcare provides verified medical equipment and doorstep setup assistance. Our technicians and staff do not dispense primary medical advice or prescribe therapy. Always consult your attending pulmonologist or physician regarding clinical treatment decisions.

## 5. Contact & Grievance Redressal
For grievances or clinical inquiries, contact our 24/7 Helpline at 1800-889-2273 or email clinical-support@omkarhealthcare.com.`,
    },
    hi: {
      title: 'नियम एवं शर्तें (Healthcare Terms & Conditions)',
      body: `## 1. सेवा की शर्तें
ओमकार हेल्थकेयर में आपका स्वागत है। हमारे प्लेटफॉर्म का उपयोग करके आप इन नियमों और शर्तों का पालन करने के लिए सहमत होते हैं। हमारे द्वारा उपलब्ध कराए जाने वाले सभी क्रिटिकल केयर उपकरण (सीपैप, बाईपैप, ऑक्सीजन कंसंट्रेटर, सक्शन मशीनें) सीडीएससीओ मानकों के अनुरूप हैं।

## 2. गुणवत्ता एवं 10-चरणीय सैनिटाइजेशन
रेंटल या खरीद के लिए भेजा जाने वाला प्रत्येक उपकरण डिलीवरी से पहले प्रमाणित बायोमेडिकल इंजीनियरों द्वारा 10-चरणीय स्टेरलाइजेशन से गुजरता है।

## 3. सहायता एवं संपर्क
किसी भी सहायता के लिए हमारी 24/7 हेल्पलाइन 1800-889-2273 पर संपर्क करें।`,
    },
  },
  privacy: {
    slug: 'privacy',
    en: {
      title: 'Privacy Policy & Patient Health Data Protection',
      body: `## 1. Information We Collect
We collect necessary personal and delivery information including customer name, phone number, physical address, and device usage duration to ensure proper biomedical delivery and recovery tracking.

## 2. Protection of Health Data
We adhere to stringent data privacy guidelines (including DISHA principles). Patient health records, therapy duration requests, and delivery details are encrypted in transit and at rest. We never sell patient or caregiver personal data to third-party marketers.

## 3. Payment Security
All transactions and refundable security deposits are processed via RBI-compliant payment gateways with PCI-DSS Level 1 encryption. No card details or UPI PINs are stored on our servers.

## 4. Data Access & Rights
You have the right to request deletion or modification of your stored profile information and delivery addresses at any time by contacting privacy@omkarhealthcare.com.`,
    },
    hi: {
      title: 'गोपनीयता नीति (Privacy Policy)',
      body: `## 1. व्यक्तिगत जानकारी की सुरक्षा
हम आपकी व्यक्तिगत जानकारी और स्वास्थ्य डेटा की कड़ी सुरक्षा करते हैं। हम मरीज या देखभालकर्ता का डेटा किसी तीसरे पक्ष को नहीं बेचते हैं।

## 2. सुरक्षित भुगतान
सभी भुगतान आरबीआई-अनुमोदित एन्क्रिप्शन के माध्यम से सुरक्षित किए जाते हैं।`,
    },
  },
  'rental-policy': {
    slug: 'rental-policy',
    en: {
      title: 'Medical Equipment Rental Agreement & Escrow Policy',
      body: `## 1. Flexible Rental Periods
Omkar Healthcare offers transparent rental plans for 7 days, 15 days, 30 days, or customized recovery durations (up to 180 days). Progressive tiered discounts automatically apply for extended home recovery.

## 2. Escrow-Protected Refundable Security Deposit
- A refundable security deposit is collected upon order placement to safeguard medical hardware.
- Security deposits are held in a ring-fenced escrow account and are 100% refundable.
- Upon completion of recovery, request equipment pickup from My Account. A biomedical technician inspects the device at your doorstep.
- The full deposit is processed back to your original source of payment within 24 hours of return pickup.

## 3. Sanitization & Calibration Guarantee
All rental units undergo rigorous 10-step autoclave and UV-C sterilization with pressure calibration tests before being delivered in sealed protective packaging.

## 4. Extension & Early Return
Rentals can be extended seamlessly online from the Active Rentals dashboard before the rental period expires. In case of early recovery, pro-rated daily calculations apply according to tier terms.`,
    },
    hi: {
      title: 'रेंटल नीति एवं एस्क्रो सुरक्षा जमा गारंटी',
      body: `## 1. लचीली रेंटल अवधि
ओमकार हेल्थकेयर 7 दिन, 15 दिन, 30 दिन या कस्टम दिनों के लिए रेंटल योजनाएं प्रदान करता है।

## 2. 100% सुरक्षा जमा रिफंड गारंटी
उपकरण वापसी और तकनीशियन निरीक्षण के 24 घंटे के भीतर आपकी संपूर्ण सुरक्षा जमा राशि आपके खाते में वापस कर दी जाती है।

## 3. 10-चरणीय सैनिटाइजेशन
प्रत्येक रेंटल यूनिट अस्पताल-ग्रेड यूवी-सी व ऑटोक्लेव सैनिटाइजेशन के साथ सीलबंद पैक में डिलीवर की जाती है।`,
    },
  },
  'refund-policy': {
    slug: 'refund-policy',
    en: {
      title: 'Cancellation, Return & Refund Policy',
      body: `## 1. 24-Hour Deposit Refund SLA
For rental equipment, 100% of the security deposit is initiated for refund within 24 hours after the return pickup and serial-number inspection is conducted by our field technician.

## 2. Order Cancellation Prior to Dispatch
- Cancellation before equipment dispatch from our city hub: 100% immediate full refund with zero cancellation charges.
- Cancellation after technician dispatch or during transit: nominal transit fee may be deducted; remaining balance refunded in full.

## 3. Dead on Arrival (DOA) / Device Replacement
If any device arrives with functional variance or pressure irregularity, Omkar Healthcare guarantees immediate free replacement within 4 hours in metro coverage areas.

## 4. Purchase Equipment Returns
Brand new purchased items in sealed, unopened packaging can be returned within 7 calendar days of delivery for a full refund or replacement. Due to clinical hygiene regulations, opened medical consumable products (masks, tubing, filters) cannot be returned once unsealed unless defective.`,
    },
    hi: {
      title: 'रद्दकरण एवं धनवापसी नीति (Refund & Cancellation Policy)',
      body: `## 1. 24 घंटे में रिफंड की गारंटी
रेंटल उपकरणों की सुरक्षा जमा राशि उपकरण पिकअप के 24 घंटे के भीतर वापस कर दी जाती है।

## 2. प्रेषण पूर्व रद्दीकरण
उपकरण भेजे जाने से पहले रद्द करने पर शून्य शुल्क के साथ 100% पूर्ण धनवापसी दी जाती है।

## 3. 4 घंटे में त्वरित प्रतिस्थापन
किसी भी तकनीकी खराबी की स्थिति में मेट्रो शहरों में 4 घंटे के भीतर तत्काल उपकरण बदला जाता है।`,
    },
  },
};

class StaticPageService {
  async getAllPages() {
    let pages = await staticPageRepository.findAllActive();
    if (!pages || pages.length === 0) {
      // Seed initial default policies into DB
      for (const policyKey of Object.keys(DEFAULT_POLICIES)) {
        await this.ensurePageExists(policyKey);
      }
      pages = await staticPageRepository.findAllActive();
    }
    return pages;
  }

  async ensurePageExists(slug) {
    let page = await staticPageRepository.findBySlugWithTranslations(slug);
    if (!page && DEFAULT_POLICIES[slug]) {
      const def = DEFAULT_POLICIES[slug];
      page = await StaticPage.create({
        slug: def.slug,
        is_active: true,
      });

      if (def.en) {
        await StaticPageTranslation.create({
          static_page_id: page.id,
          locale: 'en',
          title: def.en.title,
          body: def.en.body,
        });
      }

      if (def.hi) {
        await StaticPageTranslation.create({
          static_page_id: page.id,
          locale: 'hi',
          title: def.hi.title,
          body: def.hi.body,
        });
      }

      page = await staticPageRepository.findBySlugWithTranslations(slug);
    }
    return page;
  }

  async getPageBySlug(slug, locale = 'en') {
    let page = await staticPageRepository.findBySlugWithTranslations(slug);
    if (!page) {
      page = await this.ensurePageExists(slug);
    }

    if (!page) {
      return null;
    }

    const translations = page.translations || [];
    const matchedTranslation =
      translations.find((t) => t.locale === locale) ||
      translations.find((t) => t.locale === 'en') ||
      translations[0];

    return {
      id: page.id,
      uuid: page.uuid,
      slug: page.slug,
      is_active: page.is_active,
      updated_at: page.updated_at,
      title: matchedTranslation ? matchedTranslation.title : (DEFAULT_POLICIES[slug]?.en?.title || slug),
      body: matchedTranslation ? matchedTranslation.body : (DEFAULT_POLICIES[slug]?.en?.body || ''),
      locale: matchedTranslation ? matchedTranslation.locale : 'en',
      translations: translations.map((t) => ({
        locale: t.locale,
        title: t.title,
        body: t.body,
      })),
    };
  }

  async upsertPage(slug, payload) {
    await staticPageRepository.upsertPageWithTranslations(slug, payload);
    return await this.getPageBySlug(slug, payload.locale || 'en');
  }
}

module.exports = new StaticPageService();
