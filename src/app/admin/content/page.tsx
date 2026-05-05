'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Save,
  Image as ImageIcon,
  Layout,
  Type,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContentManagementPage() {
  const [loading, setLoading] = useState(false);

  const handleUpdate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Public content updated successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-primary">CMS Content</h1>
        <p className="text-muted-foreground">Manage the text, images, and brand assets of the public website.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-primary/5 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-primary" />
                  Hero Section
                </CardTitle>
                <CardDescription>Main landing page visuals and headlines</CardDescription>
              </div>
              <a
                href="/"
                target="_blank"
                className="inline-flex h-7 items-center justify-center rounded-md px-2.5 text-[0.8rem] font-medium transition-colors hover:bg-muted hover:text-foreground text-primary gap-1"
              >
                <ExternalLink className="w-4 h-4" /> Preview
              </a>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Main Headline</Label>
              <Input defaultValue="Find Your Next Divine Encounter" className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Subheadline</Label>
              <Textarea
                defaultValue="Discover Christian revivals, conferences, and worship nights happening closest to you today."
                className="min-h-[100px] rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Hero Background URL</Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input defaultValue="https://images.unsplash.com/photo-1544427920-c49ccfb85579" className="pl-10 h-12 rounded-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/5 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5 text-primary" />
              About & Mission
            </CardTitle>
            <CardDescription>Global site messages and mission statements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Mission Statement</Label>
              <Textarea
                defaultValue="Connecting the body of Christ through powerful spiritual gatherings and community engagement."
                className="min-h-[100px] rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Newsletter Headline</Label>
              <Input defaultValue="Never Miss a Revival" className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Footer Copyright</Label>
              <Input defaultValue="© 2026 Revival Locator. All rights reserved." className="h-12 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
        <Button onClick={handleUpdate} disabled={loading} className="h-14 px-12 bg-primary text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 gap-2">
          <Save className="w-5 h-5" />
          {loading ? 'Saving Changes...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
}
