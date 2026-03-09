import { Metadata } from 'next';
import { Container, Section, Grid, Card, CardContent } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Guides - Kritvia',
  description: 'Step-by-step guides on implementing technology solutions.',
};

const guides = [
  { title: 'Getting Started with Kritvia AI', description: 'Step-by-step guide to implementing AI in your business.', level: 'Beginner', time: '15 min' },
  { title: 'Cloud Migration Checklist', description: 'Everything you need to know before migrating to the cloud.', level: 'Intermediate', time: '20 min' },
  { title: 'SaaS Security Best Practices', description: 'Essential security measures for SaaS applications.', level: 'Advanced', time: '25 min' },
  { title: 'Building Your First Web App', description: 'Complete guide to modern web development.', level: 'Beginner', time: '30 min' },
  { title: 'API Design Guidelines', description: 'Best practices for designing REST APIs.', level: 'Intermediate', time: '20 min' },
];

export default function GuidesPage() {
  return (
    <div>
      <Section className="min-h-[40vh] flex items-center pt-20">
        <Container>
          <h1 className="text-5xl font-bold text-neutral-900 mb-6">Guides</h1>
          <p className="text-xl text-neutral-600 max-w-2xl">Step-by-step guides to help you implement technology solutions.</p>
        </Container>
      </Section>
      <Section>
        <Container>
          <Grid cols={2} colsMobile={1} gap="lg">
            {guides.map((guide) => (
              <Card key={guide.title} hover>
                <CardContent className="p-6">
                  <div className="flex gap-3 mb-3">
                    <span className="text-xs font-medium bg-primary-100 text-primary-700 px-2 py-1 rounded">{guide.level}</span>
                    <span className="text-xs text-neutral-500">{guide.time}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{guide.title}</h3>
                  <p className="text-neutral-600">{guide.description}</p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>
    </div>
  );
}
