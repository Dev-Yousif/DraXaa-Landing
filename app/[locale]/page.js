import Cta from "@layouts/components/Cta";
import GSAPWrapper from "@layouts/components/GSAPWrapper";
import Features from "@layouts/partials/Features";
import HomeBanner from "@layouts/partials/HomeBanner";
import SeoMeta from "@layouts/partials/SeoMeta";
import ShortIntro from "@layouts/partials/ShortIntro";
import SpecialFeatures from "@layouts/partials/SpecialFeatures";
import Testimonial from "@layouts/partials/Testimonial";
import { getListPage } from "@lib/contentParser";
import { getTranslations, setRequestLocale } from 'next-intl/server';

const Home = async ({ params }) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const homepage = await getListPage("content/_index.md");
  const { frontmatter } = homepage;
  const { brands } = frontmatter;

  // Get translations
  const t = await getTranslations('HomePage');

  // Build data from translations
  const banner = {
    title: t('heroTitle'),
    link: {
      label: t('heroButton'),
      href: '/contact'
    },
    image: '/images/banner-app.png'
  };

  const features = {
    sub_title: t('servicesSubtitle'),
    title: t('servicesTitle'),
    description: t('servicesDescription'),
    list: [
      {
        icon: 'monitor',
        title: t('webDevTitle'),
        content: t('webDevContent')
      },
      {
        icon: 'smartphone',
        title: t('mobileDevTitle'),
        content: t('mobileDevContent')
      },
      {
        icon: 'code',
        title: t('customSoftwareTitle'),
        content: t('customSoftwareContent')
      },
      {
        icon: 'globe',
        title: t('ecommerceTitle'),
        content: t('ecommerceContent')
      },
      {
        icon: 'layers',
        title: t('uiuxTitle'),
        content: t('uiuxContent')
      },
      {
        icon: 'database',
        title: t('cloudTitle'),
        content: t('cloudContent')
      }
    ]
  };

  const intro = {
    subtitle: t('introSubtitle'),
    title: t('introTitle'),
    description: t('introDescription'),
    thumbnail: '/images/video-popup.jpg',
    video_id: 'dyZcRRWiuuw'
  };

  const speciality = {
    primary: {
      subtitle: t('primarySpecialtySubtitle'),
      title: t('primarySpecialtyTitle'),
      description: t('primarySpecialtyDescription'),
      image: '/images/features-01.png'
    },
    secondary: {
      subtitle: t('secondarySpecialtySubtitle'),
      title: t('secondarySpecialtyTitle'),
      description: t('secondarySpecialtyDescription'),
      image: '/images/features-02.png'
    }
  };

  const testimonial = {
    title: t('testimonialsTitle'),
    subtitle: t('testimonialsSubtitle'),
    description: t('testimonialsDescription'),
    list: frontmatter.testimonial.list // Keep existing testimonials for now
  };

  return (
    <GSAPWrapper>
      <SeoMeta title="Home" />
      <HomeBanner banner={banner} brands={brands} />
      <Features features={features} />
      <ShortIntro intro={intro} />
      <SpecialFeatures speciality={speciality} />
      <Testimonial testimonial={testimonial} />
      <Cta />
    </GSAPWrapper>
  );
};

export default Home;
