import config from "@config/config.json";
import GSAPWrapper from "@layouts/components/GSAPWrapper";
import PostSingle from "@layouts/PostSingle";
import { getSinglePage } from "@lib/contentParser";
import { sortByDate } from "@lib/utils/sortFunctions";
import { setRequestLocale } from 'next-intl/server';
import { prisma } from "@/lib/prisma";
import { notFound } from 'next/navigation';

const { blog_folder } = config.settings;

// Use ISR - revalidate every 60 seconds for new posts
export const revalidate = 60; // Revalidate every 60 seconds
export const dynamicParams = true;

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { single, locale } = await params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: single,
        published: true,
      },
      select: {
        title: true,
        excerpt: true,
        image: true,
        metaTitle: true,
        metaDescription: true,
        metaKeywords: true,
        ogImage: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }

    const title = post.metaTitle || post.title;
    const description = post.metaDescription || post.excerpt || post.title;
    const ogImage = post.ogImage || post.image || '/images/og-image.png';
    const keywords = post.metaKeywords || '';

    return {
      title: title,
      description: description,
      keywords: keywords,
      authors: [{ name: 'Draxaa' }],
      openGraph: {
        title: title,
        description: description,
        images: [ogImage],
        type: 'article',
        publishedTime: post.publishedAt?.toISOString(),
        modifiedTime: post.updatedAt?.toISOString(),
        locale: locale,
        alternateLocale: locale === 'en' ? 'ar' : 'en',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [ogImage],
      },
      alternates: {
        canonical: `https://www.draxaa.com/${locale}/posts/${single}`,
        languages: {
          'en': `https://www.draxaa.com/en/posts/${single}`,
          'ar': `https://www.draxaa.com/ar/posts/${single}`,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post',
    };
  }
}

// post single layout
const Article = async ({ params }) => {
  const { single, locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Fetch post from API
  let dbPost = null;
  let recentDbPosts = [];

  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Fetch all published posts
    const response = await fetch(`${baseUrl}/api/posts?published=true`, {
      cache: 'no-store', // Always fetch fresh data
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const allPosts = await response.json();

      // Find the current post
      dbPost = allPosts.find(post => post.slug === single);

      if (!dbPost) {
        notFound();
      }

      // Get recent posts (excluding current post)
      recentDbPosts = allPosts
        .filter(post => post.slug !== single)
        .slice(0, 2);
    } else {
      notFound();
    }
  } catch (error) {
    console.error('Failed to fetch post from API:', error);
    notFound();
  }

  // Transform to existing structure
  const frontmatter = {
    title: dbPost.title,
    image: dbPost.image,
    date: dbPost.publishedAt,
    author: {
      name: dbPost.authorName,
      avatar: dbPost.authorAvatar
    }
  };

  const content = dbPost.content;

  const recentPosts = recentDbPosts.map(post => ({
    slug: post.slug,
    frontmatter: {
      title: post.title,
      image: post.image,
      date: post.publishedAt,
      author: {
        name: post.authorName,
        avatar: post.authorAvatar
      }
    },
    content: post.content,
    excerpt: post.excerpt
  }));

  return (
    <GSAPWrapper>
      <PostSingle
        frontmatter={frontmatter}
        content={content}
        recentPosts={recentPosts}
      />
    </GSAPWrapper>
  );
};

export default Article;
