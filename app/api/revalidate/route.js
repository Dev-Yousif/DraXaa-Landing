import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { path } = body;

    // Revalidate specific path or all blog paths
    if (path) {
      revalidatePath(path);
    } else {
      // Revalidate all blog pages
      revalidatePath('/posts');
      revalidatePath('/posts/page/[slug]', 'page');
      revalidatePath('/posts/[single]', 'page');
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path: path || 'all blog pages'
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Error revalidating', message: error.message },
      { status: 500 }
    );
  }
}
