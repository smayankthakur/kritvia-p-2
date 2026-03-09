import { Metadata } from 'next';
import { Container, Section, Grid, Card, CardContent } from '@/components/ui';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Resources - Kritvia',
  description: 'Insights, guides, and whitepapers on enterprise technology, AI, cloud architecture, and software development.',
};

const resources = {
  blog: [
    { title: 'The Future of Enterprise AI in 2024', date: 'Jan 15, 2024', category: 'AI & Machine Learning' },
    { title: 'Building Scalable Cloud Architecture', date: 'Jan 10, 2024', category: 'Cloud Computing' },
    { title: 'Modern Web Development Best Practices', date: 'Jan 5, 2024', category: 'Web Development' },
  ],
  guides: [
    { title: 'Getting Started with Kritvia AI', description: 'Step-by-step guide to implementing AI in your business.' },
    { title: 'Cloud Migration Checklist', description: 'Everything you need to know before migrating to the cloud.' },
    { title: 'SaaS Security Best Practices', description: 'Essential security measures for SaaS applications.' },
  ],
  whitepapers: [
    { title: 'Enterprise AI Implementation Guide', description: 'Comprehensive guide to AI adoption in enterprise.' },
    { title: 'Cloud Cost Optimization Report', description: 'Strategies for reducing cloud spending by 40%.' },
  ],
};

export default function ResourcesPage() {
  return (
    <div>
      <Section className="min-h-[50vh] flex items-center pt-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-neutral-900 mb-6">
              Resources
            </h1>
            <p className="text-xl text-neutral-600">
              Insights, guides, and research to help you stay ahead of technology trends.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          {/* Blog Section */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900">Latest Articles</h2>
              <Link href="/resources/blog" className="text-primary-600 font-medium hover:underline">
                View All
              </Link>
            </div>
            <Grid cols={3} colsMobile={1} gap="lg">
              {resources.blog.map((post, i) => (
                <Link key={i} href="/resources/blog">
                  <Card hover>
                    <CardContent className="p-6">
                      <span className="text-xs font-medium text-primary-600 mb-2 block">{post.category}</span>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{post.title}</h3>
                      <p className="text-sm text-neutral-500">{post.date}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </Grid>
          </div>

          {/* Guides Section */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900">Guides</h2>
              <Link href="/resources/guides" className="text-primary-600 font-medium hover:underline">
                View All
              </Link>
            </div>
            <Grid cols={3} colsMobile={1} gap="lg">
              {resources.guides.map((guide, i) => (
                <Link key={i} href="/resources/guides">
                  <Card hover>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{guide.title}</h3>
                      <p className="text-neutral-600">{guide.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </Grid>
          </div>

          {/* Whitepapers Section */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900">Whitepapers</h2>
              <Link href="/resources/whitepapers" className="text-primary-600 font-medium hover:underline">
                View All
              </Link>
            </div>
            <Grid cols={2} colsMobile={1} gap="lg">
              {resources.whitepapers.map((paper, i) => (
                <Link key={i} href="/resources/whitepapers">
                  <Card hover>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{paper.title}</h3>
                      <p className="text-neutral-600">{paper.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </Grid>
          </div>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Subscribe to our newsletter</h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-xl mx-auto">
              Get the latest insights and updates delivered to your inbox.
            </p>
            <form className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </Container>
      </Section>
    </div>
  );
}
