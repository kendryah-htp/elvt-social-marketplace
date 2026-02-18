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

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['affiliate-profile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.AffiliateProfile.filter({ user_email: user.email });
      return profiles[0];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000
  });

  const { data: dashboardData = { purchases: [], visits: [], products: [], apps: [] }, isLoading: dataLoading } = useQuery({
    queryKey: ['dashboard-data', profile?.id],
    queryFn: async () => {
      const [purchases, visits, products, apps] = await Promise.all([
        base44.entities.Purchase.filter({ affiliate_id: profile.id }),
        base44.entities.StorefrontVisit.filter({ affiliate_slug: profile.slug }),
        base44.entities.AffiliateProduct.filter({ affiliate_id: profile.id }),
        base44.entities.App.filter({ is_active: true })
      ]);
      return { purchases, visits, products, apps };
    },
    enabled: !!profile?.id,
    staleTime: 2 * 60 * 1000
  });

  const purchases = dashboardData.purchases;
  const visits = dashboardData.visits;
  const myProducts = dashboardData.products;
  const allApps = dashboardData.apps;

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.AffiliateProfile.update(profile.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['affiliate-profile']);
      queryClient.invalidateQueries(['dashboard-data']);
      setShowSettingsDialog(false);
    }
  });

  const createProductMutation = useMutation({
    mutationFn: (data) => base44.entities.AffiliateProduct.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboard-data']);
      setShowProductDialog(false);
      setNewProduct({ name: '', description: '', price: '', external_link: '', thumbnail_url: '' });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id) => base44.entities.AffiliateProduct.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboard-data']);
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

  if (profileLoading || !profile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#FAFAFA' }}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-t-transparent rounded-full mx-auto mb-4"
            style={{ borderColor: '#7C3AED', borderTopColor: 'transparent' }}
          />
          <p style={{ color: '#2E2E42' }} className="font-semibold">Loading your dashboard...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ 
            background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome back, {profile.full_name}
          </h1>
          <p style={{ color: '#6B6B80' }} className="text-lg">Here's your affiliate performance</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: DollarSign, label: 'Total Earnings', value: `$${totalEarnings.toFixed(2)}`, color: '#10B981' },
            { icon: ShoppingCart, label: 'Total Sales', value: totalSales, color: '#3B82F6' },
            { icon: Eye, label: 'Storefront Visits', value: totalVisits, color: '#8B5CF6' },
            { icon: LinkIcon, label: 'Active Apps', value: profile.selected_app_ids?.length || 0, color: '#F59E0B' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="p-6 border shadow-lg" style={{ 
                backgroundColor: 'white',
                borderColor: 'rgba(139, 92, 246, 0.15)'
              }}>
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                </div>
                <p className="text-3xl font-bold mb-1" style={{ color: '#1A1A2E' }}>{stat.value}</p>
                <p className="text-sm" style={{ color: '#6B6B80' }}>{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Storefront Link */}
        <Card className="p-6 mb-12 border shadow-lg" style={{ 
          backgroundColor: 'white',
          borderColor: 'rgba(139, 92, 246, 0.15)'
        }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#1A1A2E' }}>Your Storefront</h3>
              <p className="text-sm mb-3" style={{ color: '#6B6B80' }}>Share this link to start earning commissions</p>
              <div className="flex items-center gap-2">
                <code className="px-4 py-2 rounded-lg text-sm" style={{ 
                  backgroundColor: '#F0EDFF',
                  color: '#7C3AED'
                }}>
                  {storefrontUrl}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(storefrontUrl)}
                  style={{ borderColor: '#7C3AED', color: '#7C3AED' }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to={`/shop?slug=${profile.slug}`} target="_blank">
                <Button className="text-white" style={{ 
                  backgroundColor: '#7C3AED'
                }}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Storefront
                </Button>
              </Link>
              
              <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" style={{ borderColor: '#7C3AED', color: '#7C3AED' }}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.2)',
                  color: '#1A1A2E'
                }}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold" style={{ 
                      background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>Storefront Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    <div>
                      <Label>Theme</Label>
                      <Select
                        value={profile.theme}
                        onValueChange={(value) => updateProfileMutation.mutate({ theme: value })}
                      >
                        <SelectTrigger style={{ 
                          backgroundColor: '#F8F7FF',
                          borderColor: 'rgba(139, 92, 246, 0.2)'
                        }}>
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
                        style={{ 
                          backgroundColor: '#F8F7FF',
                          borderColor: 'rgba(139, 92, 246, 0.2)'
                        }}
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
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A1A2E' }}>Apps on Your Storefront</h2>
            <div className="space-y-3">
              {dataLoading ? (
                <Card className="p-6 animate-pulse border shadow-lg" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)'
                }}>
                  <div className="h-6 rounded mb-3" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }} />
                  <div className="h-4 rounded w-2/3" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }} />
                </Card>
              ) : allApps.length === 0 ? (
                <Card className="p-8 text-center border shadow-lg" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)'
                }}>
                  <p style={{ color: '#6B6B80' }}>No apps available yet</p>
                </Card>
              ) : (
                allApps.map(app => (
                  <Card key={app.id} className="p-4 border shadow-md hover:shadow-lg transition-shadow" style={{ 
                    backgroundColor: 'white',
                    borderColor: 'rgba(139, 92, 246, 0.15)'
                  }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold" style={{ color: '#1A1A2E' }}>{app.name}</h4>
                        <p className="text-sm" style={{ color: '#6B6B80' }}>${app.price} · {app.commission_rate}% commission</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleToggleApp(app.id)}
                        className="text-white"
                        style={{
                          backgroundColor: profile.selected_app_ids?.includes(app.id) ? '#EF4444' : '#7C3AED'
                        }}
                      >
                        {profile.selected_app_ids?.includes(app.id) ? 'Remove' : 'Add'}
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* My Custom Products */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>My Custom Products</h2>
              
              <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-white" style={{ backgroundColor: '#7C3AED' }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.2)',
                  color: '#1A1A2E'
                }}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold" style={{ 
                      background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>Add Custom Product</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Product Name</Label>
                      <Input
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        style={{ 
                          backgroundColor: '#F8F7FF',
                          borderColor: 'rgba(139, 92, 246, 0.2)'
                        }}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        style={{ 
                          backgroundColor: '#F8F7FF',
                          borderColor: 'rgba(139, 92, 246, 0.2)'
                        }}
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        style={{ 
                          backgroundColor: '#F8F7FF',
                          borderColor: 'rgba(139, 92, 246, 0.2)'
                        }}
                      />
                    </div>
                    <div>
                      <Label>External Link</Label>
                      <Input
                        value={newProduct.external_link}
                        onChange={(e) => setNewProduct({ ...newProduct, external_link: e.target.value })}
                        placeholder="https://..."
                        style={{ 
                          backgroundColor: '#F8F7FF',
                          borderColor: 'rgba(139, 92, 246, 0.2)'
                        }}
                      />
                    </div>
                    <div>
                      <Label>Thumbnail URL (optional)</Label>
                      <Input
                        value={newProduct.thumbnail_url}
                        onChange={(e) => setNewProduct({ ...newProduct, thumbnail_url: e.target.value })}
                        placeholder="https://..."
                        style={{ 
                          backgroundColor: '#F8F7FF',
                          borderColor: 'rgba(139, 92, 246, 0.2)'
                        }}
                      />
                    </div>
                    <Button
                      onClick={() => createProductMutation.mutate({
                        ...newProduct,
                        price: parseFloat(newProduct.price),
                        affiliate_id: profile.id
                      })}
                      disabled={!newProduct.name || !newProduct.external_link}
                      className="w-full text-white"
                      style={{ backgroundColor: '#7C3AED' }}
                    >
                      Add Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {dataLoading ? (
                <Card className="p-6 animate-pulse border shadow-lg" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)'
                }}>
                  <div className="h-6 rounded mb-3" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }} />
                  <div className="h-4 rounded w-2/3" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }} />
                </Card>
              ) : myProducts.length === 0 ? (
                <Card className="p-8 text-center border shadow-lg" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)'
                }}>
                  <p style={{ color: '#6B6B80' }}>No custom products yet</p>
                </Card>
              ) : (
                myProducts.map(product => (
                  <Card key={product.id} className="p-4 border shadow-md hover:shadow-lg transition-shadow" style={{ 
                    backgroundColor: 'white',
                    borderColor: 'rgba(139, 92, 246, 0.15)'
                  }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold" style={{ color: '#1A1A2E' }}>{product.name}</h4>
                        <p className="text-sm" style={{ color: '#6B6B80' }}>${product.price}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteProductMutation.mutate(product.id)}
                        style={{ color: '#EF4444' }}
                        className="hover:bg-red-50"
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
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A1A2E' }}>Recent Sales</h2>
          {purchases.length === 0 ? (
            <Card className="p-12 text-center border shadow-lg" style={{ 
              backgroundColor: 'white',
              borderColor: 'rgba(139, 92, 246, 0.15)'
            }}>
              <p className="text-lg" style={{ color: '#6B6B80' }}>No sales yet. Share your storefront to start earning!</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {purchases.slice(0, 10).map(purchase => (
                <Card key={purchase.id} className="p-4 border shadow-md hover:shadow-lg transition-shadow" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)'
                }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold" style={{ color: '#1A1A2E' }}>{purchase.product_name}</h4>
                      <p className="text-sm" style={{ color: '#6B6B80' }}>
                        {purchase.buyer_name} · {new Date(purchase.created_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold" style={{ color: '#10B981' }}>+${purchase.commission_amount?.toFixed(2)}</p>
                      <p className="text-xs" style={{ color: '#6B6B80' }}>{purchase.commission_rate}% commission</p>
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