import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import config from "@config/config.json";
import theme from "@config/theme.json";
import TwSizeIndicator from "@layouts/components/TwSizeIndicator";
import Footer from "@layouts/partials/Footer";
import Header from "@layouts/partials/Header";
import ChatWidget from "@layouts/components/ChatWidget";
import "../../styles/style.scss";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages();

  // Import google font css
  const pf = locale === 'ar' ? theme.fonts.font_family.arabic_primary : theme.fonts.font_family.primary;
  const sf = locale === 'ar' ? theme.fonts.font_family.arabic_secondary : theme.fonts.font_family.secondary;

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning={true}>
      <head>
        {/* responsive meta */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* favicon */}
        <link rel="shortcut icon" href={config.site.favicon} />

        {/* theme meta */}
        <meta name="theme-name" content="draxaa-software" />

        {/* google font css */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href={`https://fonts.googleapis.com/css2?family=${pf}${
            sf ? "&family=" + sf : ""
          }&display=swap`}
          rel="stylesheet"
        />

        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#000"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <NextIntlClientProvider messages={messages}>
          <TwSizeIndicator />
          <Header />
          {children}
          <Footer />
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
