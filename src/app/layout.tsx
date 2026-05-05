import { Poppins } from 'next/font/google';
import { Header } from '@/components/Header';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased font-sans`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}