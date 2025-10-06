import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from 'next/cache';

// GET all posts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    const where = published === "true" ? { published: true } : {};

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST create new post
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    let {
      title,
      slug,
      content,
      excerpt,
      image,
      published,
      featured,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Sanitize slug to be URL-friendly
    slug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (!slug) {
      return NextResponse.json(
        { error: "Invalid slug" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    // Ensure metaKeywords is properly formatted as string
    const formattedMetaKeywords = metaKeywords
      ? (Array.isArray(metaKeywords) ? metaKeywords.join(', ') : String(metaKeywords))
      : null;

    const post = await prisma.post.create({
      data: {
        title: String(title),
        slug: String(slug),
        content: String(content),
        excerpt: excerpt ? String(excerpt) : content.substring(0, 160),
        image: image ? String(image) : "/images/blog/default.jpg",
        published: Boolean(published),
        featured: Boolean(featured),
        metaTitle: metaTitle ? String(metaTitle) : null,
        metaDescription: metaDescription ? String(metaDescription) : null,
        metaKeywords: formattedMetaKeywords,
        ogImage: ogImage ? String(ogImage) : null,
        authorId: String(session.user.id),
        authorName: session.user.name ? String(session.user.name) : String(session.user.email),
        authorAvatar: "/images/author/default.jpg",
        publishedAt: published ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Revalidate blog pages to show new post immediately
    if (published) {
      revalidatePath('/posts');
      revalidatePath(`/posts/${slug}`);
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        error: "Failed to create post",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
