import config from "@config/config.json";
import GSAPWrapper from "@layouts/components/GSAPWrapper";
import PostSingle from "@layouts/PostSingle";
import { getSinglePage } from "@lib/contentParser";
import { sortByDate } from "@lib/utils/sortFunctions";
import { setRequestLocale } from 'next-intl/server';
import { prisma } from "@/lib/prisma";
import { notFound } from 'next/navigation';

const { blog_folder } = config.settings;

// Use dynamic rendering instead of static generation
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// post single layout
const Article = async ({ params }) => {
  const { single, locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Fetch post from database
  const dbPost = await prisma.post.findFirst({
    where: {
      slug: single,
      published: true
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  });

  if (!dbPost) {
    notFound();
  }

  // Fetch recent posts
  const recentDbPosts = await prisma.post.findMany({
    where: {
      published: true,
      NOT: { slug: single }
    },
    orderBy: { publishedAt: 'desc' },
    take: 2,
    include: {
      author: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  });

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
