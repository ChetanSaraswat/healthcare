export interface ContactConfig {
  phone: string;
  phoneDisplay: string;
  tollFree: string;
  tollFreeDisplay: string;
  whatsappNumber: string;
  whatsappEnabled: boolean;
  whatsappHref: string;
  email: string;
  supportHours: string;
  getWhatsAppHref: (locale?: string, customMessage?: string) => string;
}

export const CONTACT_CONFIG: ContactConfig = {
  phone: '9667271249',
  phoneDisplay: '+91 96672 71249',
  tollFree: '18008892273',
  tollFreeDisplay: '1800-889-2273',
  whatsappNumber: '9667271249',
  whatsappEnabled: true,
  whatsappHref: 'https://wa.me/919667271249',
  email: 'care@omkarhealthcare.com',
  supportHours: '24/7 Caregiver Helpline & Dispatch',
  getWhatsAppHref: (locale: string = 'en', customMessage?: string) => {
    if (customMessage) {
      return `https://wa.me/919667271249?text=${encodeURIComponent(customMessage)}`;
    }
    const defaultMsg =
      locale === 'hi'
        ? 'नमस्ते, मुझे ओमकार हेल्थकेयर के मेडिकल उपकरणों के बारे में जानकारी चाहिए।'
        : 'Hello, I need help with a product on Omkar Healthcare.';
    return `https://wa.me/919667271249?text=${encodeURIComponent(defaultMsg)}`;
  },
};
