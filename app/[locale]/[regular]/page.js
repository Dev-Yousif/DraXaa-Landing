import NotFound from "@layouts/404";
import About from "@layouts/About";
import GSAPWrapper from "@layouts/components/GSAPWrapper";
import Contact from "@layouts/Contact";
import Default from "@layouts/Default";
import SeoMeta from "@layouts/partials/SeoMeta";
import { getRegularPage, getSinglePage } from "@lib/contentParser";
import { getTranslations } from 'next-intl/server';

// for all regular pages
const RegularPages = async ({ params }) => {
  const { regular, locale } = await params;
  const pageData = await getRegularPage(regular);
  const { title, meta_title, description, image, noindex, canonical, layout } =
    pageData.frontmatter;
  const { content } = pageData;

  // Get translations for About page
  let translatedData = pageData;
  if (layout === "about") {
    const t = await getTranslations('AboutPage');
    translatedData = {
      ...pageData,
      frontmatter: {
        ...pageData.frontmatter,
        title: t('title'),
        about_us: {
          subtitle: t('aboutSubtitle'),
          title: t('aboutTitle'),
          content: t('aboutContent'),
          image: pageData.frontmatter.about_us?.image || ''
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
          image: pageData.frontmatter.mission?.image || ''
        },
        video: {
          subtitle: t('videoSubtitle'),
          title: t('videoTitle'),
          description: t('videoDescription'),
          video_id: pageData.frontmatter.video?.video_id || '',
          thumbnail: pageData.frontmatter.video?.thumbnail || ''
        },
        clients: {
          subtitle: t('clientsSubtitle'),
          title: t('clientsTitle'),
          brands: pageData.frontmatter.clients?.brands || []
        },
        our_member: {
          subtitle: t('teamSubtitle'),
          title: t('teamTitle'),
          content: t('teamDescription'),
          list: pageData.frontmatter.our_member?.list || []
        },
        our_office: {
          subtitle: t('officesSubtitle'),
          title: t('officesTitle'),
          content: t('officesDescription'),
          countries: pageData.frontmatter.our_office?.countries || []
        }
      }
    };
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
}
