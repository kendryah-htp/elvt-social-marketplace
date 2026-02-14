import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  ShoppingCart, 
  Eye, 
  Link as LinkIcon, 
  Copy, 
  Settings,
  Plus,
  ExternalLink,
  Trash2,
  Palette
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const themes = ['luxury', 'minimal', 'vibrant'];

export default function AffiliateDashboard() {
  const queryClient = useQueryClient();
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    external_link: '',
    thumbnail_url: ''
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: profile } = useQuery({
    queryKey: ['affiliate-profile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.AffiliateProfile.filter({ user_email: user.email });
      return profiles[0];
    },
    enabled: !!user
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ['affiliate-purchases', profile?.id],
    queryFn: () => base44.entities.Purchase.filter({ affiliate_id: profile.id }),
    enabled: !!profile
  });

  const { data: visits = [] } = useQuery({
    queryKey: ['affiliate-visits', profile?.slug],
    queryFn: () => base44.entities.StorefrontVisit.filter({ affiliate_slug: profile.slug }),
    enabled: !!profile
  });

  const { data: myProducts = [] } = useQuery({
    queryKey: ['my-products', profile?.id],
    queryFn: () => base44.entities.AffiliateProduct.filter({ affiliate_id: profile.id }),
    enabled: !!profile
  });

  const { data: allApps = [] } = useQuery({
    queryKey: ['all-apps'],
    queryFn: () => base44.entities.App.filter({ is_active: true })
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.AffiliateProfile.update(profile.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['affiliate-profile']);
      setShowSettingsDialog(false);
    }
  });

  const createProductMutation = useMutation({
    mutationFn: (data) => base44.entities.AffiliateProduct.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-products']);
      setShowProductDialog(false);
      setNewProduct({ name: '', description: '', price: '', external_link: '', thumbnail_url: '' });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id) => base44.entities.AffiliateProduct.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-products']);
    }
  });

  const storefrontUrl = profile ? `${window.location.origin}${createPageUrl('Storefront')}?slug=${profile.slug}` : '';
  
  const totalEarnings = purchases.reduce((sum, p) => sum + (p.commission_amount || 0), 0);
  const totalSales = purchases.length;
  const totalVisits = visits.length;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleToggleApp = (appId) => {
    const selectedApps = profile.selected_app_ids || [];
    const newSelected = selectedApps.includes(appId)
      ? selectedApps.filter(id => id !== appId)
      : [...selectedApps, appId];
    
    updateProfileMutation.mutate({ selected_app_ids: newSelected });
  };

  if (!profile) {
    return (
      <div className="min-h-screen elvt-gradient flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#E5E0DB] mb-6">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen elvt-gradient">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gradient">
            Welcome back, {profile.full_name}
          </h1>
          <p className="text-[#E5E0DB] text-lg">Here's your affiliate performance</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: DollarSign, label: 'Total Earnings', value: `$${totalEarnings.toFixed(2)}`, color: 'text-green-400' },
            { icon: ShoppingCart, label: 'Total Sales', value: totalSales, color: 'text-blue-400' },
            { icon: Eye, label: 'Storefront Visits', value: totalVisits, color: 'text-purple-400' },
            { icon: LinkIcon, label: 'Active Apps', value: profile.selected_app_ids?.length || 0, color: 'text-orange-400' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="elvt-glass p-6">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-[#F5F0EB] mb-1">{stat.value}</p>
                <p className="text-sm text-[#E5E0DB]">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Storefront Link */}
        <Card className="elvt-glass p-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#F5F0EB] mb-2">Your Storefront</h3>
              <p className="text-[#E5E0DB] text-sm mb-3">Share this link to start earning commissions</p>
              <div className="flex items-center gap-2">
                <code className="bg-[#1A1A1A] px-4 py-2 rounded-lg text-[#D4AF37] text-sm">
                  {storefrontUrl}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(storefrontUrl)}
                  className="border-[#D4AF37] text-[#D4AF37]"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to={`/shop?slug=${profile.slug}`} target="_blank">
                <Button className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A]">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Storefront
                </Button>
              </Link>
              
              <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37]">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1A1A] border-[#D4AF37]/20 text-[#F5F0EB] max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gradient">Storefront Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    <div>
                      <Label>Theme</Label>
                      <Select
                        value={profile.theme}
                        onValueChange={(value) => updateProfileMutation.mutate({ theme: value })}
                      >
                        <SelectTrigger className="bg-[#0A0A0A] border-[#D4AF37]/20">
                          <Palette className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {themes.map(theme => (
                            <SelectItem key={theme} value={theme}>
                              {theme.charAt(0).toUpperCase() + theme.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Bio</Label>
                      <Textarea
                        value={profile.bio || ''}
                        onChange={(e) => updateProfileMutation.mutate({ bio: e.target.value })}
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Manage Apps */}
          <div>
            <h2 className="text-2xl font-bold text-[#F5F0EB] mb-6">Apps on Your Storefront</h2>
            <div className="space-y-3">
              {allApps.map(app => (
                <Card key={app.id} className="elvt-glass p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#F5F0EB]">{app.name}</h4>
                      <p className="text-sm text-[#E5E0DB]">${app.price} · {app.commission_rate}% commission</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleToggleApp(app.id)}
                      className={profile.selected_app_ids?.includes(app.id)
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A]'
                      }
                    >
                      {profile.selected_app_ids?.includes(app.id) ? 'Remove' : 'Add'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* My Custom Products */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#F5F0EB]">My Custom Products</h2>
              
              <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1A1A] border-[#D4AF37]/20 text-[#F5F0EB]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gradient">Add Custom Product</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Product Name</Label>
                      <Input
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                    <div>
                      <Label>External Link</Label>
                      <Input
                        value={newProduct.external_link}
                        onChange={(e) => setNewProduct({ ...newProduct, external_link: e.target.value })}
                        placeholder="https://..."
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                    <div>
                      <Label>Thumbnail URL (optional)</Label>
                      <Input
                        value={newProduct.thumbnail_url}
                        onChange={(e) => setNewProduct({ ...newProduct, thumbnail_url: e.target.value })}
                        placeholder="https://..."
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                    <Button
                      onClick={() => createProductMutation.mutate({
                        ...newProduct,
                        price: parseFloat(newProduct.price),
                        affiliate_id: profile.id
                      })}
                      disabled={!newProduct.name || !newProduct.external_link}
                      className="w-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A]"
                    >
                      Add Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {myProducts.length === 0 ? (
                <Card className="elvt-glass p-8 text-center">
                  <p className="text-[#E5E0DB]">No custom products yet</p>
                </Card>
              ) : (
                myProducts.map(product => (
                  <Card key={product.id} className="elvt-glass p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#F5F0EB]">{product.name}</h4>
                        <p className="text-sm text-[#E5E0DB]">${product.price}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteProductMutation.mutate(product.id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#F5F0EB] mb-6">Recent Sales</h2>
          {purchases.length === 0 ? (
            <Card className="elvt-glass p-12 text-center">
              <p className="text-[#E5E0DB] text-lg">No sales yet. Share your storefront to start earning!</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {purchases.slice(0, 10).map(purchase => (
                <Card key={purchase.id} className="elvt-glass p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-[#F5F0EB]">{purchase.product_name}</h4>
                      <p className="text-sm text-[#E5E0DB]">
                        {purchase.buyer_name} · {new Date(purchase.created_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#D4AF37]">+${purchase.commission_amount?.toFixed(2)}</p>
                      <p className="text-xs text-[#E5E0DB]">{purchase.commission_rate}% commission</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}