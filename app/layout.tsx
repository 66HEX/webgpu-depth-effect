import type { Metadata } from 'next';
import localFont from 'next/font/local'
import './globals.css';
import Page from './page';

const octo = localFont({
  src: '../assets/fonts/tt-octo.ttf',
  variable: '--font-octo',
})

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
      <body className={`${octo.variable} antialiased`}>
        <Page />
      </body>
    </html>
  );
}
