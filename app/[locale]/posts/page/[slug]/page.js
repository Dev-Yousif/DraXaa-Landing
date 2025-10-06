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

// Use ISR - revalidate every 60 seconds for new posts
export const revalidate = 60; // Revalidate every 60 seconds
export const dynamicParams = true;

// blog pagination
const BlogPagination = async ({ params }) => {
  const { slug, locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('BlogPage');

  // Handle undefined slug (first page)
  const currentPage = slug ? parseInt(slug) : 1;
  const { pagination } = config.settings;

  // Fetch published posts from API
  let dbPosts = [];
  let totalPosts = 0;

  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/posts?published=true`, {
      cache: 'no-store', // Always fetch fresh data
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const allPosts = await response.json();
      totalPosts = allPosts.length;

      // Apply pagination
      const startIndex = (currentPage - 1) * pagination;
      const endIndex = startIndex + pagination;
      dbPosts = allPosts.slice(startIndex, endIndex);
    }
  } catch (error) {
    console.error('Failed to fetch posts from API:', error);
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
            section="posts"
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
