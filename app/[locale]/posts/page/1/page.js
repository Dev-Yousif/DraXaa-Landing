// Page 1 - just re-exports the main pagination component
import BlogPagination from "../[slug]/page";

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export default BlogPagination;
