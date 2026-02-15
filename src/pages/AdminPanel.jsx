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
      <div className="min-h-screen elvt-gradient flex items-center justify-center">
        <Card className="elvt-glass p-8 text-center">
          <h2 className="text-2xl font-bold text-[#F5F0EB] mb-4">Access Denied</h2>
          <p className="text-[#E5E0DB]">You need admin privileges to access this page</p>
        </Card>
      </div>
    );
  }

  const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalCommissions = purchases.reduce((sum, p) => sum + (p.commission_amount || 0), 0);

  return (
    <div className="min-h-screen elvt-gradient">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gradient">Admin Panel</h1>
          <p className="text-[#E5E0DB] text-lg">Manage your marketplace</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-[#1A1A1A] border border-[#D4AF37]/20">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="apps">Apps</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="emails">Email Templates</TabsTrigger>
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
                  <Card className="elvt-glass p-6 border border-[#D4AF37]/20">
                    <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                    <p className="text-3xl font-bold text-[#F5F0EB] mb-1">{stat.value}</p>
                    <p className="text-sm text-[#A0A0A0]">{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="elvt-glass p-6">
              <h3 className="text-xl font-bold text-[#F5F0EB] mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {purchases.slice(0, 5).map(purchase => (
                  <div key={purchase.id} className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
                    <div>
                      <p className="font-semibold text-[#F5F0EB]">{purchase.product_name}</p>
                      <p className="text-sm text-[#E5E0DB]">
                        {purchase.buyer_name} via {purchase.affiliate_slug || 'Direct'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#D4AF37]">${purchase.amount}</p>
                      <p className="text-xs text-[#E5E0DB]">
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
              <h2 className="text-2xl font-bold text-[#F5F0EB]">App Management</h2>
              
              <Dialog open={showAppDialog} onOpenChange={setShowAppDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add App
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1A1A] border-[#D4AF37]/20 text-[#F5F0EB] max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gradient">
                      {editingApp ? 'Edit App' : 'Add New App'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>App Name</Label>
                      <Input
                        value={newApp.name}
                        onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                    <div>
                      <Label>Short Description</Label>
                      <Input
                        value={newApp.short_description}
                        onChange={(e) => setNewApp({ ...newApp, short_description: e.target.value })}
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                    <div>
                      <Label>Full Description</Label>
                      <Textarea
                        value={newApp.description}
                        onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Price</Label>
                        <Input
                          type="number"
                          value={newApp.price}
                          onChange={(e) => setNewApp({ ...newApp, price: e.target.value })}
                          className="bg-[#0A0A0A] border-[#D4AF37]/20"
                        />
                      </div>
                      <div>
                        <Label>Commission Rate (%)</Label>
                        <Input
                          type="number"
                          value={newApp.commission_rate}
                          onChange={(e) => setNewApp({ ...newApp, commission_rate: e.target.value })}
                          className="bg-[#0A0A0A] border-[#D4AF37]/20"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Thumbnail URL</Label>
                      <Input
                        value={newApp.thumbnail_url}
                        onChange={(e) => setNewApp({ ...newApp, thumbnail_url: e.target.value })}
                        placeholder="https://..."
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                    <div>
                      <Label>Demo URL (for 90% iframe showcase)</Label>
                      <Input
                        value={newApp.demo_url}
                        onChange={(e) => setNewApp({ ...newApp, demo_url: e.target.value })}
                        placeholder="https://..."
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                    <div>
                      <Label>Landing Page URL (opens in new tab)</Label>
                      <Input
                        value={newApp.landing_page_url}
                        onChange={(e) => setNewApp({ ...newApp, landing_page_url: e.target.value })}
                        placeholder="https://..."
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                    <div>
                      <Label>Stripe Product ID</Label>
                      <Input
                        value={newApp.stripe_product_id}
                        onChange={(e) => setNewApp({ ...newApp, stripe_product_id: e.target.value })}
                        placeholder="prod_xxxxx"
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                    <div>
                      <Label>Affiliate Link Template (use {'{affiliate_id}'})</Label>
                      <Input
                        value={newApp.affiliate_link_template}
                        onChange={(e) => setNewApp({ ...newApp, affiliate_link_template: e.target.value })}
                        placeholder="https://yoursite.com/ref/{affiliate_id}"
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                    <Button
                      onClick={handleSaveApp}
                      className="w-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A]"
                    >
                      {editingApp ? 'Update App' : 'Create App'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {apps.map(app => (
                <Card key={app.id} className="elvt-glass p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#F5F0EB] mb-2">{app.name}</h3>
                      <p className="text-[#E5E0DB] text-sm mb-3">{app.short_description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-[#D4AF37] text-[#0A0A0A]">${app.price}</Badge>
                        <Badge variant="outline">{app.commission_rate}% commission</Badge>
                        <Badge variant="outline">{app.category}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditApp(app)}
                        className="border-[#D4AF37] text-[#D4AF37]"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteAppMutation.mutate(app.id)}
                        className="text-red-400 hover:text-red-500"
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
            <h2 className="text-2xl font-bold text-[#F5F0EB] mb-6">Affiliate Management</h2>
            <div className="grid gap-4">
              {affiliates.map(affiliate => (
                <Card key={affiliate.id} className="elvt-glass p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#F5F0EB]">{affiliate.full_name}</h3>
                      <p className="text-sm text-[#E5E0DB]">{affiliate.user_email}</p>
                      <p className="text-sm text-[#D4AF37] mt-1">Slug: {affiliate.slug}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#D4AF37]">
                        ${(affiliate.total_earnings || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-[#E5E0DB]">Total Earnings</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Purchases Tab */}
          <TabsContent value="purchases">
            <h2 className="text-2xl font-bold text-[#F5F0EB] mb-6">All Purchases</h2>
            <div className="space-y-3">
              {purchases.map(purchase => (
                <Card key={purchase.id} className="elvt-glass p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-[#F5F0EB]">{purchase.product_name}</h4>
                      <p className="text-sm text-[#E5E0DB]">
                        {purchase.buyer_name} ({purchase.buyer_email})
                      </p>
                      <p className="text-xs text-[#E5E0DB] mt-1">
                        Via: {purchase.affiliate_slug || 'Direct'} · {new Date(purchase.created_date).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#D4AF37]">${purchase.amount}</p>
                      <p className="text-sm text-[#E5E0DB]">
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
              <h2 className="text-2xl font-bold text-[#F5F0EB]">Email Templates</h2>
              
              <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1A1A] border-[#D4AF37]/20 text-[#F5F0EB] max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gradient">Create Email Template</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Template Name</Label>
                      <Input
                        value={newEmail.name}
                        onChange={(e) => setNewEmail({ ...newEmail, name: e.target.value })}
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input
                        value={newEmail.subject}
                        onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                        placeholder="Use {buyer_name}, {app_name}, etc."
                        className="bg-[#0A0A0A] border-[#D4AF37]/20"
                      />
                    </div>
                    <div>
                      <Label>Body</Label>
                      <Textarea
                        value={newEmail.body}
                        onChange={(e) => setNewEmail({ ...newEmail, body: e.target.value })}
                        className="bg-[#0A0A0A] border-[#D4AF37]/20 min-h-32"
                      />
                    </div>
                    <Button
                      onClick={() => createEmailMutation.mutate(newEmail)}
                      className="w-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A]"
                    >
                      Create Template
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {emails.map(email => (
                <Card key={email.id} className="elvt-glass p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#F5F0EB] mb-1">{email.name}</h3>
                      <p className="text-sm text-[#E5E0DB] mb-2">Trigger: {email.trigger}</p>
                      <p className="text-sm text-[#D4AF37]">Subject: {email.subject}</p>
                    </div>
                    <Badge className={email.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                      {email.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
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