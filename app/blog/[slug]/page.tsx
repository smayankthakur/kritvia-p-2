import { motion } from "framer-motion";

interface BlogPostProps {
  params: { slug: string };
}

export default function BlogPost({ params }: BlogPostProps) {
  // In a real app, you would fetch the post from a CMS or database based on params.slug
  // For now, we'll return a placeholder
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="py-20 bg-white"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">
          Blog Post Title
        </h1>
        <div className="text-gray-600 mb-6">
          <span>March 15, 2026</span>
        </div>
        <article className="prose prose-lg max-w-none">
          <p>
            This is a placeholder for the blog post content. In a real application,
            this content would be fetched from a CMS like Sanity based on the slug.
          </p>
          <p>
            The structure is ready for Sanity CMS integration. You would typically
            use the Sanity client to fetch the post by its slug and then render
            the rich text content.
          </p>
        </article>
        <div className="mt-12 flex items-center space-x-4 text-gray-500">
          <a href="/blog" className="hover:text-indigo-600 transition-colors">
            ← Back to Blog
          </a>
        </div>
      </div>
    </motion.div>
  );
}