import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Mail, Calendar, Download, Search } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  source: string;
  status: 'active' | 'unsubscribed';
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSubscribers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredSubscribers(
        subscribers.filter(sub => 
          sub.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredSubscribers(subscribers);
    }
  }, [searchTerm, subscribers]);

  async function loadSubscribers() {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
      setFilteredSubscribers(data || []);
    } catch (error: any) {
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  }

  function exportToCSV() {
    const csv = [
      ['Email', 'Source', 'Status', 'Subscribed At', 'Unsubscribed At'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.source,
        sub.status,
        new Date(sub.subscribed_at).toLocaleString(),
        sub.unsubscribed_at ? new Date(sub.unsubscribed_at).toLocaleString() : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  const activeCount = subscribers.filter(s => s.status === 'active').length;
  const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
          <p className="text-muted-foreground">Manage your newsletter subscriber list</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-400">{unsubscribedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Subscribers List */}
      {filteredSubscribers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {searchTerm ? 'No subscribers found matching your search' : 'No subscribers yet'}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Subscribers ({filteredSubscribers.length})</CardTitle>
            <CardDescription>
              People who signed up for The Experience notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSubscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{subscriber.email}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                        <span className="text-xs">•</span>
                        <span className="capitalize">{subscriber.source.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={subscriber.status === 'active' ? 'default' : 'secondary'}>
                    {subscriber.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
