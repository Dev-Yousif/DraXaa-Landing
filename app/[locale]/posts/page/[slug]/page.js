import Pagination from "@components/Pagination";
import config from "@config/config.json";
import Banner from "@layouts/components/Banner";
import Cta from "@layouts/components/Cta";
import GSAPWrapper from "@layouts/components/GSAPWrapper";
import SeoMeta from "@layouts/partials/SeoMeta";
import { getListPage, getSinglePage } from "@lib/contentParser";
import Post from "@partials/Post";
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from "@/lib/prisma";

const { blog_folder } = config.settings;

// Use dynamic rendering - skip static generation
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

// blog pagination
const BlogPagination = async ({ params }) => {
  const { slug, locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('BlogPage');

  const currentPage = parseInt(slug || 1);
  const { pagination } = config.settings;

  // Fetch published posts from database with error handling
  let totalPosts = 0;
  let dbPosts = [];

  try {
    totalPosts = await prisma.post.count({ where: { published: true } });
    dbPosts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      skip: (currentPage - 1) * pagination,
      take: pagination,
      include: {
        author: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    // Return empty posts if database is not available
  }

  // Transform database posts to match existing structure
  const transformedPosts = dbPosts.map(post => ({
    slug: post.slug,
    frontmatter: {
      title: post.title,
      image: post.image,
      date: post.publishedAt,
      draft: false,
      author: {
        name: post.authorName,
        avatar: post.authorAvatar
      }
    },
    content: post.content,
    excerpt: post.excerpt
  }));

  const indexOfLastPost = currentPage * pagination;
  const indexOfFirstPost = indexOfLastPost - pagination;
  const totalPages = Math.ceil(totalPosts / pagination);
  const currentPosts = transformedPosts;

  const title = t('title');

  return (
    <GSAPWrapper>
      <SeoMeta title={title} />
      <section className="section pt-0">
        <Banner title={title} />
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-lg text-dark mb-4">{t('subtitle')}</p>
            <p className="text-default">{t('description')}</p>
          </div>
          <div className="row justify-center pb-16 pt-8">
            {currentPosts.map((post, i) => (
              <div key={`key-${i}`} className="mb-8 lg:col-5">
                <Post post={post} />
              </div>
            ))}
          </div>
          <Pagination
            section={blog_folder}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </section>
      {/* CTA */}
      <Cta />
    </GSAPWrapper>
  );
};

export default BlogPagination;
