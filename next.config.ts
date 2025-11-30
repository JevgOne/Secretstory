import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // devIndicators removed - not supported in Next.js 16
};

export default withNextIntl(nextConfig);
