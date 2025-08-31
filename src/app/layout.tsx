import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SimSuite - Network Simulation Platform',
  description: 'Advanced network simulation and scenario management platform with AI-powered generation and 3D visualization',
  keywords: ['network simulation', 'OPNET', 'MONET', 'scenario generation', 'AI', '3D mapping'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://cesium.com/downloads/cesiumjs/releases/1.132/Build/Cesium/Cesium.js" defer></script>
        <link href="https://cesium.com/downloads/cesiumjs/releases/1.132/Build/Cesium/Widgets/widgets.css" rel="stylesheet" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <div className="min-h-screen bg-background">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}