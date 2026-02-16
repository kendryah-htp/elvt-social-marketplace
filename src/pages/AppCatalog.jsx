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
import LazyImage from '@/components/LazyImage';
import { trackConversion } from '@/components/AnalyticsTracker';
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
  bestseller: "text-white",
  new: "bg-green-500 text-white",
  featured: "text-white",
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
    trackConversion('demo_viewed', { app_id: app.id, app_name: app.name });
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
      
      <div className="min-h-screen elvt-gradient pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-gradient slide-up px-4">
            Premium App Marketplace
          </h1>
          <p className="text-base md:text-xl slide-up px-4" style={{ color: 'var(--text-secondary)', animationDelay: '0.1s' }}>
            Discover world-class apps, templates, and training programs
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 md:mb-12 flex flex-col md:flex-row gap-3 md:gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5" style={{ color: 'var(--accent)' }} />
            <Input
              placeholder="Search apps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 md:pl-12 h-11 md:h-12 text-sm md:text-base"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-64 h-11 md:h-12 text-sm md:text-base" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="elvt-glass rounded-xl md:rounded-2xl p-4 md:p-6 animate-pulse">
                <div className="aspect-video bg-[#2A2A2A] rounded-lg mb-3 md:mb-4" />
                <div className="h-5 md:h-6 bg-[#2A2A2A] rounded mb-2 md:mb-3" />
                <div className="h-3 md:h-4 bg-[#2A2A2A] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredApps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 md:py-20"
          >
            <p className="text-lg md:text-2xl text-[#E5E0DB]">No apps found matching your criteria</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredApps.map((app, idx) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="fade-in-scale"
              >
                <Link to={createPageUrl('AppDetail') + '?id=' + app.id}>
                  <div className="elvt-glass rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col transition-all duration-300 hover:elvt-glow">
                    {app.thumbnail_url && (
                      <div className="aspect-video bg-[#2A2A2A] overflow-hidden">
                        <LazyImage
                          src={app.thumbnail_url}
                          alt={app.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          width={400}
                          height={300}
                        />
                      </div>
                    )}
                    
                    <div className="p-4 md:p-6 flex-1 flex flex-col">
                      {app.badges?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3">
                          {app.badges.map(badge => (
                            <Badge 
                              key={badge} 
                              className={`text-xs ${badgeStyles[badge]}`}
                              style={{ backgroundColor: badge === 'bestseller' || badge === 'featured' ? 'var(--accent)' : undefined }}
                            >
                              {badge.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {app.name}
                      </h3>
                      
                      {app.short_description && (
                        <p className="mb-3 md:mb-4 line-clamp-2 flex-1 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                          {app.short_description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <span className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--accent)' }}>
                            ${app.price}
                          </span>
                          {app.social_proof_purchases > 0 && (
                            <p className="text-xs md:text-sm mt-0.5 md:mt-1" style={{ color: 'var(--text-secondary)' }}>
                              {app.social_proof_purchases}+ purchases
                            </p>
                          )}
                        </div>
                        
                        {app.social_proof_rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" style={{ fill: 'var(--accent)', color: 'var(--accent)' }} />
                            <span className="text-sm md:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {app.social_proof_rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mt-3 md:mt-4">
                        {app.demo_url && (
                          <Button
                            onClick={(e) => handleViewDemo(app, e)}
                            className="flex-1 font-semibold hover:opacity-90 transition-all !text-inherit h-9 md:h-10 text-xs md:text-sm"
                            style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--accent)' }}
                          >
                            <Eye className="w-3 md:w-4 h-3 md:h-4 mr-1 md:mr-2" />
                            Demo
                          </Button>
                        )}
                        <Button className="flex-1 font-semibold pulse-glow text-white !text-inherit h-9 md:h-10 text-xs md:text-sm" style={{ backgroundColor: 'var(--accent)' }}>
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