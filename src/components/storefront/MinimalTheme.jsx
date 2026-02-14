import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Facebook, Linkedin, Twitter, Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const socialIcons = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  website: Globe
};

export default function MinimalTheme({ profile, apps, products, onAppClick, onProductClick }) {
  const activeSocials = Object.entries(profile.social_links || {}).filter(([_, url]) => url);

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A]">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {profile.avatar_url && (
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-2 border-[#0A0A0A]"
            />
          )}
          
          <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
            {profile.full_name}
          </h1>
          
          {profile.bio && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 font-light">
              {profile.bio}
            </p>
          )}
          
          {activeSocials.length > 0 && (
            <div className="flex justify-center gap-3 mb-8">
              {activeSocials.map(([platform, url]) => {
                const Icon = socialIcons[platform];
                return Icon ? (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="w-10 h-10 rounded-full border border-[#0A0A0A] flex items-center justify-center text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ) : null;
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Apps Section */}
      {apps.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="space-y-4">
            {apps.map((app, idx) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onAppClick(app)}
                className="border border-[#E5E0DB] rounded-lg p-6 cursor-pointer hover:border-[#0A0A0A] hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-medium mb-1 group-hover:text-[#D4AF37] transition-colors">
                      {app.name}
                    </h3>
                    {app.short_description && (
                      <p className="text-gray-600 text-sm">
                        {app.short_description}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-6">
                    <p className="text-2xl font-light">${app.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Products Section */}
      {products.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="border-t border-[#E5E0DB] pt-12">
            <h2 className="text-2xl font-light mb-8 text-center">My Products</h2>
            <div className="space-y-4">
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border border-[#E5E0DB] rounded-lg p-6 hover:border-[#0A0A0A] hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-medium mb-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-gray-600 text-sm">{product.description}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => window.open(product.external_link, '_blank')}
                      variant="outline"
                      className="ml-6"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-[#E5E0DB] py-8 mt-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm font-light">
            Powered by <span className="font-medium text-[#0A0A0A]">ELVT Social</span>
          </p>
        </div>
      </div>
    </div>
  );
}