import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vernier — EVM Transaction Intent Firewall & Pre-Execution Simulation Sandbox',
  description: 'Measure state deltas before your wallet signs. Real-time EVM pre-execution simulation sandbox and storage slot intent firewall.',
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
        {children}
      </body>
    </html>
  );
}
