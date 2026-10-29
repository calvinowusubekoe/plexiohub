export type AnalyticsEvent = 'quote_submitted' | 'whatsapp_click' | 'quote_started';

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string>) => void };
  }
}

/** Sends a custom event to Umami if it is loaded; otherwise does nothing. */
export function track(event: AnalyticsEvent, data?: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  try {
    window.umami?.track(event, data);
  } catch {
    // Analytics must never break the page.
  }
}
