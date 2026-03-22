import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { supabase, FleetVehicle } from '@/lib/supabase';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, ArrowLeft, Plus, X, Image as ImageIcon } from 'lucide-react';
import MediaPicker from '@/components/MediaPicker';

export default function FleetEditor() {
  const [, params] = useRoute('/admin/fleet/:id');
  const [, setLocation] = useLocation();
  const { user } = useAdmin();
  const isNew = params?.id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<FleetVehicle>>({
    name: '',
    category: '',
    description: '',
    passengers: '',
    luggage: '',
    amenities: [''],
    image: '',
    status: 'draft',
    display_order: 0,
  });

  useEffect(() => {
    if (!isNew && params?.id) loadVehicle(params.id);
  }, [params?.id, isNew]);

  async function loadVehicle(id: string) {
    try {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      setFormData(data);
    } catch {
      toast.error('Failed to load vehicle');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const vehicleData = {
        ...formData,
        amenities: formData.amenities?.filter(a => a.trim() !== '') || [],
        updated_by: user?.id,
        ...(isNew && {
          id: formData.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          created_by: user?.id,
        }),
      };

      const { error } = isNew
        ? await supabase.from('fleet_vehicles').insert(vehicleData)
        : await supabase.from('fleet_vehicles').update(vehicleData).eq('id', params?.id);

      if (error) throw error;
      toast.success(isNew ? 'Vehicle created' : 'Vehicle updated');
      setLocation('/admin/fleet');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save vehicle');
    } finally {
      setSaving(false);
    }
  }

  function updateField(field: keyof FleetVehicle, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function addAmenity() {
    setFormData(prev => ({ ...prev, amenities: [...(prev.amenities || []), ''] }));
  }

  function updateAmenity(index: number, value: string) {
    setFormData(prev => ({
      ...prev,
      amenities: (prev.amenities || []).map((a, i) => i === index ? value : a),
    }));
  }

  function removeAmenity(index: number) {
    setFormData(prev => ({
      ...prev,
      amenities: (prev.amenities || []).filter((_, i) => i !== index),
    }));
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/admin/fleet')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isNew ? 'New Vehicle' : 'Edit Vehicle'}</h1>
          <p className="text-muted-foreground">Configure fleet vehicle details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Vehicle name, category and visibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vehicle Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => updateField('name', e.target.value)}
                placeholder="e.g. 2026 Cadillac Escalade"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={e => updateField('category', e.target.value)}
                placeholder="e.g. Executive SUV"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passengers">Passengers</Label>
                <Input
                  id="passengers"
                  value={formData.passengers}
                  onChange={e => updateField('passengers', e.target.value)}
                  placeholder="e.g. 6"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="luggage">Luggage</Label>
                <Input
                  id="luggage"
                  value={formData.luggage}
                  onChange={e => updateField('luggage', e.target.value)}
                  placeholder="e.g. Up to 6"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={v => updateField('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={e => updateField('display_order', parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Image</CardTitle>
            <CardDescription>Main image shown on the fleet page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image || ''}
                  onChange={e => updateField('image', e.target.value)}
                  placeholder="/images/fleet-escalade-ext.jpg"
                />
              </div>
              <div className="flex items-end">
                <Button type="button" variant="outline" onClick={() => setMediaPickerOpen(true)}>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Browse Media
                </Button>
              </div>
            </div>
            {formData.image && (
              <div className="relative">
                <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                <Button
                  type="button" variant="destructive" size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => updateField('image', '')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>Experience-focused vehicle description</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.description || ''}
              onChange={e => updateField('description', e.target.value)}
              placeholder="Describe the vehicle experience..."
              rows={4}
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Amenities</CardTitle>
                <CardDescription>Features and inclusions</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addAmenity}>
                <Plus className="h-4 w-4 mr-2" />
                Add Amenity
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {(formData.amenities || []).map((amenity, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={amenity}
                  onChange={e => updateAmenity(index, e.target.value)}
                  placeholder="e.g. Complimentary Wi-Fi"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeAmenity(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Vehicle'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setLocation('/admin/fleet')}>
            Cancel
          </Button>
        </div>
      </form>

      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={url => updateField('image', url)}
        currentImage={formData.image || ''}
      />
    </div>
  );
}
