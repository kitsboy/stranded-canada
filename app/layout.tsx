<<<<<<< HEAD
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stranded Canada — Methane Leak Map',
  description: 'Canadian methane leak sites mapped for Bitcoin mining opportunities. Fix the money, fix the world.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
=======
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stranded Canada | GiveAbit',
  description: 'Mapping stranded methane opportunities across Canada for Bitcoin mining',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
>>>>>>> origin/local-preservation
