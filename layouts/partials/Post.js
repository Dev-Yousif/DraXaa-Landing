"use client";

import config from "@config/config.json";
import ImageFallback from "@layouts/components/ImageFallback";
import dateFormat from "@lib/utils/dateFormat";
import readingTime from "@lib/utils/readingTime";
import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';

const Post = ({ post, i }) => {
  const t = useTranslations('BlogPage');
  const { summary_length, blog_folder } = config.settings;

  // Validate image URL - must start with / or http
  const isValidImage = post.frontmatter.image &&
    (post.frontmatter.image.startsWith('/') || post.frontmatter.image.startsWith('http'));

  return (
    <div className="overflow-hidden rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,.05)]">
      {isValidImage && (
        <Link href={`/${blog_folder}/${post.slug}`}>
          <ImageFallback
            className="w-full object-cover"
            src={post.frontmatter.image}
            alt={post.frontmatter.title}
            width={570}
            height={335}
          />
        </Link>
      )}
      <div className="p-8">
        <h2 className="h4">
          <Link
            href={`/${blog_folder}/${post.slug}`}
            className="block hover:text-primary hover:underline"
          >
            {post.frontmatter.title}
          </Link>
        </h2>
        <p className="mt-4">
          {post.content.slice(0, Number(summary_length))}...
        </p>
        <div className="mt-6">
          <p className="text-gray-600">
            {dateFormat(post.frontmatter.date)} - {readingTime(post.content)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Post;
