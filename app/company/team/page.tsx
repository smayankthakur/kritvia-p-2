import { Metadata } from 'next';
import { Container, Section, Grid, Card, CardContent } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Our Team - Kritvia',
  description: 'Meet the talented team behind Kritvia - our leadership, engineers, designers, and experts.',
};

const team = {
  leadership: [
    { name: 'Sarah Chen', role: 'CEO & Co-Founder', bio: 'Former VP at Google with 15+ years in tech leadership.' },
    { name: 'Michael Torres', role: 'CTO & Co-Founder', bio: 'AI researcher and systems architect with deep expertise in distributed computing.' },
    { name: 'Emily Watson', role: 'COO', bio: 'Operational excellence leader from McKinsey & Company.' },
    { name: 'David Kim', role: 'CFO', bio: 'Former investment banker with expertise in tech M&A.' },
  ],
  engineering: [
    { name: 'Alex Johnson', role: 'VP of Engineering', bio: 'Full-stack expert and open-source contributor.' },
    { name: 'Maria Garcia', role: 'Head of AI/ML', bio: 'PhD in Machine Learning from Stanford.' },
    { name: 'James Wilson', role: 'Head of Cloud', bio: 'AWS certified architect with 10+ years experience.' },
    { name: 'Lisa Park', role: 'Head of Security', bio: 'Former security researcher at NSA.' },
  ],
  design: [
    { name: 'Tom Anderson', role: 'Head of Design', bio: 'Award-winning UX designer from Apple.' },
    { name: 'Amy Brown', role: 'Design Director', bio: 'Specialist in enterprise design systems.' },
    { name: 'Chris Lee', role: 'Product Designer', bio: 'Focus on SaaS and B2B products.' },
    { name: 'Jessica Taylor', role: 'UX Researcher', bio: 'Expert in user research and analytics.' },
  ],
};

export default function TeamPage() {
  return (
    <div>
      <Section className="min-h-[50vh] flex items-center pt-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-neutral-900 mb-6">
              Our Team
            </h1>
            <p className="text-xl text-neutral-600">
              We are a diverse team of experts passionate about building transformative technology.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Leadership</h2>
          <Grid cols={4} colsMobile={2} colsTablet={2} gap="lg">
            {team.leadership.map((member) => (
              <Card key={member.name}>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl text-neutral-400">{member.name[0]}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-neutral-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Engineering</h2>
          <Grid cols={4} colsMobile={2} colsTablet={2} gap="lg">
            {team.engineering.map((member) => (
              <Card key={member.name}>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl text-neutral-400">{member.name[0]}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-neutral-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Design</h2>
          <Grid cols={4} colsMobile={2} colsTablet={2} gap="lg">
            {team.design.map((member) => (
              <Card key={member.name}>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl text-neutral-400">{member.name[0]}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-neutral-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>
    </div>
  );
}
