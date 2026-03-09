import { Metadata } from 'next';
import { Container, Section, Grid, Card, CardContent, Button } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Careers - Kritvia',
  description: 'Join the Kritvia team and help build the future of technology. Explore career opportunities.',
};

const benefits = [
  { title: 'Competitive Salary', emoji: '💰', description: 'Industry-leading compensation packages' },
  { title: 'Health Insurance', emoji: '🏥', description: 'Comprehensive health, dental, and vision coverage' },
  { title: 'Remote Work', emoji: '🏠', description: 'Flexible work-from-anywhere policy' },
  { title: 'Learning Budget', emoji: '📚', description: 'Annual learning and development budget' },
  { title: '401k Match', emoji: '💼', description: 'Generous retirement savings match' },
  { title: 'Unlimited PTO', emoji: '🌴', description: 'Take the time you need to recharge' },
];

const openings = [
  {
    title: 'Senior Full-Stack Developer',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build scalable web applications using Next.js, TypeScript, and cloud technologies.',
  },
  {
    title: 'Machine Learning Engineer',
    location: 'Remote',
    type: 'Full-time',
    description: 'Design and implement ML models for our AI-powered products.',
  },
  {
    title: 'DevOps Engineer',
    location: 'Remote',
    type: 'Full-time',
    description: 'Manage cloud infrastructure and CI/CD pipelines at scale.',
  },
  {
    title: 'Product Designer',
    location: 'Remote',
    type: 'Full-time',
    description: 'Create beautiful, intuitive user interfaces for our products.',
  },
];

export default function CareersPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="min-h-[50vh] flex items-center">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-neutral-900 mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-neutral-600">
              Help us build the future of technology. We're looking for talented individuals who share our passion for innovation.
            </p>
          </div>
        </Container>
      </Section>

      {/* Benefits */}
      <Section variant="muted">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Why Kritvia?</h2>
            <p className="text-xl text-neutral-600">We offer competitive benefits to support your growth and well-being</p>
          </div>
          <Grid cols={3} colsMobile={1} colsTablet={2} gap="lg">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{benefit.emoji}</div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{benefit.title}</h3>
                  <p className="text-neutral-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Openings */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Open Positions</h2>
            <p className="text-xl text-neutral-600">Find your next role at Kritvia</p>
          </div>
          <div className="space-y-4">
            {openings.map((job) => (
              <Card key={job.title} hover>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">{job.title}</h3>
                      <p className="text-neutral-600 mb-2">{job.description}</p>
                      <div className="flex gap-4 text-sm text-neutral-500">
                        <span>{job.location}</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <Button>Apply Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
