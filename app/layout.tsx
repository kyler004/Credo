import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Credo - Elevate Your Finances',
  description: 'Credo financial education platform landing page featuring interactive 3D animations, course exploration, and financial mastery tools.',
  openGraph: {
    title: 'Credo - Elevate Your Finances',
    description: 'Credo financial education platform landing page featuring interactive 3D animations, course exploration, and financial mastery tools.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Credo - Elevate Your Finances',
    description: 'Credo financial education platform landing page featuring interactive 3D animations, course exploration, and financial mastery tools.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
