import { Metadata } from 'next';
import { Container, Section, Grid, Card, CardContent } from '@/components/ui';

export const metadata: Metadata = {
  title: 'About Us - Kritvia',
  description: 'Learn about Kritvia - our mission, vision, and the team building the future of enterprise technology.',
};

const values = [
  { title: 'Innovation', description: 'We constantly push boundaries to deliver cutting-edge solutions.', emoji: '💡' },
  { title: 'Excellence', description: 'Quality is at the heart of everything we do.', emoji: '⭐' },
  { title: 'Collaboration', description: 'We work closely with clients to achieve shared goals.', emoji: '🤝' },
  { title: 'Integrity', description: 'Transparency and honesty guide our relationships.', emoji: '🎯' },
];

const stats = [
  { value: '500+', label: 'Enterprise Clients' },
  { value: '98%', label: 'Client Retention' },
  { value: '200+', label: 'Team Members' },
  { value: '10+', label: 'Years Experience' },
];

export default function AboutPage() {
  return (
    <div>
      <Section className="min-h-[50vh] flex items-center pt-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-neutral-900 mb-6">
              About Kritvia
            </h1>
            <p className="text-xl text-neutral-600">
              We are a technology company dedicated to building innovative solutions that transform businesses and improve lives. Our team of experts combines creativity with technical excellence.
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <Grid cols={4} colsMobile={2} colsTablet={2}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Our Values</h2>
          </div>
          <Grid cols={4} colsMobile={2} colsTablet={2} gap="lg">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{value.emoji}</div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{value.title}</h3>
                  <p className="text-neutral-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container>
          <Grid cols={2} colsMobile={1} gap="xl">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Mission</h2>
              <p className="text-neutral-600 text-lg">
                To empower businesses with innovative technology solutions that drive growth, efficiency, and competitive advantage in the digital age.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Vision</h2>
              <p className="text-neutral-600 text-lg">
                To be the leading provider of transformative technology solutions, known for excellence, innovation, and lasting impact on our clients success.
              </p>
            </div>
          </Grid>
        </Container>
      </Section>
    </div>
  );
}
