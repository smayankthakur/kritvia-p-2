import { Metadata } from 'next';
import { Container, Section } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Privacy Policy - Kritvia',
  description: 'Kritvia Privacy Policy - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <Section>
      <Container size="md">
        <div className="prose prose-lg max-w-none">
          <h1>Privacy Policy</h1>
          <p className="text-neutral-600">Last updated: January 1, 2024</p>

          <h2>Introduction</h2>
          <p>
            At Kritvia, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our products and services.
          </p>

          <h2>Information We Collect</h2>
          <p>We may collect personal information that you voluntarily provide to us when you:</p>
          <ul>
            <li>Register on the Website</li>
            <li>Express an interest in obtaining information about us or our products and services</li>
            <li>Participate in activities on the Website</li>
            <li>Contact us</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>

          <h2>Information Sharing</h2>
          <p>We only share information with the following third parties:</p>
          <ul>
            <li>Cloud computing services</li>
            <li>Data analytics services</li>
            <li>Communication & collaboration services</li>
          </ul>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Request access to your personal information</li>
            <li>Request correction or deletion of your personal information</li>
            <li>Object to processing of your personal information</li>
            <li>Request restriction of processing your personal information</li>
            <li>Request transfer of your personal information</li>
            <li>Withdraw your consent</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            If you have questions or comments about this policy, you may email us at hello@kritvia.com.
          </p>
        </div>
      </Container>
    </Section>
  );
}
