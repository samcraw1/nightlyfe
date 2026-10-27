/** Small input validators for API routes; kept dependency-free on purpose. */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/;

export function isVenueSlug(value: unknown): value is string {
  return typeof value === "string" && SLUG.test(value);
}

/** Entertainer ids are slugs in demo mode and uuids in production. */
export function isEntityId(value: unknown): value is string {
  return typeof value === "string" && (UUID.test(value) || SLUG.test(value));
}

export function isIdList(value: unknown, max = 50): value is string[] {
  return Array.isArray(value) && value.length <= max && value.every(isEntityId);
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}
