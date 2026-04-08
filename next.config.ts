import type { NextConfig } from "next";

const securityHeaders = [
  // Impede que a página seja embutida em iframes (anti-clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Impede MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Controla informações de referência enviadas
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restringe acesso a APIs do browser
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Content Security Policy — restringe origens de scripts, estilos e recursos
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' necessário para Next.js (inline styles/scripts gerados no build)
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      // Todas as chamadas de API passam pelo proxy interno (/api/proxy)
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;