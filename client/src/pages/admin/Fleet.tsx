import { useEffect, useState } from 'react';
import { supabase, FleetVehicle } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function Fleet() {
  const [, setLocation] = useLocation();
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadVehicles(); }, []);

  async function loadVehicles() {
    try {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setVehicles(data || []);
    } catch {
      toast.error('Failed to load fleet vehicles');
    } finally {
      setLoading(false);
    }
  }

  async function deleteVehicle(id: string) {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const { error } = await supabase.from('fleet_vehicles').delete().eq('id', id);
      if (error) throw error;
      toast.success('Vehicle deleted');
      loadVehicles();
    } catch {
      toast.error('Failed to delete vehicle');
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fleet</h1>
          <p className="text-muted-foreground">Manage your fleet vehicles</p>
        </div>
        <Button onClick={() => setLocation('/admin/fleet/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Vehicle
        </Button>
      </div>

      <div className="grid gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-start">
                  {vehicle.image && (
                    <img src={vehicle.image} alt={vehicle.name} className="w-24 h-16 object-cover rounded" />
                  )}
                  <div className="space-y-1">
                    <CardTitle>{vehicle.name}</CardTitle>
                    <CardDescription>{vehicle.category} · {vehicle.passengers} passengers</CardDescription>
                  </div>
                </div>
                <Badge variant={vehicle.status === 'published' ? 'default' : 'secondary'}>
                  {vehicle.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.open('/fleet', '_blank')}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => setLocation(`/admin/fleet/${vehicle.id}`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => deleteVehicle(vehicle.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {vehicles.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No vehicles yet</p>
              <Button onClick={() => setLocation('/admin/fleet/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Vehicle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
