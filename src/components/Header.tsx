'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Cross, Church, Menu, User } from 'lucide-react';
import Image from 'next/image';

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Find Events' },
    { href: '/organizers', label: 'Organizers' },
    { href: '/resources', label: 'Resources' },
    { href: '/testimonies', label: 'Testimonies' },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md py-2 transition-all duration-300">
      <div className="container mx-auto flex h-15 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">

          <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
        </Link>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors hover:text-primary ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center space-x-4">
          <Button size="icon" variant="ghost" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/20 transition-colors">
            <User className="h-6 w-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
