import { Header } from '@/components/Header';
import { Church } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <footer className="border-t border-primary/5 py-6 bg-card">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
            </Link>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Connecting the body of Christ through powerful spiritual gatherings and community engagement.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">About</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Contact</Link>
          </div>
          <p className="mt-8 text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Revival Locator. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
