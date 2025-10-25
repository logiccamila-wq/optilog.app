/* Simple integration publisher for CRUD events.
 * It posts event envelopes to a configured Spring Integration HTTP gateway.
 */

export type CrudEvent = {
  entity: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp?: string;
  source?: string;
};

const DEFAULT_ENDPOINT = 'http://localhost:8084/events';

export async function publishEvent(event: CrudEvent): Promise<void> {
  const endpoint =
    process.env.INTEGRATION_GATEWAY_URL || process.env.INTEGRATION_ENDPOINT || DEFAULT_ENDPOINT;
  // If endpoint is disabled or empty, silently skip
  if (!endpoint) return;

  const envelope: CrudEvent = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
    source: event.source || 'optilog-app',
  };

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const appKey = process.env.INTEGRATION_APP_KEY;
    if (appKey) headers['X-App-Key'] = appKey;

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(envelope),
    });
    // Do not throw on non-200; we log but keep request flow resilient
    if (!resp.ok) {
      // optional: consume response text to avoid Node warnings
      try {
        await resp.text();
      } catch {
        // Ignore text parsing errors
      }
    }
  } catch (err) {
    // Swallow errors intentionally to avoid breaking API flows
    // You can add a logger here if needed
  }
}
