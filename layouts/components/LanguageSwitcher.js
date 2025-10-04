"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";

// Custom SVG Icons
const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const LanguageSwitcher = ({ isMobile = false }) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const switchLocale = (newLocale) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  const getLanguageInfo = (loc) => {
    return {
      'en': { flag: '🇬🇧', name: 'English', native: 'English' },
      'ar': { flag: '🇸🇦', name: 'Arabic', native: 'العربية' }
    }[loc] || { flag: '🌐', name: loc.toUpperCase(), native: loc.toUpperCase() };
  };

  const currentLang = getLanguageInfo(locale);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isMobile) {
    return (
      <div className="language-switcher-mobile">
        <div className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
          Language
        </div>
        <div className="space-y-1">
          {routing.locales.map((loc) => {
            const langInfo = getLanguageInfo(loc);
            const isActive = locale === loc;
            
            return (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{langInfo.flag}</span>
                  <span className="font-medium">{langInfo.native}</span>
                </div>
                {isActive && (
                  <CheckIcon className="h-4 w-4" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="language-switcher-desktop relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        <span className="text-base">{currentLang.flag}</span>
        <span>{currentLang.native}</span>
        <ChevronDownIcon 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[140px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {routing.locales.map((loc) => {
            const langInfo = getLanguageInfo(loc);
            const isActive = locale === loc;
            
            return (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-200 ${
                  isActive 
                    ? 'bg-primary/5 text-primary font-medium' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                <span className="text-base">{langInfo.flag}</span>
                <span className="flex-1 text-left">{langInfo.native}</span>
                {isActive && (
                  <CheckIcon className="h-4 w-4 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
