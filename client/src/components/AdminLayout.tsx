import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Settings, 
  LogOut,
  Menu,
  Mail,
  Users
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { logout, user } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Services', href: '/admin/services', icon: FileText },
    { name: 'Media', href: '/admin/media', icon: Image },
    { name: 'Contact', href: '/admin/contact-submissions', icon: Mail },
    { name: 'Newsletter', href: '/admin/newsletter', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  async function handleLogout() {
    await logout();
    setLocation('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold">King & Carter</h1>
            <p className="text-sm text-muted-foreground">Admin Portal</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || location.startsWith(item.href + '/');
              return (
                <button
                  key={item.name}
                  onClick={() => setLocation(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="mb-3 px-4">
              <p className="text-sm font-medium">{user?.full_name || user?.email}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-white dark:bg-gray-800 border-b px-6 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
