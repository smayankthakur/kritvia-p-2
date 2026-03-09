'use client';

import { Button } from '@/components/ui';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Something went wrong
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
            We apologize for the inconvenience. Please try again or contact support if the problem persists.
          </p>
          {error.digest && (
            <p className="text-sm text-neutral-500 mb-4">
              Error ID: {error.digest}
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <Button onClick={() => reset()}>
              Try again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Go home
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
