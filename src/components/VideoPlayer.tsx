"use client";

import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  slug: string;
  title: string;
  kind?: "feature" | "trailer";
  onClose: () => void;
}

export function VideoPlayer({ slug, title, kind = "feature", onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let hlsInstance: unknown = null;

    async function initPlayer() {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch authorized playback URL and cookie from server route
        const res = await fetch(`/api/media/${encodeURIComponent(slug)}/watch?kind=${encodeURIComponent(kind)}`, {
          method: "POST",
          credentials: "include", // Essential for forwarding the HttpOnly cookie
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.details || json.error || "Unable to authorize playback.");
        }

        const playlistUrl = json.playlistUrl;
        const video = videoRef.current;
        if (!video || !isMounted) return;

        // 2. Load HLS stream via native support (Safari/iOS) or HLS.js
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = playlistUrl;
          video.play().catch(() => {});
          setLoading(false);
        } else {
          // Dynamic import or load from CDN for universal compatibility
          // Check if Hls is already on window or load it
          const Hls = (window as unknown as { Hls?: { isSupported: () => boolean; new (config?: unknown): { loadSource: (src: string) => void; attachMedia: (v: HTMLVideoElement) => void; on: (ev: string, fn: () => void) => void; destroy: () => void } } }).Hls;

          if (Hls && Hls.isSupported()) {
            const hls = new Hls({ xhrSetup: (xhr: XMLHttpRequest) => { xhr.withCredentials = true; } });
            hls.loadSource(playlistUrl);
            hls.attachMedia(video);
            hls.on("hlsManifestParsed", () => {
              if (isMounted) {
                video.play().catch(() => {});
                setLoading(false);
              }
            });
            hlsInstance = hls;
          } else {
            // Load HLS.js dynamically from CDN if not bundled
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
            script.onload = () => {
              const DynamicHls = (window as unknown as { Hls: { isSupported: () => boolean; new (config?: unknown): { loadSource: (src: string) => void; attachMedia: (v: HTMLVideoElement) => void; on: (ev: string, fn: () => void) => void; destroy: () => void } } }).Hls;
              if (DynamicHls && DynamicHls.isSupported()) {
                const hls = new DynamicHls({ xhrSetup: (xhr: XMLHttpRequest) => { xhr.withCredentials = true; } });
                hls.loadSource(playlistUrl);
                hls.attachMedia(video);
                hls.on("hlsManifestParsed", () => {
                  if (isMounted) {
                    video.play().catch(() => {});
                    setLoading(false);
                  }
                });
                hlsInstance = hls;
              } else {
                setError("HLS playback is not supported in this browser.");
                setLoading(false);
              }
            };
            script.onerror = () => {
              setError("Failed to load video player engine.");
              setLoading(false);
            };
            document.head.appendChild(script);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load stream.");
          setLoading(false);
        }
      }
    }

    initPlayer();

    return () => {
      isMounted = false;
      if (hlsInstance && typeof (hlsInstance as { destroy?: () => void }).destroy === "function") {
        (hlsInstance as { destroy: () => void }).destroy();
      }
    };
  }, [slug]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            <h3 className="font-semibold text-white tracking-wide">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
            aria-label="Close player"
          >
            ✕
          </button>
        </div>

        {/* Video Canvas */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 text-sky-400">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
              <p className="text-sm font-medium">Connecting to NEY Media Core...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/95 p-6 text-center">
              <span className="text-4xl">⚠️</span>
              <h4 className="text-lg font-bold text-white">Stream Not Ready</h4>
              <p className="max-w-md text-sm text-slate-400">{error}</p>
              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 text-xs text-slate-300">
                To test playback, upload this film to your running <code>ney-media-core</code> or use the studio direct-upload API.
              </div>
              <button
                onClick={onClose}
                className="mt-2 rounded-full bg-sky-500 px-6 py-2 text-xs font-semibold text-black hover:bg-sky-400"
              >
                Back to details
              </button>
            </div>
          )}

          <video
            ref={videoRef}
            controls
            playsInline
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
