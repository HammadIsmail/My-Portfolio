import Link from "next/link";
import { LayoutDashboard, PlusCircle, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/add-project" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors">
            <PlusCircle className="w-5 h-5" />
            <span>Add Project</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-red-500 hover:text-red-600 hover:bg-red-500/10">
            <LogOut className="w-5 h-5" />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
