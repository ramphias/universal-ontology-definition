import type { NextConfig } from "next";

// Build-time fallback for NEXTAUTH_URL. next-auth/utils/parse-url.js calls
// `new URL("")` if NEXTAUTH_URL is an empty string (Netlify declares the env
// in netlify.toml so the build sees `""` rather than `undefined`), which
// crashes prerender of `/_not-found`. Runtime env (Netlify per-deploy URL)
// takes precedence — this only kicks in when the var is unset/empty.
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = "http://localhost:3000";
}

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            // Restored unsafe-inline to style-src (Required for Next.js React hydration)
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://avatars.githubusercontent.com; base-uri 'self'; object-src 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
