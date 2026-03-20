/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Extend Window interface for analytics
interface Window {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  fbq?: (...args: unknown[]) => void;
}

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
