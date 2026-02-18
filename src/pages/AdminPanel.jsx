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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Package,
  Mail,
  TrendingUp
} from 'lucide-react';
import PlatformSettingsTab from '@/components/admin/PlatformSettingsTab';

export default function AdminPanel() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAppDialog, setShowAppDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [newApp, setNewApp] = useState({
    name: '',
    description: '',
    short_description: '',
    price: '',
    category: 'templates',
    thumbnail_url: '',
    demo_url: '',
    landing_page_url: '',
    stripe_product_id: '',
    affiliate_link_template: '',
    commission_rate: 30,
    features: []
  });
  const [newEmail, setNewEmail] = useState({
    name: '',
    trigger: 'purchase_complete',
    subject: '',
    body: '',
    custom_instructions: ''
  });

  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    resource_type: 'guide',
    content_url: ''
  });

  // Check if user is admin
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: apps = [] } = useQuery({
    queryKey: ['admin-apps'],
    queryFn: () => base44.entities.App.list()
  });

  const { data: affiliates = [] } = useQuery({
    queryKey: ['admin-affiliates'],
    queryFn: () => base44.entities.AffiliateProfile.list()
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ['admin-purchases'],
    queryFn: () => base44.entities.Purchase.list('-created_date', 50)
  });

  const { data: emails = [] } = useQuery({
    queryKey: ['admin-emails'],
    queryFn: () => base44.entities.EmailTemplate.list()
  });

  const { data: resources = [] } = useQuery({
    queryKey: ['admin-resources'],
    queryFn: () => base44.entities.AdminResource.filter({ admin_email: user?.email })
  });

  const createAppMutation = useMutation({
    mutationFn: (data) => base44.entities.App.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-apps']);
      setShowAppDialog(false);
      resetAppForm();
    }
  });

  const updateAppMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.App.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-apps']);
      setShowAppDialog(false);
      resetAppForm();
    }
  });

  const deleteAppMutation = useMutation({
    mutationFn: (id) => base44.entities.App.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-apps']);
    }
  });

  const createEmailMutation = useMutation({
    mutationFn: (data) => base44.entities.EmailTemplate.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-emails']);
      setShowEmailDialog(false);
      resetEmailForm();
    }
  });

  const createResourceMutation = useMutation({
    mutationFn: (data) => base44.entities.AdminResource.create({
      ...data,
      admin_email: user?.email,
      is_published: true
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-resources']);
      setShowResourceDialog(false);
      resetResourceForm();
    }
  });

  const deleteResourceMutation = useMutation({
    mutationFn: (id) => base44.entities.AdminResource.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-resources']);
    }
  });

  const resetAppForm = () => {
    setNewApp({
      name: '',
      description: '',
      short_description: '',
      price: '',
      category: 'templates',
      thumbnail_url: '',
      demo_url: '',
      landing_page_url: '',
      stripe_product_id: '',
      affiliate_link_template: '',
      commission_rate: 30,
      features: []
    });
    setEditingApp(null);
  };

  const resetEmailForm = () => {
    setNewEmail({
      name: '',
      trigger: 'purchase_complete',
      subject: '',
      body: '',
      custom_instructions: ''
    });
  };

  const resetResourceForm = () => {
    setNewResource({
      title: '',
      description: '',
      resource_type: 'guide',
      content_url: ''
    });
  };

  const handleEditApp = (app) => {
    setEditingApp(app);
    setNewApp(app);
    setShowAppDialog(true);
  };

  const handleSaveApp = () => {
    const appData = {
      ...newApp,
      price: parseFloat(newApp.price),
      commission_rate: parseFloat(newApp.commission_rate)
    };

    if (editingApp) {
      updateAppMutation.mutate({ id: editingApp.id, data: appData });
    } else {
      createAppMutation.mutate(appData);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAFA' }}>
        <Card className="p-8 text-center border shadow-xl" style={{ 
          backgroundColor: 'white',
          borderColor: 'rgba(139, 92, 246, 0.15)'
        }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A1A2E' }}>Access Denied</h2>
          <p style={{ color: '#2E2E42' }}>You need admin privileges to access this page</p>
        </Card>
      </div>
    );
  }

  const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalCommissions = purchases.reduce((sum, p) => sum + (p.commission_amount || 0), 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2" style={{ 
            background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Admin Panel</h1>
          <p className="text-base md:text-lg" style={{ color: '#6B6B80' }}>Manage your marketplace</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="border shadow-md" style={{ 
            backgroundColor: 'white',
            borderColor: 'rgba(139, 92, 246, 0.15)'
          }}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="apps">Apps</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="emails">Email Templates</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="settings">Platform Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: DollarSign, label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'text-green-400' },
                { icon: TrendingUp, label: 'Commissions Paid', value: `$${totalCommissions.toFixed(2)}`, color: 'text-blue-400' },
                { icon: Users, label: 'Active Affiliates', value: affiliates.length, color: 'text-purple-400' },
                { icon: Package, label: 'Total Apps', value: apps.length, color: 'text-orange-400' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-6 border shadow-lg" style={{ 
                    backgroundColor: 'white',
                    borderColor: 'rgba(139, 92, 246, 0.15)'
                  }}>
                    <stat.icon className="w-8 h-8 mb-3" style={{ color: stat.color === 'text-green-400' ? '#10B981' : stat.color === 'text-blue-400' ? '#3B82F6' : stat.color === 'text-purple-400' ? '#8B5CF6' : '#F59E0B' }} />
                    <p className="text-3xl font-bold mb-1" style={{ color: '#1A1A2E' }}>{stat.value}</p>
                    <p className="text-sm" style={{ color: '#6B6B80' }}>{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="p-6 border shadow-lg" style={{ 
              backgroundColor: 'white',
              borderColor: 'rgba(139, 92, 246, 0.15)'
            }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#1A1A2E' }}>Recent Activity</h3>
              <div className="space-y-3">
                {purchases.slice(0, 5).map(purchase => (
                  <div key={purchase.id} className="flex items-center justify-between p-3 rounded-lg border shadow-sm" style={{ 
                    backgroundColor: 'white',
                    borderColor: 'rgba(139, 92, 246, 0.1)'
                  }}>
                    <div>
                      <p className="font-semibold" style={{ color: '#1A1A2E' }}>{purchase.product_name}</p>
                      <p className="text-sm" style={{ color: '#6B6B80' }}>
                        {purchase.buyer_name} via {purchase.affiliate_slug || 'Direct'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold" style={{ color: '#7C3AED' }}>${purchase.amount}</p>
                      <p className="text-xs" style={{ color: '#6B6B80' }}>
                        {new Date(purchase.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Apps Tab */}
          <TabsContent value="apps" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>App Management</h2>
              
              <Dialog open={showAppDialog} onOpenChange={setShowAppDialog}>
                <DialogTrigger asChild>
                  <Button className="text-white shadow-lg" style={{ backgroundColor: '#7C3AED' }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add App
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border shadow-2xl" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)',
                  color: '#1A1A2E'
                }}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold" style={{ 
                      background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {editingApp ? 'Edit App' : 'Add New App'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label style={{ color: '#1A1A2E' }}>App Name</Label>
                      <Input
                        value={newApp.name}
                        onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                        style={{ backgroundColor: '#F8F7FF', borderColor: 'rgba(139, 92, 246, 0.2)', color: '#1A1A2E' }}
                      />
                    </div>
                    <div>
                      <Label style={{ color: 'var(--text-primary)' }}>Short Description</Label>
                      <Input
                        value={newApp.short_description}
                        onChange={(e) => setNewApp({ ...newApp, short_description: e.target.value })}
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <Label style={{ color: 'var(--text-primary)' }}>Full Description</Label>
                      <Textarea
                        value={newApp.description}
                        onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label style={{ color: 'var(--text-primary)' }}>Price</Label>
                        <Input
                          type="number"
                          value={newApp.price}
                          onChange={(e) => setNewApp({ ...newApp, price: e.target.value })}
                          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div>
                        <Label style={{ color: 'var(--text-primary)' }}>Commission Rate (%)</Label>
                        <Input
                          type="number"
                          value={newApp.commission_rate}
                          onChange={(e) => setNewApp({ ...newApp, commission_rate: e.target.value })}
                          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label style={{ color: 'var(--text-primary)' }}>Thumbnail URL</Label>
                      <Input
                        value={newApp.thumbnail_url}
                        onChange={(e) => setNewApp({ ...newApp, thumbnail_url: e.target.value })}
                        placeholder="https://..."
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <Label style={{ color: 'var(--text-primary)' }}>Demo URL (for 90% iframe showcase)</Label>
                      <Input
                        value={newApp.demo_url}
                        onChange={(e) => setNewApp({ ...newApp, demo_url: e.target.value })}
                        placeholder="https://..."
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <Label style={{ color: 'var(--text-primary)' }}>Landing Page URL (opens in new tab)</Label>
                      <Input
                        value={newApp.landing_page_url}
                        onChange={(e) => setNewApp({ ...newApp, landing_page_url: e.target.value })}
                        placeholder="https://..."
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <Label style={{ color: 'var(--text-primary)' }}>Stripe Product ID</Label>
                      <Input
                        value={newApp.stripe_product_id}
                        onChange={(e) => setNewApp({ ...newApp, stripe_product_id: e.target.value })}
                        placeholder="prod_xxxxx"
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <Label style={{ color: 'var(--text-primary)' }}>Affiliate Link Template (use {'{affiliate_id}'})</Label>
                      <Input
                        value={newApp.affiliate_link_template}
                        onChange={(e) => setNewApp({ ...newApp, affiliate_link_template: e.target.value })}
                        placeholder="https://yoursite.com/ref/{affiliate_id}"
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <Button
                      onClick={handleSaveApp}
                      className="w-full font-bold"
                      style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                    >
                      {editingApp ? 'Update App' : 'Create App'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {apps.map(app => (
                <Card key={app.id} className="p-6 border shadow-lg hover:shadow-xl transition-shadow" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)'
                }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#1A1A2E' }}>{app.name}</h3>
                      <p className="text-sm mb-3" style={{ color: '#2E2E42' }}>{app.short_description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge style={{ backgroundColor: '#7C3AED', color: 'white' }}>${app.price}</Badge>
                        <Badge variant="outline">{app.commission_rate}% commission</Badge>
                        <Badge variant="outline">{app.category}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditApp(app)}
                        style={{ borderColor: '#7C3AED', color: '#7C3AED' }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteAppMutation.mutate(app.id)}
                        style={{ color: '#EF4444' }}
                        className="hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Affiliates Tab */}
          <TabsContent value="affiliates">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A1A2E' }}>Affiliate Management</h2>
            <div className="grid gap-4">
              {affiliates.map(affiliate => (
                <Card key={affiliate.id} className="p-6 border shadow-lg hover:shadow-xl transition-shadow" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)'
                }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: '#1A1A2E' }}>{affiliate.full_name}</h3>
                      <p className="text-sm" style={{ color: '#6B6B80' }}>{affiliate.user_email}</p>
                      <p className="text-sm mt-1" style={{ color: '#7C3AED' }}>Slug: {affiliate.slug}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
                        ${(affiliate.total_earnings || 0).toFixed(2)}
                      </p>
                      <p className="text-sm" style={{ color: '#6B6B80' }}>Total Earnings</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Purchases Tab */}
          <TabsContent value="purchases">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A1A2E' }}>All Purchases</h2>
            <div className="space-y-3">
              {purchases.map(purchase => (
                <Card key={purchase.id} className="p-4 border shadow-md hover:shadow-lg transition-shadow" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)'
                }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold" style={{ color: '#1A1A2E' }}>{purchase.product_name}</h4>
                      <p className="text-sm" style={{ color: '#6B6B80' }}>
                        {purchase.buyer_name} ({purchase.buyer_email})
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                        Via: {purchase.affiliate_slug || 'Direct'} · {new Date(purchase.created_date).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold" style={{ color: '#7C3AED' }}>${purchase.amount}</p>
                      <p className="text-sm" style={{ color: '#6B6B80' }}>
                        Commission: ${purchase.commission_amount?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Email Templates Tab */}
          <TabsContent value="emails" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Email Templates</h2>
              
              <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                <DialogTrigger asChild>
                  <Button className="text-white shadow-lg" style={{ backgroundColor: '#7C3AED' }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl border shadow-2xl" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)',
                  color: '#1A1A2E'
                }}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold" style={{ 
                      background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>Create Email Template</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label style={{ color: 'var(--text-primary)' }}>Template Name</Label>
                      <Input
                        value={newEmail.name}
                        onChange={(e) => setNewEmail({ ...newEmail, name: e.target.value })}
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <Label style={{ color: 'var(--text-primary)' }}>Subject</Label>
                      <Input
                        value={newEmail.subject}
                        onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                        placeholder="Use {buyer_name}, {app_name}, etc."
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <Label style={{ color: 'var(--text-primary)' }}>Body</Label>
                      <Textarea
                        value={newEmail.body}
                        onChange={(e) => setNewEmail({ ...newEmail, body: e.target.value })}
                        className="min-h-32"
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <Button
                      onClick={() => createEmailMutation.mutate(newEmail)}
                      className="w-full font-bold"
                      style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                    >
                      Create Template
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {emails.map(email => (
                <Card key={email.id} className="p-6 border shadow-lg hover:shadow-xl transition-shadow" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)'
                }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1" style={{ color: '#1A1A2E' }}>{email.name}</h3>
                      <p className="text-sm mb-2" style={{ color: '#6B6B80' }}>Trigger: {email.trigger}</p>
                      <p className="text-sm" style={{ color: '#7C3AED' }}>Subject: {email.subject}</p>
                    </div>
                    <Badge className={email.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                      {email.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1A2E' }}>User Resources & Documentation</h2>
                <p style={{ color: '#6B6B80' }} className="text-sm">Share guides, FAQs, videos, and templates with your users</p>
              </div>

              <Dialog open={showResourceDialog} onOpenChange={setShowResourceDialog}>
                <DialogTrigger asChild>
                  <Button className="text-white shadow-lg" style={{ backgroundColor: '#7C3AED' }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl border shadow-2xl" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)',
                  color: '#1A1A2E'
                }}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold" style={{ 
                      background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>Share Resource with Users</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label style={{ color: 'var(--text-primary)' }}>Resource Title</Label>
                      <Input
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                        placeholder="e.g., Getting Started Guide"
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <Label style={{ color: 'var(--text-primary)' }}>Description</Label>
                      <Input
                        value={newResource.description}
                        onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                        placeholder="Brief description of this resource"
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <Label style={{ color: 'var(--text-primary)' }}>Resource Type</Label>
                      <select 
                        value={newResource.resource_type}
                        onChange={(e) => setNewResource({ ...newResource, resource_type: e.target.value })}
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', width: '100%' }}
                      >
                        <option value="guide">📖 Setup Guide</option>
                        <option value="faq">❓ FAQ / Tips</option>
                        <option value="video">🎥 Video Tutorial</option>
                        <option value="template">📋 Template / Checklist</option>
                        <option value="checklist">✅ Onboarding Checklist</option>
                        <option value="other">📎 Other</option>
                      </select>
                    </div>
                    <div>
                      <Label style={{ color: 'var(--text-primary)' }}>Resource URL</Label>
                      <Input
                        value={newResource.content_url}
                        onChange={(e) => setNewResource({ ...newResource, content_url: e.target.value })}
                        placeholder="https://docs.google.com/... or https://youtube.com/..."
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                      <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-2">👉 Use Google Docs, YouTube, Notion, Loom, or any public link</p>
                    </div>
                    <Button
                      onClick={() => createResourceMutation.mutate(newResource)}
                      className="w-full font-bold"
                      style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                    >
                      Publish Resource
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {resources.length === 0 ? (
              <Card className="p-12 text-center border shadow-lg" style={{ 
                backgroundColor: 'white',
                borderColor: 'rgba(139, 92, 246, 0.15)'
              }}>
                <p style={{ color: '#6B6B80' }}>No resources yet. Create your first one!</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {resources.map(resource => (
                  <Card key={resource.id} className="p-6 border shadow-lg hover:shadow-xl transition-shadow" style={{ 
                    backgroundColor: 'white',
                    borderColor: 'rgba(139, 92, 246, 0.15)'
                  }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1" style={{ color: '#1A1A2E' }}>{resource.title}</h3>
                        <p className="text-sm mb-3" style={{ color: '#2E2E42' }}>{resource.description}</p>
                        <div className="flex gap-2 items-center">
                          <Badge variant="outline">{resource.resource_type}</Badge>
                          <a 
                            href={resource.content_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm hover:underline"
                            style={{ color: '#7C3AED' }}
                          >
                            View Resource →
                          </a>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteResourceMutation.mutate(resource.id)}
                        style={{ color: '#EF4444' }}
                        className="hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Platform Settings Tab */}
          <TabsContent value="settings">
            <PlatformSettingsTab />
          </TabsContent>
          </Tabs>
      </div>
    </div>
  );
}