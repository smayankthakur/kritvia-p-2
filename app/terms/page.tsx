import { Metadata } from 'next';
import { Container, Section } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Terms of Service - Kritvia',
  description: 'Kritvia Terms of Service - Learn about the terms and conditions governing your use of our website and services.',
};

export default function TermsPage() {
  return (
    <Section>
      <Container size="md">
        <div className="prose prose-lg max-w-none">
          <h1>Terms of Service</h1>
          <p className="text-neutral-600">Last updated: January 1, 2024</p>

          <h2>Agreement to Terms</h2>
          <p>
            By accessing or using our Website, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            The Service and its original content, features and functionality are and will remain the exclusive property of Kritvia and its licensors.
          </p>

          <h2>User Accounts</h2>
          <p>
            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>

          <h2>User Content</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post on or through the Service.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            In no event shall Kritvia, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at hello@kritvia.com.
          </p>
        </div>
      </Container>
    </Section>
  );
}
