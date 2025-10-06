// Page 1 - just re-exports the main pagination component
import BlogPagination from "../[slug]/page";

export const revalidate = 60; // Revalidate every 60 seconds
export const dynamicParams = true;

export default BlogPagination;
