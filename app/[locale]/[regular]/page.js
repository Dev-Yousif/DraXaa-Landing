import NotFound from "@layouts/404";
import About from "@layouts/About";
import GSAPWrapper from "@layouts/components/GSAPWrapper";
import Contact from "@layouts/Contact";
import Default from "@layouts/Default";
import SeoMeta from "@layouts/partials/SeoMeta";
import { getRegularPage, getSinglePage } from "@lib/contentParser";
import { getTranslations, setRequestLocale } from 'next-intl/server';

// for all regular pages
const RegularPages = async ({ params }) => {
  const { regular, locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const pageData = await getRegularPage(regular);

  if (!pageData || !pageData.frontmatter) {
    return <NotFound />;
  }

  const { title = '', meta_title = '', description = '', image = '', noindex = false, canonical = '', layout = 'default' } =
    pageData.frontmatter || {};
  const { content = '' } = pageData;

  // Get translations for About page
  let translatedData = pageData;
  if (layout === "about") {
    try {
      const t = await getTranslations('AboutPage');
      const frontmatter = pageData.frontmatter || {};

      translatedData = {
        ...pageData,
        frontmatter: {
          ...frontmatter,
          title: t('title'),
          about_us: {
            subtitle: t('aboutSubtitle'),
            title: t('aboutTitle'),
            content: t('aboutContent'),
            image: frontmatter.about_us?.image || ''
          },
          works: {
            subtitle: t('expertiseSubtitle'),
            title: t('expertiseTitle'),
            list: [
              { title: t('expertise1Title'), content: t('expertise1Content') },
              { title: t('expertise2Title'), content: t('expertise2Content') },
              { title: t('expertise3Title'), content: t('expertise3Content') },
              { title: t('expertise4Title'), content: t('expertise4Content') }
            ]
          },
          mission: {
            subtitle: t('missionSubtitle'),
            title: t('missionTitle'),
            content: t('missionContent'),
            image: frontmatter.mission?.image || ''
          },
          video: {
            subtitle: t('videoSubtitle'),
            title: t('videoTitle'),
            description: t('videoDescription'),
            video_id: frontmatter.video?.video_id || '',
            thumbnail: frontmatter.video?.thumbnail || ''
          },
          clients: {
            subtitle: t('clientsSubtitle'),
            title: t('clientsTitle'),
            brands: frontmatter.clients?.brands || []
          },
          our_member: {
            subtitle: t('teamSubtitle'),
            title: t('teamTitle'),
            content: t('teamDescription'),
            list: frontmatter.our_member?.list || []
          },
          our_office: {
            subtitle: t('officesSubtitle'),
            title: t('officesTitle'),
            content: t('officesDescription'),
            countries: frontmatter.our_office?.countries || []
          }
        }
      };
    } catch (error) {
      console.error('Error getting translations for About page:', error);
    }
  }

  return (
    <GSAPWrapper>
      <SeoMeta
        title={title}
        description={description ? description : content.slice(0, 120)}
        meta_title={meta_title}
        image={image}
        noindex={noindex}
        canonical={canonical}
      />

      {layout === "404" ? (
        <NotFound data={translatedData} />
      ) : layout === "about" ? (
        <About data={translatedData} />
      ) : layout === "contact" ? (
        <Contact data={translatedData} />
      ) : (
        <Default data={translatedData} />
      )}
    </GSAPWrapper>
  );
};
export default RegularPages;

export async function generateStaticParams() {
  try {
    const slugs = await getSinglePage("content");
    const locales = ['en', 'ar'];
    const params = [];

    locales.forEach(locale => {
      slugs.forEach(item => {
        params.push({
          locale,
          regular: item.slug,
        });
      });
    });

    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
