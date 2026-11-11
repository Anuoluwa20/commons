import '@/styles/site.css';
import '@/styles/variants.css';
import '@/styles/motion.css';
import '@/styles/react.css';
import Shell from '@/components/Shell';

export const metadata = {
  metadataBase: new URL(process.env.COMMONS_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Commons #24: Design in the Age of AI · Thu 4 Dec', template: '%s · Commons' },
  description: 'Commons is a monthly meetup for designers, developers, founders and creatives. Next: Design in the Age of AI, Thu 4 Dec, 6:00 PM, The Warehouse. Free.',
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'website', images: ['/images/og-commons-24.jpg'] },
  twitter: { card: 'summary_large_image' },
};
export const viewport = { themeColor: '#0B0B0C', colorScheme: 'dark', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="js-off">
      <body><Shell>{children}</Shell></body>
    </html>
  );
}
