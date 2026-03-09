import { Metadata } from 'next';
import { Container, Section, Grid, Card, CardContent } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Blog - Kritvia',
  description: 'Latest insights on AI, cloud computing, web development, and enterprise technology.',
};

const posts = [
  { title: 'The Future of Enterprise AI in 2024', date: 'Jan 15, 2024', category: 'AI & Machine Learning', excerpt: 'Exploring the latest trends in enterprise AI adoption.' },
  { title: 'Building Scalable Cloud Architecture', date: 'Jan 10, 2024', category: 'Cloud Computing', excerpt: 'Best practices for designing cloud-native systems.' },
  { title: 'Modern Web Development Best Practices', date: 'Jan 5, 2024', category: 'Web Development', excerpt: 'Key principles for building performant web apps.' },
  { title: 'SaaS Security Essentials', date: 'Dec 28, 2023', category: 'Security', excerpt: 'Critical security measures for SaaS applications.' },
  { title: 'AI in Healthcare: Use Cases', date: 'Dec 20, 2023', category: 'Healthcare', excerpt: 'How AI is transforming healthcare delivery.' },
  { title: 'Microservices vs Monoliths', date: 'Dec 15, 2023', category: 'Architecture', excerpt: 'Making the right architectural choice for your project.' },
];

export default function BlogPage() {
  return (
    <div>
      <Section className="min-h-[40vh] flex items-center pt-20">
        <Container>
          <h1 className="text-5xl font-bold text-neutral-900 mb-6">Blog</h1>
          <p className="text-xl text-neutral-600 max-w-2xl">Latest insights on technology, AI, cloud computing, and software development.</p>
        </Container>
      </Section>
      <Section>
        <Container>
          <Grid cols={3} colsMobile={1} colsTablet={2} gap="lg">
            {posts.map((post) => (
              <Card key={post.title} hover>
                <CardContent className="p-6">
                  <span className="text-xs font-medium text-primary-600 mb-2 block">{post.category}</span>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{post.title}</h3>
                  <p className="text-neutral-600 text-sm mb-3">{post.excerpt}</p>
                  <p className="text-xs text-neutral-500">{post.date}</p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>
    </div>
  );
}
