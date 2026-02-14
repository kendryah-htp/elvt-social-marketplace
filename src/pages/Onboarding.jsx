import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, ArrowLeft, Check, Palette, AppWindow, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils';

const themes = [
  { value: 'luxury', name: 'Luxury', description: 'Dark premium aesthetic with gold accents', preview: 'bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]' },
  { value: 'minimal', name: 'Minimal', description: 'Clean and simple white design', preview: 'bg-white border border-gray-200' },
  { value: 'vibrant', name: 'Vibrant', description: 'Colorful and energetic gradients', preview: 'bg-gradient-to-br from-purple-600 to-pink-500' }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    theme: 'luxury',
    selectedApps: [],
    bio: '',
    avatar_url: '',
    social_links: {}
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.email],
    queryFn: () => base44.entities.AffiliateProfile.filter({ user_email: user.email }),
    select: (data) => data[0],
    enabled: !!user
  });

  const { data: apps = [] } = useQuery({
    queryKey: ['apps-onboarding'],
    queryFn: () => base44.entities.App.filter({ is_active: true })
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.AffiliateProfile.update(profile.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      navigate(createPageUrl('AffiliateDashboard'));
    }
  });

  useEffect(() => {
    if (profile?.onboarding_completed) {
      navigate(createPageUrl('AffiliateDashboard'));
    }
  }, [profile, navigate]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = () => {
    updateProfileMutation.mutate({
      theme: formData.theme,
      selected_app_ids: formData.selectedApps,
      bio: formData.bio,
      avatar_url: formData.avatar_url,
      social_links: formData.social_links,
      onboarding_completed: true
    });
  };

  const toggleApp = (appId) => {
    setFormData(prev => ({
      ...prev,
      selectedApps: prev.selectedApps.includes(appId)
        ? prev.selectedApps.filter(id => id !== appId)
        : [...prev.selectedApps, appId]
    }));
  };

  return (
    <div className="min-h-screen elvt-gradient flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  s <= step ? 'bg-[#D4AF37] text-[#0A0A0A]' : 'bg-[#2A2A2A] text-[#E5E0DB]'
                }`}>
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-[#D4AF37]' : 'bg-[#2A2A2A]'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-[#E5E0DB]">
            <span>Choose Theme</span>
            <span>Select Apps</span>
            <span>Personalize</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Choose Theme */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="elvt-glass rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-8 h-8 text-[#D4AF37]" />
                <h2 className="text-3xl font-bold text-gradient">Choose Your Theme</h2>
              </div>
              
              <p className="text-[#E5E0DB] mb-8">
                Select the visual style for your affiliate storefront
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {themes.map(theme => (
                  <motion.div
                    key={theme.value}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setFormData({ ...formData, theme: theme.value })}
                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                      formData.theme === theme.value 
                        ? 'border-[#D4AF37] elvt-gold-glow' 
                        : 'border-[#2A2A2A] hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <div className={`h-32 ${theme.preview}`} />
                    <div className="p-4 bg-[#1A1A1A]">
                      <h3 className="font-bold text-[#F5F0EB] mb-1">{theme.name}</h3>
                      <p className="text-sm text-[#E5E0DB]">{theme.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] font-semibold"
                >
                  Continue <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Apps */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="elvt-glass rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <AppWindow className="w-8 h-8 text-[#D4AF37]" />
                <h2 className="text-3xl font-bold text-gradient">Select Apps to Promote</h2>
              </div>
              
              <p className="text-[#E5E0DB] mb-8">
                Choose which apps you want to feature on your storefront (you can change this anytime)
              </p>

              <div className="max-h-96 overflow-y-auto space-y-3 mb-8">
                {apps.map(app => (
                  <div
                    key={app.id}
                    onClick={() => toggleApp(app.id)}
                    className="flex items-center gap-4 p-4 elvt-glass rounded-lg cursor-pointer hover:border-[#D4AF37]/50 border border-transparent transition-all"
                  >
                    <Checkbox checked={formData.selectedApps.includes(app.id)} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#F5F0EB]">{app.name}</h4>
                      <p className="text-sm text-[#E5E0DB]">{app.short_description}</p>
                    </div>
                    <span className="text-[#D4AF37] font-bold">${app.price}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  size="lg"
                  className="border-[#D4AF37] text-[#D4AF37]"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  size="lg"
                  disabled={formData.selectedApps.length === 0}
                  className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] font-semibold"
                >
                  Continue <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Personalize */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="elvt-glass rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <User className="w-8 h-8 text-[#D4AF37]" />
                <h2 className="text-3xl font-bold text-gradient">Personalize Your Storefront</h2>
              </div>
              
              <p className="text-[#E5E0DB] mb-8">
                Add your bio and social links (optional)
              </p>

              <div className="space-y-6 mb-8">
                <div>
                  <Label className="text-[#F5F0EB] mb-2">Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell people about yourself..."
                    className="bg-[#1A1A1A] border-[#D4AF37]/20 text-[#F5F0EB] min-h-24"
                  />
                </div>

                <div>
                  <Label className="text-[#F5F0EB] mb-2">Profile Image URL (optional)</Label>
                  <Input
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    placeholder="https://..."
                    className="bg-[#1A1A1A] border-[#D4AF37]/20 text-[#F5F0EB]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {['instagram', 'youtube', 'facebook', 'linkedin', 'twitter', 'website'].map(platform => (
                    <div key={platform}>
                      <Label className="text-[#F5F0EB] mb-2 capitalize">{platform}</Label>
                      <Input
                        value={formData.social_links[platform] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          social_links: { ...formData.social_links, [platform]: e.target.value }
                        })}
                        placeholder={`https://${platform}.com/...`}
                        className="bg-[#1A1A1A] border-[#D4AF37]/20 text-[#F5F0EB]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  size="lg"
                  className="border-[#D4AF37] text-[#D4AF37]"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" /> Back
                </Button>
                <Button
                  onClick={handleComplete}
                  size="lg"
                  disabled={updateProfileMutation.isLoading}
                  className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] font-bold"
                >
                  {updateProfileMutation.isLoading ? 'Creating Storefront...' : 'Launch My Storefront'}
                  <Check className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}