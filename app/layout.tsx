import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Ripple By SUBHRA BISWAS — Microblogging Platform',
  description:
    'Instant anonymous microblogging space created by SUBHRA BISWAS. No login, sign up, or authentication required.',
  keywords: ['Ripple', 'SUBHRA BISWAS', 'microblog', 'realtime', 'nextjs', 'supabase'],
  authors: [{ name: 'SUBHRA BISWAS' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-text-main min-h-screen selection:bg-primary/20 selection:text-primary font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
