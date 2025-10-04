"use client";

import config from "@config/config.json";
import Banner from "./components/Banner";
import ImageFallback from "./components/ImageFallback";
import { useTranslations } from 'next-intl';

const Contact = ({ data }) => {
  const t = useTranslations('Contact');
  const { frontmatter } = data;

  return (
    <section className="section">
      <Banner title={t('title')} />
      <div className="container">
        <div className="section row items-center justify-center">
          <div className="animate lg:col-5">
            <ImageFallback
              className="mx-auto lg:pr-10"
              src="/images/vectors/contact.png"
              width={497}
              height={397}
              alt=""
            />
          </div>
          <div className="animate lg:col-5">
            <form
              method="POST"
              action={config.params.contact_form_action}
              className="contact-form rounded-xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.05)]"
            >
              <h2 className="h4 mb-6">{t('formTitle')}</h2>
              <div className="mb-6">
                <label
                  className="mb-2 block font-medium text-dark"
                  htmlFor="name"
                >
                  {t('nameLabel')}
                </label>
                <input
                  className="form-input w-full"
                  name="name"
                  placeholder={t('namePlaceholder')}
                  type="text"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  className="mb-2 block font-medium text-dark"
                  htmlFor="email"
                >
                  {t('emailLabel')}
                </label>
                <input
                  className="form-input w-full"
                  name="email"
                  placeholder={t('emailPlaceholder')}
                  type="email"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  className="mb-2 block font-medium text-dark"
                  htmlFor="subject"
                >
                  {t('subjectLabel')}
                </label>
                <input
                  className="form-input w-full"
                  name="subject"
                  placeholder={t('subjectPlaceholder')}
                  type="text"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  className="mb-2 block font-medium text-dark"
                  htmlFor="message"
                >
                  {t('messageLabel')}
                </label>
                <textarea
                  className="form-textarea w-full"
                  rows="6"
                  placeholder={t('messagePlaceholder')}
                />
              </div>
              <button className="btn btn-primary block w-full">
                {t('submitButton')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
