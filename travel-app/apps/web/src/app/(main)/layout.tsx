import { Header } from "@/components/shared/header";
import { AppSidebar } from "@/components/shared/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen w-full">
        <Header />

        <div className="flex">
          <AppSidebar />

          <main className="min-w-0 flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}