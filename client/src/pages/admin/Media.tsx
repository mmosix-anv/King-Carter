import { useEffect, useState } from 'react';
import { supabase, Media as MediaType } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, Trash2, Copy } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

export default function Media() {
  const { user } = useAdmin();
  const [media, setMedia] = useState<MediaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error: any) {
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = fileName; // Just the filename, bucket already provides the path

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        // Save to database
        const { error: dbError } = await supabase.from('media').insert({
          filename: fileName,
          original_name: file.name,
          storage_path: filePath,
          public_url: publicUrl,
          mime_type: file.type,
          file_size: file.size,
          uploaded_by: user?.id,
        });

        if (dbError) throw dbError;
      }

      toast.success('Files uploaded successfully');
      loadMedia();
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function deleteMedia(item: MediaType) {
    if (!confirm('Delete this file?')) return;

    try {
      await supabase.storage.from('media').remove([item.storage_path]);
      await supabase.from('media').delete().eq('id', item.id);
      toast.success('File deleted');
      loadMedia();
    } catch (error: any) {
      toast.error('Failed to delete file');
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">Manage your images and files</p>
        </div>
        <div>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <Button asChild disabled={uploading}>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Files'}
            </label>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 space-y-2">
              <img
                src={item.public_url}
                alt={item.original_name}
                className="w-full h-32 object-cover rounded"
              />
              <p className="text-sm truncate">{item.original_name}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyUrl(item.public_url)}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteMedia(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {media.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No media files yet</p>
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Upload First File
              </label>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
