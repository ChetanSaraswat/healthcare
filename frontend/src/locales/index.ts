import en from './en.json';
import hi from './hi.json';
import { useAppSelector } from '@/store/hooks';

export type SupportedLocale = 'en' | 'hi';

export const dictionaries = {
  en,
  hi,
};

export const getDictionary = (locale: SupportedLocale = 'en') => {
  return dictionaries[locale] || dictionaries.en;
};

export const useTranslation = () => {
  const locale = useAppSelector((state) => state.ui?.locale || 'en') as SupportedLocale;
  const dict = getDictionary(locale);
  return { t: dict, locale };
};
