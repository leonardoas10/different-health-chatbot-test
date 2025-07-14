/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";
import { i18n } from "./next-i18next.config.mjs";
import { LocalesService } from "./src/locales/Locales.service.mjs";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  i18n,

  transpilePackages: ["@mui/x-charts"],

  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],

  async rewrites() {
    return [
      ...LocalesService.getRewrites(),
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
      {
        source: "/static-content-sitemap.xml",
        destination: "/api/sitemap/static-content-sitemap",
      },
    ];
  },
};

export default nextConfig;
