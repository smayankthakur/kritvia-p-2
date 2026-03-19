import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      slug: "getting-started-with-kritvia",
      title: "Getting Started with Kritvia: A Beginner's Guide",
      excerpt: "Learn how to set up Kritvia and start transforming your business operations in just 30 minutes.",
      date: "March 15, 2026",
      image: "/placeholder-blog-1.jpg",
    },
    {
      slug: "ai-agents-for-small-business",
      title: "How AI Agents Can Save Small Businesses 15+ Hours Per Week",
      excerpt: "Discover practical ways to implement AI agents in your daily operations to boost productivity and reduce costs.",
      date: "March 10, 2026",
      image: "/placeholder-blog-2.jpg",
    },
    {
      slug: "crm-automation-best-practices",
      title: "CRM Automation Best Practices: From Lead to Loyal Customer",
      excerpt: "Master the art of automating your customer relationship management to increase retention and sales.",
      date: "March 5, 2026",
      image: "/placeholder-blog-3.jpg",
    },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
          Blog
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    {post.title}
                  </h3>
                  <p className="mb-4 text-gray-600 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{post.date}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}