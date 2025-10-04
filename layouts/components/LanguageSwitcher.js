"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="language-switcher">
      <select
        value={locale}
        onChange={(e) => switchLocale(e.target.value)}
        className="language-select px-3 py-2 rounded border border-border bg-body text-dark cursor-pointer"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc === 'en' ? '🇬🇧 English' : '🇸🇦 العربية'}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
