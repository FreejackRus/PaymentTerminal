import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLanguages } from '../config/i18n';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('ru');

  useEffect(() => {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved && getLanguages().some(lang => lang.code === saved)) {
      setCurrentLanguage(saved);
    }
  }, []);

  const changeLanguage = (langCode) => {
    if (getLanguages().some(lang => lang.code === langCode)) {
      setCurrentLanguage(langCode);
      localStorage.setItem('preferredLanguage', langCode);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    languages: getLanguages()
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};