"use client";

import { useState } from "react";
import config from "@config/config.json";
import Banner from "./components/Banner";
import ImageFallback from "./components/ImageFallback";
import { useTranslations } from 'next-intl';

const Contact = ({ data }) => {
  const t = useTranslations('Contact');
  const { frontmatter } = data;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: "success",
          message: data.message || "Thank you! We'll get back to you soon.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus({
        type: "error",
        message: "Failed to submit form. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

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
              onSubmit={handleSubmit}
              className="contact-form rounded-xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.05)]"
            >
              <h2 className="h4 mb-6">{t('formTitle')}</h2>

              {/* Status Message */}
              {status.message && (
                <div
                  className={`mb-6 rounded-lg p-4 ${
                    status.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {status.message}
                </div>
              )}

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
                  value={formData.name}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('emailPlaceholder')}
                  type="email"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  className="mb-2 block font-medium text-dark"
                  htmlFor="phone"
                >
                  Phone (Optional)
                </label>
                <input
                  className="form-input w-full"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  type="tel"
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
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t('subjectPlaceholder')}
                  type="text"
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
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder={t('messagePlaceholder')}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary block w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : t('submitButton')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
