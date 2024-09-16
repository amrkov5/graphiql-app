'use client';

export default function GlobalError({}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="globalError">
          <h2>Something went wrong!</h2>
          <button
            className="globalErrorButton"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
