import { useEffect, useState } from 'react';
import { supabase, SiteConfig } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [general, setGeneral] = useState<any>({});
  const [seoDefaults, setSeoDefaults] = useState<any>({});
  const [contact, setContact] = useState<any>({});
  const [mail, setMail] = useState<any>({});

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .in('key', ['general', 'seo_defaults', 'contact', 'mail']);

      if (error) throw error;

      data?.forEach((config) => {
        if (config.key === 'general') setGeneral(config.value);
        if (config.key === 'seo_defaults') setSeoDefaults(config.value);
        if (config.key === 'contact') setContact(config.value);
        if (config.key === 'mail') setMail(config.value);
      });
    } catch (error: any) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings(key: string, value: any) {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({ key, value });

      if (error) throw error;
      toast.success('Settings saved');
    } catch (error: any) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground">Configure your site options</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO Defaults</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="mail">Mail</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic site information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input
                  value={general.siteName || ''}
                  onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Site URL</Label>
                <Input
                  value={general.siteUrl || ''}
                  onChange={(e) => setGeneral({ ...general, siteUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={general.companyName || ''}
                  onChange={(e) => setGeneral({ ...general, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input
                  value={general.tagline || ''}
                  onChange={(e) => setGeneral({ ...general, tagline: e.target.value })}
                />
              </div>
              <Button onClick={() => saveSettings('general', general)} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Defaults</CardTitle>
              <CardDescription>Default SEO settings for all pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Title</Label>
                <Input
                  value={seoDefaults.defaultTitle || ''}
                  onChange={(e) => setSeoDefaults({ ...seoDefaults, defaultTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Default Description</Label>
                <Textarea
                  value={seoDefaults.defaultDescription || ''}
                  onChange={(e) => setSeoDefaults({ ...seoDefaults, defaultDescription: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Default Keywords (comma-separated)</Label>
                <Textarea
                  value={seoDefaults.defaultKeywords?.join(', ') || ''}
                  onChange={(e) => setSeoDefaults({ ...seoDefaults, defaultKeywords: e.target.value.split(',').map(k => k.trim()) })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Twitter Handle</Label>
                <Input
                  value={seoDefaults.twitterHandle || ''}
                  onChange={(e) => setSeoDefaults({ ...seoDefaults, twitterHandle: e.target.value })}
                  placeholder="@username"
                />
              </div>
              <Button onClick={() => saveSettings('seo_defaults', seoDefaults)} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                Save SEO Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Contact details displayed on the site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={contact.email || ''}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={contact.phone || ''}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Hours</Label>
                <Input
                  value={contact.hours || ''}
                  onChange={(e) => setContact({ ...contact, hours: e.target.value })}
                />
              </div>
              <Button onClick={() => saveSettings('contact', contact)} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                Save Contact Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mail" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mail Configuration</CardTitle>
              <CardDescription>Configure email settings for contact form submissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications when users submit the contact form
                  </p>
                </div>
                <Switch
                  checked={mail.enabled || false}
                  onCheckedChange={(checked) => setMail({ ...mail, enabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Resend API Key</Label>
                <Input
                  type="password"
                  value={mail.resendApiKey || ''}
                  onChange={(e) => setMail({ ...mail, resendApiKey: e.target.value })}
                  placeholder="re_..."
                />
                <p className="text-sm text-muted-foreground">
                  Get your API key from <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">resend.com/api-keys</a>
                </p>
              </div>

              <div className="space-y-2">
                <Label>From Email</Label>
                <Input
                  type="email"
                  value={mail.fromEmail || ''}
                  onChange={(e) => setMail({ ...mail, fromEmail: e.target.value })}
                  placeholder="noreply@yourdomain.com"
                />
                <p className="text-sm text-muted-foreground">
                  Must be a verified domain in Resend
                </p>
              </div>

              <div className="space-y-2">
                <Label>From Name</Label>
                <Input
                  value={mail.fromName || ''}
                  onChange={(e) => setMail({ ...mail, fromName: e.target.value })}
                  placeholder="King & Carter Premier"
                />
              </div>

              <div className="space-y-2">
                <Label>To Email</Label>
                <Input
                  type="email"
                  value={mail.toEmail || ''}
                  onChange={(e) => setMail({ ...mail, toEmail: e.target.value })}
                  placeholder="contact@yourdomain.com"
                />
                <p className="text-sm text-muted-foreground">
                  Where contact form submissions will be sent
                </p>
              </div>

              <div className="space-y-2">
                <Label>Reply To Email</Label>
                <Input
                  type="email"
                  value={mail.replyToEmail || ''}
                  onChange={(e) => setMail({ ...mail, replyToEmail: e.target.value })}
                  placeholder="contact@yourdomain.com"
                />
                <p className="text-sm text-muted-foreground">
                  Email address for replies (optional)
                </p>
              </div>

              <Button onClick={() => saveSettings('mail', mail)} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                Save Mail Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
