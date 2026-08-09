import * as Sentry from "@sentry/react";

const SENTRY_DSN =
  import.meta.env.VITE_SENTRY_DSN ??
  "https://e0fcba13eb02f87ad6adf75d1f282dbd@o4511872757465088.ingest.us.sentry.io/4511872824508416";

export function initSentry() {
  if (!SENTRY_DSN) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    sendDefaultPii: false,
  });
}

export { Sentry };
