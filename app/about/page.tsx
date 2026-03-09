import { Metadata } from 'next';
import { Container, Section, Grid, Button } from '@/components/ui';

export const metadata: Metadata = {
  title: 'About Us - Kritvia',
  description: 'Learn about Kritvia - our mission, vision, and the team behind our innovative technology solutions.',
};

export default function AboutPage() {
  const values = [
    {
      title: 'Innovation',
      description: 'We constantly push boundaries to deliver cutting-edge solutions.',
    },
    {
      title: 'Excellence',
      description: 'Quality is at the heart of everything we do.',
    },
    {
      title: 'Collaboration',
      description: 'We work closely with clients to achieve shared goals.',
    },
    {
      title: 'Integrity',
      description: 'Transparency and honesty guide our relationships.',
    },
  ];

  const team = [
    { name: 'John Doe', role: 'CEO & Founder', emoji: '👨‍💼' },
    { name: 'Jane Smith', role: 'CTO', emoji: '👩‍💻' },
    { name: 'Mike Johnson', role: 'VP of Engineering', emoji: '👨‍🔬' },
    { name: 'Sarah Williams', role: 'Head of Design', emoji: '👩‍🎨' },
  ];

  return (
    <>
      {/* Hero Section */}
      <Section className="min-h-[60vh] flex items-center">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-neutral-900 mb-6">
              About Kritvia
            </h1>
            <p className="text-xl text-neutral-600">
              We are a technology company dedicated to building innovative solutions that transform businesses and improve lives. Our team of experts combines creativity with technical excellence to deliver exceptional results.
            </p>
          </div>
        </Container>
      </Section>

      {/* Mission & Vision */}
      <Section variant="muted">
        <Container>
          <Grid cols={2} colsMobile={1} gap="xl">
            <div className="bg-white p-8 rounded-2xl shadow-soft">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Our Mission</h2>
              <p className="text-neutral-600">
                To empower businesses with innovative technology solutions that drive growth, efficiency, and competitive advantage in the digital age.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-soft">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Our Vision</h2>
              <p className="text-neutral-600">
                To be the leading provider of transformative technology solutions, known for excellence, innovation, and lasting impact on our clients' success.
              </p>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Values */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Our Values</h2>
          </div>
          <Grid cols={4} colsMobile={1} colsTablet={2} gap="lg">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{value.title}</h3>
                <p className="text-neutral-600">{value.description}</p>
              </div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Team */}
      <Section variant="muted">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Our Team</h2>
            <p className="text-xl text-neutral-600">Meet the experts behind our success</p>
          </div>
          <Grid cols={4} colsMobile={2} colsTablet={2} gap="lg">
            {team.map((member) => (
              <div key={member.name} className="bg-white p-6 rounded-2xl shadow-soft text-center">
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h3 className="text-lg font-semibold text-neutral-900">{member.name}</h3>
                <p className="text-neutral-600">{member.role}</p>
              </div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Join Our Team</h2>
            <p className="text-lg text-neutral-600 mb-8">We're always looking for talented individuals to join our team.</p>
            <Button>View Careers</Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
