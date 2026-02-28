import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { supabase, Service } from '@/lib/supabase';
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

export default function ServiceEditor() {
  const [, params] = useRoute('/admin/services/:id');
  const [, setLocation] = useLocation();
  const { user } = useAdmin();
  const isNew = params?.id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    slug: '',
    tagline: '',
    hero_image: '',
    description: [''],
    highlights: [''],
    cta: {
      text: '',
      buttonLabel: '',
      buttonUrl: '/contact',
    },
    status: 'draft',
    display_order: 0,
  });

  useEffect(() => {
    if (!isNew && params?.id) {
      loadService(params.id);
    }
  }, [params?.id, isNew]);

  async function loadService(id: string) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setFormData(data);
    } catch (error: any) {
      toast.error('Failed to load service');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const serviceData = {
        ...formData,
        updated_by: user?.id,
        ...(isNew && { id: formData.slug, created_by: user?.id }),
      };

      const { error } = isNew
        ? await supabase.from('services').insert(serviceData)
        : await supabase.from('services').update(serviceData).eq('id', params?.id);

      if (error) throw error;

      toast.success(isNew ? 'Service created' : 'Service updated');
      setLocation('/admin/services');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  }

  function updateField(field: keyof Service, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function addArrayItem(field: 'description' | 'highlights') {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ''],
    }));
  }

  function updateArrayItem(field: 'description' | 'highlights', index: number, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).map((item, i) => (i === index ? value : item)),
    }));
  }

  function removeArrayItem(field: 'description' | 'highlights', index: number) {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/admin/services')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isNew ? 'New Service' : 'Edit Service'}</h1>
          <p className="text-muted-foreground">Configure service page details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Service title and identification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  updateField('title', e.target.value);
                  if (isNew) {
                    updateField('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                  }
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                disabled={!isNew}
                required
              />
              <p className="text-sm text-muted-foreground">
                URL: /services/{formData.slug}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline || ''}
                onChange={(e) => updateField('tagline', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => updateField('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
                  onChange={(e) => updateField('display_order', parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero Image</CardTitle>
            <CardDescription>Main image for the service page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="hero_image">Image URL</Label>
                <Input
                  id="hero_image"
                  value={formData.hero_image || ''}
                  onChange={(e) => updateField('hero_image', e.target.value)}
                  placeholder="/path/to/image.jpg"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMediaPickerOpen(true)}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Browse Media
                </Button>
              </div>
            </div>
            {formData.hero_image && (
              <div className="relative">
                <img
                  src={formData.hero_image}
                  alt="Hero preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => updateField('hero_image', '')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Description</CardTitle>
                <CardDescription>Service description paragraphs</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('description')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Paragraph
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(formData.description || []).map((para, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={para}
                  onChange={(e) => updateArrayItem('description', index, e.target.value)}
                  placeholder="Enter description paragraph"
                  rows={3}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('description', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Highlights</CardTitle>
                <CardDescription>Key features and benefits</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('highlights')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Highlight
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(formData.highlights || []).map((highlight, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={highlight}
                  onChange={(e) => updateArrayItem('highlights', index, e.target.value)}
                  placeholder="Enter highlight"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('highlights', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call to Action</CardTitle>
            <CardDescription>CTA section at the bottom of the page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cta_text">CTA Text</Label>
              <Input
                id="cta_text"
                value={formData.cta?.text || ''}
                onChange={(e) => updateField('cta', { ...formData.cta, text: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_button">Button Label</Label>
              <Input
                id="cta_button"
                value={formData.cta?.buttonLabel || ''}
                onChange={(e) => updateField('cta', { ...formData.cta, buttonLabel: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_url">Button URL</Label>
              <Input
                id="cta_url"
                value={formData.cta?.buttonUrl || ''}
                onChange={(e) => updateField('cta', { ...formData.cta, buttonUrl: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Service'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setLocation('/admin/services')}>
            Cancel
          </Button>
        </div>
      </form>

      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => updateField('hero_image', url)}
        currentImage={formData.hero_image || ''}
      />
    </div>
  );
}
