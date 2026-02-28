import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Image, Settings, BarChart } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    services: 0,
    media: 0,
    recentActivity: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const [servicesRes, mediaRes, auditRes] = await Promise.all([
      supabase.from('services').select('id', { count: 'exact', head: true }),
      supabase.from('media').select('id', { count: 'exact', head: true }),
      supabase.from('audit_log').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    ]);

    setStats({
      services: servicesRes.count || 0,
      media: mediaRes.count || 0,
      recentActivity: auditRes.count || 0,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the King & Carter CMS</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.services}</div>
            <p className="text-xs text-muted-foreground">Active service pages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Files</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.media}</div>
            <p className="text-xs text-muted-foreground">Uploaded images</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">Actions this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configuration</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">System status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/admin/services/new" className="block p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="font-medium">Create New Service</div>
              <div className="text-sm text-muted-foreground">Add a new service page</div>
            </a>
            <a href="/admin/media" className="block p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="font-medium">Upload Media</div>
              <div className="text-sm text-muted-foreground">Add images to library</div>
            </a>
            <a href="/admin/settings" className="block p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="font-medium">Site Settings</div>
              <div className="text-sm text-muted-foreground">Configure site options</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Info</CardTitle>
            <CardDescription>Platform details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">CMS Version</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Database</span>
              <span className="text-sm font-medium">Supabase PostgreSQL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Storage</span>
              <span className="text-sm font-medium">Supabase Storage</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
