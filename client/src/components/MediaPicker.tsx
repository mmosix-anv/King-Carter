import { useState, useEffect } from 'react';
import { supabase, Media } from '@/lib/supabase';
import { useAdmin } from '@/contexts/AdminContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Upload, Check } from 'lucide-react';

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentImage?: string;
}

export default function MediaPicker({ open, onClose, onSelect, currentImage }: MediaPickerProps) {
  const { user } = useAdmin();
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(currentImage || '');
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    if (open) {
      loadMedia();
      setSelectedUrl(currentImage || '');
    }
  }, [open, currentImage]);

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
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName; // Just the filename, bucket already provides the path

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message || 'Upload failed');
      }

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

      toast.success('File uploaded successfully');
      setSelectedUrl(publicUrl);
      loadMedia();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed. Make sure the "media" bucket exists in Supabase Storage.');
    } finally {
      setUploading(false);
    }
  }

  async function handleUrlUpload() {
    if (!urlInput.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setUploading(true);

    try {
      // Fetch the image from URL
      const response = await fetch(urlInput);
      if (!response.ok) throw new Error('Failed to fetch image from URL');

      const blob = await response.blob();
      const fileExt = urlInput.split('.').pop()?.split('?')[0] || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName; // Just the filename, bucket already provides the path

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, blob);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message || 'Upload failed');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase.from('media').insert({
        filename: fileName,
        original_name: urlInput.split('/').pop()?.split('?')[0] || fileName,
        storage_path: filePath,
        public_url: publicUrl,
        mime_type: blob.type,
        file_size: blob.size,
        uploaded_by: user?.id,
      });

      if (dbError) throw dbError;

      toast.success('Image uploaded from URL successfully');
      setSelectedUrl(publicUrl);
      setUrlInput('');
      loadMedia();
    } catch (error: any) {
      console.error('URL upload error:', error);
      toast.error(error.message || 'Failed to upload from URL. Make sure the "media" bucket exists in Supabase Storage.');
    } finally {
      setUploading(false);
    }
  }

  function handleSelect() {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select or Upload Image</DialogTitle>
          <DialogDescription>
            Choose an existing image or upload a new one
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="library" className="flex-1 flex flex-col overflow-hidden">
          <TabsList>
            <TabsTrigger value="library">Media Library</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="url">Upload from URL</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex-1 overflow-auto mt-4">
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : media.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No media files yet. Upload your first image.
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {media.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedUrl(item.public_url)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      selectedUrl === item.public_url
                        ? 'border-primary ring-2 ring-primary'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={item.public_url}
                      alt={item.original_name}
                      className="w-full h-full object-cover"
                    />
                    {selectedUrl === item.public_url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Check className="h-8 w-8 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="flex-1 mt-4">
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <Input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">
                    {uploading ? 'Uploading...' : 'Click to upload'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </label>
            </div>

            {selectedUrl && (
              <div className="mt-6">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <img
                  src={selectedUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="url" className="flex-1 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url-input">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={uploading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleUrlUpload();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleUrlUpload}
                    disabled={uploading || !urlInput.trim()}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter a URL to download and upload the image to your media library
                </p>
              </div>

              {selectedUrl && (
                <div>
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <img
                    src={selectedUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedUrl}>
            Select Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
