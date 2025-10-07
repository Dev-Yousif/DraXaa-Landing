import { prisma } from '@/lib/prisma';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap() {
  const baseUrl = 'https://www.draxaa.com';

  const routes = [
    // Homepage
    { url: `${baseUrl}/en`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/ar`, changeFrequency: 'weekly', priority: 1.0 },

    // About
    { url: `${baseUrl}/en/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/ar/about`, changeFrequency: 'monthly', priority: 0.8 },

    // Contact
    { url: `${baseUrl}/en/contact`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/ar/contact`, changeFrequency: 'monthly', priority: 0.8 },

    // Terms & Privacy
    { url: `${baseUrl}/en/terms-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/ar/terms-policy`, changeFrequency: 'yearly', priority: 0.3 },

    // Blog Index
    { url: `${baseUrl}/en/posts`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/ar/posts`, changeFrequency: 'daily', priority: 0.9 },

    // Blog Pagination
    { url: `${baseUrl}/en/posts/page/1`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/ar/posts/page/1`, changeFrequency: 'daily', priority: 0.7 },
  ];

  // Get dynamic blog posts from database
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
        publishedAt: true,
        updatedAt: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    // Add each blog post for both languages
    posts.forEach(post => {
      const lastModified = post.publishedAt || post.updatedAt || new Date();

      routes.push(
        {
          url: `${baseUrl}/en/posts/${post.slug}`,
          changeFrequency: 'monthly',
          priority: 0.6,
          lastModified: lastModified
        },
        {
          url: `${baseUrl}/ar/posts/${post.slug}`,
          changeFrequency: 'monthly',
          priority: 0.6,
          lastModified: lastModified
        }
      );
    });
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
  }

  return routes.map(route => ({
    url: route.url,
    lastModified: route.lastModified || new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
