import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppDemoModal({ app, isOpen, onClose }) {
  if (!isOpen || !app) return null;

  const handleLandingPageClick = () => {
    if (app.landing_page_url) {
      window.open(app.landing_page_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-[90%] h-[90%] bg-[#1A1A1A] rounded-2xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navigation Bar */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#D4AF37]/20 flex items-center justify-between px-6 z-10">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-[#F5F0EB]">{app.name}</h3>
                <div className="h-6 w-px bg-[#D4AF37]/30" />
                <p className="text-sm text-[#A0A0A0]">Live Demo</p>
              </div>

              <div className="flex items-center gap-3">
                {app.landing_page_url && (
                  <Button
                    onClick={handleLandingPageClick}
                    className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] font-semibold"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Page
                  </Button>
                )}
                
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-lg bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#D4AF37]/20 flex items-center justify-center transition-all hover:border-[#D4AF37]/40"
                >
                  <X className="w-5 h-5 text-[#D4AF37]" />
                </button>
              </div>
            </div>

            {/* Demo Content */}
            <div className="absolute inset-0 top-16">
              {app.demo_url ? (
                <iframe
                  src={app.demo_url}
                  className="w-full h-full border-none"
                  title={`${app.name} Demo`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xl text-[#E5E0DB] mb-2">No demo available</p>
                    <p className="text-sm text-[#A0A0A0]">Contact admin to set up a demo URL</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}