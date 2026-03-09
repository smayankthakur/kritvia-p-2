import { Metadata } from 'next';
import { Container, Section, Grid, Card, CardContent, Button } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Whitepapers - Kritvia',
  description: 'In-depth research and analysis on enterprise technology trends.',
};

const whitepapers = [
  { title: 'Enterprise AI Implementation Guide', description: 'Comprehensive guide to AI adoption in enterprise environments.', pages: 45 },
  { title: 'Cloud Cost Optimization Report', description: 'Strategies for reducing cloud spending by 40% or more.', pages: 32 },
  { title: 'State of SaaS 2024', description: 'Industry report on SaaS trends and best practices.', pages: 50 },
  { title: 'Security in the Age of AI', description: 'Protecting your organization in the AI era.', pages: 38 },
];

export default function WhitepapersPage() {
  return (
    <div>
      <Section className="min-h-[40vh] flex items-center pt-20">
        <Container>
          <h1 className="text-5xl font-bold text-neutral-900 mb-6">Whitepapers</h1>
          <p className="text-xl text-neutral-600 max-w-2xl">In-depth research and analysis on enterprise technology.</p>
        </Container>
      </Section>
      <Section>
        <Container>
          <Grid cols={2} colsMobile={1} gap="lg">
            {whitepapers.map((paper) => (
              <Card key={paper.title}>
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">{paper.title}</h3>
                  <p className="text-neutral-600 mb-4">{paper.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-500">{paper.pages} pages</span>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>
    </div>
  );
}
