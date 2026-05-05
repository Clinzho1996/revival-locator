import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Separator } from '@/components/ui/separator';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />
        <SidebarInset className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-primary/5 px-4 sticky top-0 bg-background/80 backdrop-blur-md z-30">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2 px-2">
              <span className="text-sm font-medium text-muted-foreground">Dashboard</span>
              <span className="text-sm font-medium text-muted-foreground/40">/</span>
              <span className="text-sm font-medium">Overview</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 md:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
