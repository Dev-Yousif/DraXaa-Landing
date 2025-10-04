"use client";

import Social from "@components/Social";
import config from "@config/config.json";
import social from "@config/social.json";
import Logo from "@layouts/components/Logo";
import { markdownify } from "@lib/utils/textConverter";
import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('Footer');
  const tContact = useTranslations('Contact');
  const { email, phone, location } = config.contact_info;

  return (
    <footer className="">
      <div className="container">
        <div className="row border-y border-border py-12">
          <div className="animate md:col-6 lg:col-3">
            <Logo />
            {markdownify(t('footerContent'), "p", "mt-3")}
          </div>
          <div className="animate mt-8 md:col-6 lg:col-3 lg:mt-0">
            <h3 className="h5">Socials</h3>
            <div className="mt-5">
              {email && <Link href={`mailto:${email}`}>{email}</Link>}
              {/* social icons */}
              <Social source={social} className="social-icons mt-5" />
            </div>
          </div>
          <div className="animate mt-8 md:col-6 lg:col-3 lg:mt-0">
            <h3 className="h5">Quick Links</h3>
            {/* footer menu */}
            <ul className="mt-5 leading-10">
              <li>
                <Link href="/about" className=" hover:text-primary hover:underline">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/#features" className=" hover:text-primary hover:underline">
                  {t('ourServices')}
                </Link>
              </li>
              <li>
                <Link href="/posts" className=" hover:text-primary hover:underline">
                  {t('blogInsights')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className=" hover:text-primary hover:underline">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href="/terms-policy" className=" hover:text-primary hover:underline">
                  {t('privacyPolicy')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="animate mt-8 md:col-6 lg:col-3 lg:mt-0">
            <h3 className="h5">{tContact('location')}</h3>
            <ul className="mt-5 leading-10">
              <li>{markdownify(location)}</li>
              {phone && (
                <li>
                  <Link href={`tel:${phone}`}>{phone}</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
        {/* copyright */}
        <div className=" py-6 text-center">
          {markdownify(t('copyright'), "p", "footer-copy-write")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
