# Blog Management System - User Guide

## 🎯 Overview

Your blog system now fetches all posts from MongoDB database instead of markdown files. You can manage everything from the admin dashboard.

## 📝 How to Create & Publish Blogs

### 1. Access Admin Dashboard
1. Navigate to `/admin/login`
2. Login with your credentials
3. Click "Blog Posts" in the sidebar

### 2. Create New Post
1. Click the "New Post" button
2. Fill in the form:
   - **Title**: Your blog post title (required)
   - **Slug**: Auto-generated URL slug (you can edit it)
   - **Featured Image URL**: Path to your image (e.g., `/images/blog/my-post.jpg`)
   - **Excerpt**: Short summary (optional, auto-generated from content if empty)
   - **Content**: Write your blog in Markdown/MDX format (required)
   - **Publish immediately**: Check to publish now, uncheck to save as draft
   - **Featured**: Mark post as featured

3. Click "Create Post"

### 3. Edit Existing Posts
1. Go to "Blog Posts" page
2. Find your post in the table
3. Click "Edit"
4. Make your changes
5. Click "Save Changes"

### 4. Publish/Unpublish Posts
- From the posts list, click "Publish" to make a draft live
- Click "Unpublish" to convert a published post back to draft
- Only published posts appear on your public blog page

### 5. Delete Posts
- Click "Delete" next to any post
- Confirm the deletion

## 🎨 Markdown Formatting Guide

Your content editor supports full Markdown syntax:

### Headings
```markdown
## Heading 2
### Heading 3
#### Heading 4
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
~~Strikethrough~~
```

### Lists
```markdown
- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
```

### Links & Images
```markdown
[Link text](https://example.com)
![Image alt text](/images/blog/image.jpg)
```

### Code Blocks
```markdown
\`\`\`javascript
const code = 'example';
console.log(code);
\`\`\`
```

### Blockquotes
```markdown
> This is a quote
```

## 📊 Blog Display

### Public Blog Page
- URL: `/en/posts` or `/ar/posts`
- Shows all published posts
- Pagination: 6 posts per page (configurable in `config/config.json`)
- Displays posts in order of publication date (newest first)

### Single Post Page
- URL: `/en/posts/your-post-slug`
- Shows full post content
- Displays date and reading time
- Author section has been removed
- Shows 2 recent posts at the bottom

## 🔧 Technical Details

### Database Schema
Posts are stored with these fields:
- `title`: Post title
- `slug`: URL-friendly slug (must be unique)
- `content`: Full Markdown/MDX content
- `excerpt`: Brief summary
- `image`: Featured image path
- `published`: Boolean (true/false)
- `featured`: Boolean (true/false)
- `authorId`: Linked to User model
- `authorName`: Author's name
- `authorAvatar`: Author's avatar path
- `publishedAt`: Date when post was first published
- `createdAt`: Creation date
- `updatedAt`: Last update date

### API Endpoints
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

### Pagination
- Controlled via `config/config.json` → `settings.pagination`
- Default: 6 posts per page
- Automatic page generation based on total posts

## 🚀 Workflow Example

1. **Create Draft**
   - Write post in dashboard
   - Leave "Publish immediately" unchecked
   - Click "Create Post"
   - Post saved as draft (not visible on public site)

2. **Review & Edit**
   - Go to Blog Posts → Drafts tab
   - Click "Edit" on your draft
   - Make changes
   - Save

3. **Publish**
   - Click "Publish" button in the posts list
   - OR Edit the post and check "Published"
   - Post now appears on `/en/posts`

4. **Update Published Post**
   - Edit the published post
   - Changes appear immediately
   - `updatedAt` date is automatically updated

## 💡 Tips

1. **Slug Best Practices**
   - Keep slugs short and descriptive
   - Use hyphens, not spaces
   - Don't change slugs after publishing (breaks existing links)

2. **Images**
   - Upload images to `/public/images/blog/`
   - Reference as `/images/blog/your-image.jpg`
   - Recommended size: 1120x700px

3. **Excerpts**
   - Write compelling excerpts for better engagement
   - If empty, first 160 characters of content are used

4. **SEO**
   - Use descriptive titles
   - Include keywords naturally
   - Write quality content (reading time is calculated)

## 🔄 Migration from Markdown Files

Your old markdown posts still exist in `content/posts/` but are no longer used. To migrate them:

1. Open each markdown file
2. Copy the content
3. Create a new post in the dashboard
4. Paste the content
5. Fill in the metadata
6. Publish

## 📱 Mobile Support

The admin dashboard is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices (iOS/Android)

## 🆘 Troubleshooting

**Posts not showing on blog page?**
- Make sure the post is published (not draft)
- Check that `publishedAt` date is set

**Slug already exists error?**
- Each slug must be unique
- Try a different slug

**Images not displaying?**
- Verify image path is correct
- Make sure image exists in `/public/images/blog/`

**Markdown not rendering?**
- Check your Markdown syntax
- Use the formatting guide above

## 🎯 Next Steps

After creating your first post:
1. Push Prisma schema: `npm run prisma:push`
2. Generate Prisma client: `npm run prisma:generate`
3. Restart your dev server: `npm run dev`
4. Visit `/admin/posts` to start creating!
