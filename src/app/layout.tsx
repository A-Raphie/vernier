import type { Metadata } from 'next';
import './globals.css';
import { Web3Provider } from '../components/providers/Web3Provider';

export const metadata: Metadata = {
  title: 'Vernier | EVM Transaction Intent Firewall & Pre-Execution Simulation Sandbox',
  description: 'Measure state deltas before your wallet signs. Real-time EVM pre-execution simulation sandbox and storage slot intent firewall.',
  openGraph: {
    title: 'Vernier | EVM Transaction Intent Firewall',
    description: 'Measure state deltas before your wallet signs. Real-time EVM pre-execution simulation sandbox.',
    url: 'https://tryvernier.netlify.app',
    siteName: 'Vernier',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vernier | EVM Transaction Intent Firewall',
    description: 'Stop signing transactions blind. Vernier simulates the damage first in 0.42ms.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#0a0d14] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
