'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart,
  Settings, LogOut, ChevronLeft, Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/use-admin';
import { useState } from 'react';

const navItems = [
  { name: 'Sections', href: '/admin/sections', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const pathname = usePathname();
  const { signOut, session } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] border-r border-white/5 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold">P</span>
            <span className="font-bold text-lg">PureScoop</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-white/10 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}>
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="text-xs text-white/40 mb-2 truncate">{session?.user?.email}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="w-full justify-start text-white/60 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full justify-start text-white/60 hover:text-white mt-1">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/5 bg-[#1A1A1A]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4 p-1.5 hover:bg-white/10 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 text-white/80">
              <ChevronLeft className="w-4 h-4 mr-2" />
              View Site
            </Button>
          </Link>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
