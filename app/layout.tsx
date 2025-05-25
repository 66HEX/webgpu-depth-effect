import type { Metadata } from 'next';
import './globals.css';
import Page from './page';

export const metadata: Metadata = {
  title: 'Scanning effect with depth map',
  description: 'Scanning effect with depth map',
};

export default function RootLayout({
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className="text-white">
        <Page />
      </body>
    </html>
  );
}
