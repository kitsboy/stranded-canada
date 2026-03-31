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
