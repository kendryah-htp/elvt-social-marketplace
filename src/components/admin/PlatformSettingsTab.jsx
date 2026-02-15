import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Type, Layout, Upload, Globe, Plus, Trash2 } from 'lucide-react';

export default function PlatformSettingsTab() {
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['platform-settings'],
    queryFn: async () => {
      const results = await base44.entities.PlatformSettings.list();
      return results[0] || null;
    }
  });

  const [formData, setFormData] = useState({
    theme_mode: 'dark',
    theme_style: 'modern',
    primary_color: '#8B5CF6',
    font_family: 'Inter',
    font_size: 'medium',
    logo_url: '',
    favicon_url: '',
    platform_name: 'ELVT Social',
    contact_email: '',
    footer_links: []
  });

  const [newFooterLink, setNewFooterLink] = useState({ label: '', url: '' });

  useEffect(() => {
    if (settings) {
      setFormData({
        ...settings,
        footer_links: settings.footer_links || []
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (settings?.id) {
        return base44.entities.PlatformSettings.update(settings.id, data);
      } else {
        return base44.entities.PlatformSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['platform-settings']);
      alert('Settings saved successfully!');
    }
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const addFooterLink = () => {
    if (newFooterLink.label && newFooterLink.url) {
      setFormData({
        ...formData,
        footer_links: [...(formData.footer_links || []), newFooterLink]
      });
      setNewFooterLink({ label: '', url: '' });
    }
  };

  const removeFooterLink = (index) => {
    const updated = [...formData.footer_links];
    updated.splice(index, 1);
    setFormData({ ...formData, footer_links: updated });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Platform Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Customize your platform's appearance and branding</p>
      </div>

      {/* Theme Settings */}
      <Card className="elvt-glass p-6 border" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Theme</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label style={{ color: 'var(--text-primary)' }}>Color Mode</Label>
            <Select value={formData.theme_mode} onValueChange={(v) => setFormData({ ...formData, theme_mode: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label style={{ color: 'var(--text-primary)' }}>Theme Style</Label>
            <Select value={formData.theme_style} onValueChange={(v) => setFormData({ ...formData, theme_style: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="elegant">Elegant</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label style={{ color: 'var(--text-primary)' }}>Primary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={formData.primary_color}
                onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                className="w-20 h-10 p-1"
              />
              <Input
                value={formData.primary_color}
                onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                placeholder="#8B5CF6"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Typography Settings */}
      <Card className="elvt-glass p-6 border" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-6">
          <Type className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Typography</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label style={{ color: 'var(--text-primary)' }}>Font Family</Label>
            <Select value={formData.font_family} onValueChange={(v) => setFormData({ ...formData, font_family: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Poppins">Poppins</SelectItem>
                <SelectItem value="Montserrat">Montserrat</SelectItem>
                <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                <SelectItem value="Space Grotesk">Space Grotesk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label style={{ color: 'var(--text-primary)' }}>Font Size</Label>
            <Select value={formData.font_size} onValueChange={(v) => setFormData({ ...formData, font_size: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (14px)</SelectItem>
                <SelectItem value="medium">Medium (16px)</SelectItem>
                <SelectItem value="large">Large (18px)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Branding Settings */}
      <Card className="elvt-glass p-6 border" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Branding</h3>
        </div>

        <div className="space-y-6">
          <div>
            <Label style={{ color: 'var(--text-primary)' }}>Platform Name</Label>
            <Input
              value={formData.platform_name}
              onChange={(e) => setFormData({ ...formData, platform_name: e.target.value })}
              placeholder="ELVT Social"
            />
          </div>

          <div>
            <Label style={{ color: 'var(--text-primary)' }}>Logo URL</Label>
            <Input
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              placeholder="https://..."
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Upload your logo and paste the URL here</p>
          </div>

          <div>
            <Label style={{ color: 'var(--text-primary)' }}>Favicon URL</Label>
            <Input
              value={formData.favicon_url}
              onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label style={{ color: 'var(--text-primary)' }}>Contact Email</Label>
            <Input
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              placeholder="support@example.com"
            />
          </div>
        </div>
      </Card>

      {/* Footer Links */}
      <Card className="elvt-glass p-6 border" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-6">
          <Layout className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Footer Links</h3>
        </div>

        <div className="space-y-4">
          {formData.footer_links?.map((link, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="flex-1">
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{link.label}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{link.url}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFooterLink(idx)}
                className="text-red-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <div className="grid md:grid-cols-2 gap-3">
            <Input
              value={newFooterLink.label}
              onChange={(e) => setNewFooterLink({ ...newFooterLink, label: e.target.value })}
              placeholder="Link Label (e.g., Terms)"
            />
            <Input
              value={newFooterLink.url}
              onChange={(e) => setNewFooterLink({ ...newFooterLink, url: e.target.value })}
              placeholder="URL (e.g., /terms)"
            />
          </div>
          <Button
            onClick={addFooterLink}
            variant="outline"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Footer Link
          </Button>
        </div>
      </Card>

      <Button
        onClick={handleSave}
        className="w-full py-6 text-lg font-bold pulse-glow"
        style={{ backgroundColor: 'var(--accent)', color: 'white' }}
        disabled={saveMutation.isPending}
      >
        {saveMutation.isPending ? 'Saving...' : 'Save All Settings'}
      </Button>
    </div>
  );
}