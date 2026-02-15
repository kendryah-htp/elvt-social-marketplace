import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Check, ShoppingCart, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import QuoteLoader from '@/components/QuoteLoader';

const badgeStyles = {
  bestseller: "bg-[#D4AF37] text-[#0A0A0A]",
  new: "bg-green-500 text-white",
  featured: "bg-purple-500 text-white",
  award_winning: "bg-blue-500 text-white"
};

export default function AppDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const appId = urlParams.get('id');
  const [showLoader, setShowLoader] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const { data: app, isLoading } = useQuery({
    queryKey: ['app', appId],
    queryFn: () => base44.entities.App.filter({ id: appId }),
    select: (data) => data[0],
    enabled: !!appId
  });

  const handleViewDemo = () => {
    setShowLoader(true);
  };

  const handleLoaderComplete = () => {
    setShowLoader(false);
    setShowDemo(true);
  };

  const handlePurchase = () => {
    const ref = urlParams.get('ref');
    navigate(createPageUrl('PurchaseFlow') + '?appId=' + appId + (ref ? '&ref=' + ref : ''));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen elvt-gradient">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="aspect-video bg-[#2A2A2A] rounded-2xl animate-pulse" />
              <div className="h-12 bg-[#2A2A2A] rounded animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-12 bg-[#2A2A2A] rounded animate-pulse" />
              <div className="h-8 bg-[#2A2A2A] rounded animate-pulse" />
              <div className="h-24 bg-[#2A2A2A] rounded animate-pulse" />
              <div className="h-16 bg-[#2A2A2A] rounded animate-pulse" />
            </div>
          </div>
          </div>
          </div>
          </>
          );
          }

  if (!app) {
    return (
      <div className="min-h-screen elvt-gradient flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-[#E5E0DB] mb-6">App not found</p>
          <Link to={createPageUrl('AppCatalog')}>
            <Button className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A]">
              Back to Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {showLoader && <QuoteLoader onComplete={handleLoaderComplete} />}
      
      <div className="min-h-screen elvt-gradient">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link to={createPageUrl('AppCatalog')}>
              <Button variant="ghost" className="text-[#D4AF37] hover:text-[#E5C158]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Catalog
              </Button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {!showDemo && app.thumbnail_url && (
                <div className="aspect-video bg-[#2A2A2A] rounded-2xl overflow-hidden mb-6">
                  <img
                    src={app.thumbnail_url}
                    alt={app.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {showDemo && app.demo_url && (
                <div className="aspect-video rounded-2xl overflow-hidden mb-6 elvt-glass">
                  <iframe
                    src={app.demo_url}
                    className="w-full h-full"
                    title={`${app.name} Demo`}
                    allowFullScreen
                  />
                </div>
              )}

              {app.demo_url && !showDemo && (
                <Button
                  onClick={handleViewDemo}
                  variant="outline"
                  className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0A] mb-6"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View Live Demo
                </Button>
              )}

              {/* Features */}
              {app.features?.length > 0 && (
                <div className="elvt-glass rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-[#F5F0EB] mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {app.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                        <span className="text-[#E5E0DB]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Badges */}
              {app.badges?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {app.badges.map(badge => (
                    <Badge key={badge} className={badgeStyles[badge]}>
                      {badge.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  ))}
                </div>
              )}

              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
                {app.name}
              </h1>

              <div className="flex items-center gap-6 mb-6">
                <div className="text-5xl font-bold text-[#D4AF37]">
                  ${app.price}
                </div>
                
                {app.social_proof_rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                    <span className="text-xl font-semibold text-[#F5F0EB]">
                      {app.social_proof_rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {app.social_proof_purchases > 0 && (
                <p className="text-[#E5E0DB] mb-6">
                  ✨ Trusted by {app.social_proof_purchases}+ customers
                </p>
              )}

              <div className="elvt-glass rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#F5F0EB] mb-3">Description</h3>
                <p className="text-[#E5E0DB] leading-relaxed whitespace-pre-line">
                  {app.description || app.short_description}
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handlePurchase}
                  size="lg"
                  className="w-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] font-bold py-6 text-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Purchase Now
                </Button>

                <div className="elvt-glass rounded-xl p-4">
                  <p className="text-sm text-[#E5E0DB] text-center">
                    💰 Earn {app.commission_rate}% commission by sharing this app
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}