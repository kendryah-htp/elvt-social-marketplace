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
import AppDemoModal from '@/components/AppDemoModal';

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
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

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
    if (!appId) {
      console.error('App ID not found');
      return;
    }
    const ref = urlParams.get('ref');
    navigate(createPageUrl('PurchaseFlow') + '?appId=' + appId + (ref ? '&ref=' + ref : ''));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="aspect-video rounded-2xl animate-pulse" style={{ backgroundColor: '#F0EDFF' }} />
              <div className="h-12 rounded animate-pulse" style={{ backgroundColor: '#F0EDFF' }} />
            </div>
            <div className="space-y-6">
              <div className="h-12 rounded animate-pulse" style={{ backgroundColor: '#F0EDFF' }} />
              <div className="h-8 rounded animate-pulse" style={{ backgroundColor: '#F0EDFF' }} />
              <div className="h-24 rounded animate-pulse" style={{ backgroundColor: '#F0EDFF' }} />
              <div className="h-16 rounded animate-pulse" style={{ backgroundColor: '#F0EDFF' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="text-center">
          <p className="text-xl md:text-2xl mb-4 md:mb-6" style={{ color: '#2E2E42' }}>App not found</p>
          <Link to={createPageUrl('AppCatalog')}>
            <Button className="text-white h-11 md:h-12" style={{ backgroundColor: '#7C3AED' }}>
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
      <AppDemoModal app={app} isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      
      <div className="min-h-screen pb-24 md:pb-12" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-12">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 md:mb-8"
          >
            <Link to={createPageUrl('AppCatalog')}>
              <Button variant="ghost" className="h-10 md:h-11" style={{ color: '#7C3AED' }}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Catalog
              </Button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {!showDemo && app.thumbnail_url && (
                <div className="aspect-video rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-6" style={{ backgroundColor: '#F0EDFF' }}>
                  <img
                    src={app.thumbnail_url}
                    alt={app.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {showDemo && app.demo_url && (
                <div className="aspect-video rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-6 border shadow-lg" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)'
                }}>
                  <iframe
                    src={app.demo_url}
                    className="w-full h-full"
                    title={`${app.name} Demo`}
                    allowFullScreen
                  />
                </div>
              )}

              {app.demo_url && (
                <Button
                  onClick={() => setIsDemoModalOpen(true)}
                  variant="outline"
                  className="w-full mb-4 md:mb-6 h-11 md:h-12 hidden md:flex"
                  style={{ borderColor: '#7C3AED', color: '#7C3AED' }}
                >
                  <Eye className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                  View Live Demo
                </Button>
              )}

              {/* Features */}
              {app.features?.length > 0 && (
                <div className="rounded-xl md:rounded-2xl p-4 md:p-6 border shadow-lg" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)'
                }}>
                  <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4" style={{ color: '#1A1A2E' }}>Key Features</h3>
                  <ul className="space-y-2 md:space-y-3">
                    {app.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 md:gap-3">
                        <Check className="w-4 md:w-5 h-4 md:h-5 mt-0.5 flex-shrink-0" style={{ color: '#7C3AED' }} />
                        <span className="text-sm md:text-base" style={{ color: '#2E2E42' }}>{feature}</span>
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
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                  {app.badges.map(badge => (
                    <Badge key={badge} className={`text-xs ${badgeStyles[badge]}`}>
                      {badge.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  ))}
                </div>
              )}

              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4" style={{ 
                background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {app.name}
              </h1>

              <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-6">
                <div className="text-3xl md:text-5xl font-bold" style={{ color: '#7C3AED' }}>
                  ${app.price}
                </div>
                
                {app.social_proof_rating && (
                  <div className="flex items-center gap-1 md:gap-2">
                    <Star className="w-4 md:w-5 h-4 md:h-5" style={{ fill: '#7C3AED', color: '#7C3AED' }} />
                    <span className="text-lg md:text-xl font-semibold" style={{ color: '#1A1A2E' }}>
                      {app.social_proof_rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {app.social_proof_purchases > 0 && (
                <p className="text-sm md:text-base mb-4 md:mb-6" style={{ color: '#6B6B80' }}>
                  ✨ Trusted by {app.social_proof_purchases}+ customers
                </p>
              )}

              <div className="rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6 hidden md:block border shadow-lg" style={{ 
                backgroundColor: 'white',
                borderColor: 'rgba(139, 92, 246, 0.15)'
              }}>
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3" style={{ color: '#1A1A2E' }}>Description</h3>
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-line" style={{ color: '#2E2E42' }}>
                  {app.description || app.short_description}
                </p>
              </div>

              <div className="space-y-3 md:space-y-4 hidden md:block">
                <Button
                  onClick={handlePurchase}
                  size="lg"
                  className="w-full font-bold py-5 md:py-6 text-base md:text-lg h-12 md:h-auto text-white"
                  style={{ backgroundColor: '#7C3AED' }}
                >
                  <ShoppingCart className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                  Purchase Now
                </Button>

                <div className="rounded-xl p-3 md:p-4 border shadow-md" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)'
                }}>
                  <p className="text-xs md:text-sm text-center" style={{ color: '#6B6B80' }}>
                    💰 Earn {app.commission_rate}% commission by sharing this app
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile Fixed Bottom CTA */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t p-4 z-50 shadow-2xl" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <div className="flex gap-2">
            {app.demo_url && (
              <Button
                onClick={() => setIsDemoModalOpen(true)}
                variant="outline"
                className="flex-1 h-12"
                style={{ borderColor: '#7C3AED', color: '#7C3AED' }}
              >
                <Eye className="w-4 h-4 mr-1" />
                Demo
              </Button>
            )}
            <Button
              onClick={handlePurchase}
              className="flex-1 h-12 font-bold text-white"
              style={{ backgroundColor: '#7C3AED' }}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Buy ${app.price}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}