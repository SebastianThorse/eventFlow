import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1 py-8">
        <div className="flex justify-center">
          {children}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
