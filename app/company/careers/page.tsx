import { Metadata } from 'next';
import { Container, Section, Grid, Card, CardContent, Button } from '@/components/ui';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Careers - Kritvia',
  description: 'Join Kritvia and help build the future of enterprise technology. Explore open positions.',
};

const benefits = [
  { title: 'Competitive Salary', description: 'Industry-leading compensation packages.' },
  { title: 'Remote-First', description: 'Work from anywhere in the world.' },
  { title: 'Health Insurance', description: 'Comprehensive medical, dental, and vision.' },
  { title: '401(k) Match', description: 'Generous retirement matching program.' },
  { title: 'Unlimited PTO', description: 'Take time when you need it.' },
  { title: 'Learning Budget', description: '$5,000 annual professional development.' },
];

const openings = [
  { department: 'Engineering', title: 'Senior Full-Stack Engineer', location: 'Remote', type: 'Full-time' },
  { department: 'Engineering', title: 'Machine Learning Engineer', location: 'Remote', type: 'Full-time' },
  { department: 'Engineering', title: 'Cloud Architect', location: 'Remote', type: 'Full-time' },
  { department: 'Design', title: 'Senior Product Designer', location: 'Remote', type: 'Full-time' },
  { department: 'Product', title: 'Product Manager', location: 'Remote', type: 'Full-time' },
  { department: 'Sales', title: 'Enterprise Account Executive', location: 'San Francisco, CA', type: 'Full-time' },
];

export default function CareersPage() {
  return (
    <div>
      <Section className="min-h-[50vh] flex items-center pt-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-neutral-900 mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Help us build the future of enterprise technology. We are looking for passionate people to join our mission.
            </p>
            <Button size="lg">View Open Positions</Button>
          </div>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Why Kritvia?</h2>
          <Grid cols={3} colsMobile={1} colsTablet={2} gap="lg">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{benefit.title}</h3>
                  <p className="text-neutral-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Open Positions</h2>
          <div className="space-y-4">
            {openings.map((job, i) => (
              <Card key={i} hover>
                <CardContent className="p-6 flex justify-between items-center flex-col md:flex-row gap-4">
                  <div>
                    <span className="text-xs font-medium text-primary-600 mb-1 block">{job.department}</span>
                    <h3 className="text-lg font-semibold text-neutral-900">{job.title}</h3>
                    <p className="text-neutral-500 text-sm">{job.location} • {job.type}</p>
                  </div>
                  <Button variant="outline">Apply Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="text-center bg-primary-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Do not see a role for you?</h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-xl mx-auto">
              We are always looking for exceptional talent. Send us your resume and we will reach out when the right position opens.
            </p>
            <Button size="lg">Submit Your Resume</Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
