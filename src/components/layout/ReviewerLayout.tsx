
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReviewerSidebar } from "../reviewer/ReviewerSidebar";
import { ReviewerHeader } from "./ReviewerHeader";

interface ReviewerLayoutProps {
  children: React.ReactNode;
}

export function ReviewerLayout({ children }: ReviewerLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ReviewerSidebar />
        <div className="flex-1 flex flex-col">
          <ReviewerHeader />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
