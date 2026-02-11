
import { createContext, useContext } from 'react';
import { AppLanguage } from '../types';
import { UI_TRANSLATIONS } from './translations';

export const LanguageContext = createContext<{
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string) => string;
}>({
  language: AppLanguage.ENGLISH,
  setLanguage: () => {},
  t: (key) => key
});

export const useTranslation = () => useContext(LanguageContext);

export const getTranslator = (lang: AppLanguage) => (key: string) => UI_TRANSLATIONS[lang][key] || key;
