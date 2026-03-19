// This is a server component by default (no "use client" directive)
// We'll fetch the blog post data based on the slug.
// Since we don't have a real CMS, we'll use mock data.
// In a real app, you would fetch from a CMS or database.

interface BlogPostProps {
  params: { slug: string };
}

// Mock data for blog posts
const mockPosts = [
  {
    slug: "getting-started-with-kritvia",
    title: "Getting Started with Kritvia: A Beginner's Guide",
    excerpt: "Learn how to set up Kritvia and start transforming your business operations in just 30 minutes.",
    date: "March 15, 2026",
    content: `
      <p>Welcome to Kritvia! This guide will help you get started with our AI-powered business operating system.</p>
      <p>Kritvia integrates CRM, marketing, operations, and AI agents into a single platform.</p>
      <p>Follow these steps to set up your account:</p>
      <ol>
        <li>Sign up for a free trial</li>
        <li>Connect your existing tools</li>
        <li>Configure your AI agents</li>
        <li>Start automating your workflows</li>
      </ol>
    `,
  },
  {
    slug: "ai-agents-for-small-business",
    title: "How AI Agents Can Save Small Businesses 15+ Hours Per Week",
    excerpt: "Discover practical ways to implement AI agents in your daily operations to boost productivity and reduce costs.",
    date: "March 10, 2026",
    content: `
      <p>Small business owners wear many hats. AI agents can help automate repetitive tasks.</p>
      <p>Here are some ways AI agents can save you time:</p>
      <ul>
        <li>Automated lead follow-up</li>
        <li>Social media scheduling</li>
        <li>Email marketing campaigns</li>
        <li>Customer support ticket routing</li>
        <li>Inventory management alerts</li>
      </ul>
    `,
  },
  {
    slug: "crm-automation-best-practices",
    title: "CRM Automation Best Practices: From Lead to Loyal Customer",
    excerpt: "Master the art of automating your customer relationship management to increase retention and sales.",
    date: "March 5, 2026",
    content: `
      <p>Effective CRM automation can transform your sales process.</p>
      <p>Best practices include:</p>
      <ul>
        <li>Lead scoring and routing</li>
        <li>Automated email sequences</li>
        <li>Task creation based on triggers</li>
        <li>Pipeline stage updates</li>
        <li>Renewal and upsell automation</li>
      </ul>
    `,
  },
];

export default function BlogPost({ params }: BlogPostProps) {
  const { slug } = params;

  // Find the post by slug
  const post = mockPosts.find((p) => p.slug === slug);

  // If post not found, we could return a 404, but for simplicity we'll show a placeholder
  if (!post) {
    return (
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="mb-8 text-4xl font-bold text-gray-900">Post Not Found</h1>
          <p className="text-gray-600">The blog post you're looking for does not exist.</p>
          <a href="/blog" className="text-indigo-600 hover:underline">
            ← Back to Blog
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">{post.title}</h1>
        <div className="text-gray-600 mb-6">
          <span>{post.date}</span>
        </div>
        <article className="prose prose-lg max-w-none">
          {/* We're using dangerouslySetInnerHTML for the mock content since it's HTML string */}
          {/* In a real app with a CMS, you would get rich text and render it appropriately */}
          <div
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
        </article>
        <div className="mt-12 flex items-center space-x-4 text-gray-500">
          <a href="/blog" className="hover:text-indigo-600 transition-colors">
            ← Back to Blog
          </a>
        </div>
      </div>
    </div>
  );
}