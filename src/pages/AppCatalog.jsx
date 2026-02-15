import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, ShoppingCart, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AppDemoModal from '@/components/AppDemoModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "templates", label: "Templates" },
  { value: "training", label: "Training" },
  { value: "automation", label: "Automation" },
  { value: "funnels", label: "Funnels" },
  { value: "tools", label: "Tools" },
  { value: "snapshots", label: "Snapshots" }
];

const badgeStyles = {
  bestseller: "bg-[#D4AF37] text-[#0A0A0A]",
  new: "bg-green-500 text-white",
  featured: "bg-purple-500 text-white",
  award_winning: "bg-blue-500 text-white"
};

export default function AppCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [demoApp, setDemoApp] = useState(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleViewDemo = (app, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDemoApp(app);
    setIsDemoOpen(true);
  };

  const handleCloseDemo = () => {
    setIsDemoOpen(false);
    setTimeout(() => setDemoApp(null), 300);
  };

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ['apps'],
    queryFn: async () => {
      const allApps = await base44.entities.App.filter({ is_active: true });
      return allApps.sort((a, b) => (b.sort_order || 0) - (a.sort_order || 0));
    }
  });

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <AppDemoModal app={demoApp} isOpen={isDemoOpen} onClose={handleCloseDemo} />
      
      <div className="min-h-screen elvt-gradient">
        <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gradient">
            Premium App Marketplace
          </h1>
          <p className="text-xl text-[#E5E0DB]">
            Discover world-class apps, templates, and training programs
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
            <Input
              placeholder="Search apps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-[#1A1A1A] border-[#D4AF37]/20 text-[#F5F0EB] h-12"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-64 bg-[#1A1A1A] border-[#D4AF37]/20 text-[#F5F0EB] h-12">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Apps Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="elvt-glass rounded-2xl p-6 animate-pulse">
                <div className="aspect-video bg-[#2A2A2A] rounded-lg mb-4" />
                <div className="h-6 bg-[#2A2A2A] rounded mb-3" />
                <div className="h-4 bg-[#2A2A2A] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredApps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-[#E5E0DB]">No apps found matching your criteria</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApps.map((app, idx) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8 }}
              >
                <Link to={createPageUrl('AppDetail') + '?id=' + app.id}>
                  <div className="elvt-glass rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col">
                    {app.thumbnail_url && (
                      <div className="aspect-video bg-[#2A2A2A] overflow-hidden">
                        <img
                          src={app.thumbnail_url}
                          alt={app.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="p-6 flex-1 flex flex-col">
                      {app.badges?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {app.badges.map(badge => (
                            <Badge key={badge} className={badgeStyles[badge]}>
                              {badge.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <h3 className="text-2xl font-bold text-[#F5F0EB] mb-3 group-hover:text-[#D4AF37] transition-colors">
                        {app.name}
                      </h3>
                      
                      {app.short_description && (
                        <p className="text-[#E5E0DB] mb-4 line-clamp-2 flex-1">
                          {app.short_description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <span className="text-3xl font-bold text-[#D4AF37]">
                            ${app.price}
                          </span>
                          {app.social_proof_purchases > 0 && (
                            <p className="text-sm text-[#E5E0DB] mt-1">
                              {app.social_proof_purchases}+ purchases
                            </p>
                          )}
                        </div>
                        
                        {app.social_proof_rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                            <span className="text-[#F5F0EB] font-semibold">
                              {app.social_proof_rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        {app.demo_url && (
                          <Button
                            onClick={(e) => handleViewDemo(app, e)}
                            className="flex-1 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#D4AF37] font-semibold border border-[#D4AF37]/30"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Demo
                          </Button>
                        )}
                        <Button className="flex-1 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] font-semibold">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        </div>
      </div>
    </>
  );
}