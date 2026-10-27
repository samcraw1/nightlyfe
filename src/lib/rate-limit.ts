import "server-only";

/**
 * Fixed-window rate limiter for mutation routes.
 *
 * In-memory, so it is per server instance: enough to blunt accidental loops
 * and casual abuse on a single Vercel function, not a substitute for an edge
 * rate limit or WAF in production (see DIGITAL_STAGE_SETUP.md, Security).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const g = globalThis as unknown as { __stageRateBuckets?: Map<string, Bucket> };
const buckets = (g.__stageRateBuckets ??= new Map<string, Bucket>());

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }
    return { ok: true, retryAfterSec: 0 };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSec: 0 };
}

export function clientKey(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : request.headers.get("x-real-ip")) ?? "local";
}
