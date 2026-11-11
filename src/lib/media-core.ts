// NEY Media Core client for NEY Animate
// Server-side only: never expose NEY_MEDIA_CORE_SERVICE_KEY in browser code

const CORE_URL = process.env.NEY_MEDIA_CORE_URL || "http://localhost:8080";
const SERVICE_KEY = process.env.NEY_MEDIA_CORE_SERVICE_KEY || "";

function getHeaders(extraHeaders: Record<string, string> = {}) {
  return {
    Authorization: `Bearer ${SERVICE_KEY}`,
    ...extraHeaders,
  };
}

export interface CoreAssetResponse {
  id: string;
  title: string;
  state: "created" | "uploading" | "uploaded" | "processing" | "ready" | "failed" | "cancelled" | "deleted";
  published?: boolean;
  uploadUrl?: string;
  metadata?: Record<string, unknown>;
  error?: { code: string; message: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CorePlaybackResponse {
  assetId: string;
  playlistUrl: string;
  expiresAt: string;
}

/**
 * Create a new asset record in NEY Media Core
 */
export async function createCoreAsset(title: string, idempotencyKey?: string): Promise<{ id: string; uploadUrl: string; state: string }> {
  const headers = getHeaders({ "Content-Type": "application/json" });
  if (idempotencyKey) {
    (headers as Record<string, string>)["Idempotency-Key"] = idempotencyKey;
  }

  const res = await fetch(`${CORE_URL}/api/v1/assets`, {
    method: "POST",
    headers,
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(errorBody.error?.message || `Failed to create asset in Media Core: ${res.status}`);
  }

  return res.json();
}

/**
 * Get status and metadata of an asset from NEY Media Core
 */
export async function getCoreAsset(assetId: string): Promise<CoreAssetResponse> {
  const res = await fetch(`${CORE_URL}/api/v1/assets/${assetId}`, {
    headers: getHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(errorBody.error?.message || `Failed to fetch asset from Media Core: ${res.status}`);
  }

  return res.json();
}

/**
 * Publish an asset so it becomes eligible for authorized playback
 */
export async function publishCoreAsset(assetId: string): Promise<{ id: string; state: string; published: boolean }> {
  const res = await fetch(`${CORE_URL}/api/v1/assets/${assetId}/publish`, {
    method: "POST",
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(errorBody.error?.message || `Failed to publish asset: ${res.status}`);
  }

  return res.json();
}

/**
 * Request an authorized playback grant from NEY Media Core.
 * Returns the playlist URL and the HttpOnly Set-Cookie string to forward to the viewer.
 */
export async function authorizeCorePlayback(assetId: string): Promise<{ data: CorePlaybackResponse; setCookieHeader: string | null }> {
  const res = await fetch(`${CORE_URL}/api/v1/assets/${assetId}/playback`, {
    method: "POST",
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(errorBody.error?.message || `Playback authorization failed: ${res.status}`);
  }

  const data = (await res.json()) as CorePlaybackResponse;
  const setCookieHeader = res.headers.get("set-cookie");

  return { data, setCookieHeader };
}

/**
 * Helper to construct the full playback URL for streaming
 */
export function getCorePublicStreamUrl(relativePlaylistUrl: string): string {
  // If the Core is behind Caddy or public domain, return full absolute URL
  const publicBase = process.env.NEXT_PUBLIC_MEDIA_CORE_URL || CORE_URL;
  return `${publicBase.replace(/\/$/, "")}${relativePlaylistUrl}`;
}
