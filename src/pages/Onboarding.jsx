import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, ArrowLeft, Check, Palette, AppWindow, User, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

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

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.AffiliateProfile.filter({ user_email: user.email });
      if (!profiles[0]) throw new Error('Profile not found');
      return profiles[0];
    },
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
    },
    onError: (err) => {
      console.error('Profile update failed:', err);
    }
  });

  useEffect(() => {
    if (!profileLoading && !profile) {
      navigate(createPageUrl('Join'));
    } else if (profile?.onboarding_completed) {
      navigate(createPageUrl('AffiliateDashboard'));
    }
  }, [profile, profileLoading, navigate]);

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

  if (!user || (profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#7C3AED', borderTopColor: 'transparent' }} />
          <p style={{ color: '#2E2E42' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  s <= step ? 'text-white' : ''
                }`} style={{ 
                  backgroundColor: s <= step ? '#7C3AED' : '#F0EDFF',
                  color: s <= step ? 'white' : '#6B6B80'
                }}>
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 transition-all`} style={{ backgroundColor: s < step ? '#7C3AED' : '#F0EDFF' }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm" style={{ color: '#6B6B80' }}>
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
              className="rounded-2xl p-8 border shadow-xl" style={{ 
                backgroundColor: 'white',
                borderColor: 'rgba(139, 92, 246, 0.15)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-8 h-8" style={{ color: '#7C3AED' }} />
                <h2 className="text-3xl font-bold" style={{ 
                  background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Choose Your Theme</h2>
              </div>
              
              <p className="mb-8" style={{ color: '#2E2E42' }}>
                Select the visual style for your affiliate storefront
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {themes.map(theme => (
                  <motion.div
                    key={theme.value}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setFormData({ ...formData, theme: theme.value })}
                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all shadow-md hover:shadow-lg ${
                      formData.theme === theme.value 
                        ? 'shadow-xl' 
                        : 'hover:opacity-80'
                    }`}
                    style={{ 
                      borderColor: formData.theme === theme.value ? '#7C3AED' : 'rgba(139, 92, 246, 0.15)'
                    }}
                  >
                    <div className={`h-32 ${theme.preview}`} />
                    <div className="p-4" style={{ backgroundColor: '#F8F7FF' }}>
                      <h3 className="font-bold mb-1" style={{ color: '#1A1A2E' }}>{theme.name}</h3>
                      <p className="text-sm" style={{ color: '#2E2E42' }}>{theme.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="font-semibold text-white shadow-lg"
                  style={{ backgroundColor: '#7C3AED' }}
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
              className="rounded-2xl p-8 border shadow-xl" style={{ 
                backgroundColor: 'white',
                borderColor: 'rgba(139, 92, 246, 0.15)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <AppWindow className="w-8 h-8" style={{ color: '#7C3AED' }} />
                <h2 className="text-3xl font-bold" style={{ 
                  background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Select Apps to Promote</h2>
              </div>
              
              <p className="mb-8" style={{ color: '#2E2E42' }}>
                Choose which apps you want to feature on your storefront (you can change this anytime)
              </p>

              <div className="max-h-96 overflow-y-auto space-y-3 mb-8">
                {apps.map(app => (
                  <div
                    key={app.id}
                    onClick={() => toggleApp(app.id)}
                    className="flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all hover:opacity-80 shadow-md" style={{ 
                      backgroundColor: 'white',
                      borderColor: 'rgba(139, 92, 246, 0.15)'
                    }}
                  >
                    <Checkbox checked={formData.selectedApps.includes(app.id)} />
                    <div className="flex-1">
                      <h4 className="font-semibold" style={{ color: '#1A1A2E' }}>{app.name}</h4>
                      <p className="text-sm" style={{ color: '#2E2E42' }}>{app.short_description}</p>
                    </div>
                    <span className="font-bold" style={{ color: '#7C3AED' }}>${app.price}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  size="lg"
                  style={{ borderColor: '#7C3AED', color: '#7C3AED' }}
                >
                  <ArrowLeft className="mr-2 w-5 h-5" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  size="lg"
                  disabled={formData.selectedApps.length === 0}
                  className="font-semibold text-white shadow-lg"
                  style={{ backgroundColor: '#7C3AED' }}
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
              className="rounded-2xl p-8 border shadow-xl" style={{ 
                backgroundColor: 'white',
                borderColor: 'rgba(139, 92, 246, 0.15)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <User className="w-8 h-8" style={{ color: '#7C3AED' }} />
                <h2 className="text-3xl font-bold" style={{ 
                  background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Personalize Your Storefront</h2>
              </div>
              
              <p className="mb-8" style={{ color: '#2E2E42' }}>
                Add your bio and social links (optional)
              </p>

              <div className="space-y-6 mb-8">
                <div>
                  <Label className="mb-2" style={{ color: '#1A1A2E' }}>Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell people about yourself..."
                    className="min-h-24"
                    style={{ backgroundColor: '#F8F7FF', borderColor: 'rgba(139, 92, 246, 0.2)', color: '#1A1A2E' }}
                  />
                </div>

                <div>
                  <Label className="mb-2" style={{ color: '#1A1A2E' }}>Profile Image URL (optional)</Label>
                  <Input
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    placeholder="https://..."
                    style={{ backgroundColor: '#F8F7FF', borderColor: 'rgba(139, 92, 246, 0.2)', color: '#1A1A2E' }}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {['instagram', 'youtube', 'facebook', 'linkedin', 'twitter', 'website'].map(platform => (
                    <div key={platform}>
                      <Label className="mb-2 capitalize" style={{ color: '#1A1A2E' }}>{platform}</Label>
                      <Input
                        value={formData.social_links[platform] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          social_links: { ...formData.social_links, [platform]: e.target.value }
                        })}
                        placeholder={`https://${platform}.com/...`}
                        style={{ backgroundColor: '#F8F7FF', borderColor: 'rgba(139, 92, 246, 0.2)', color: '#1A1A2E' }}
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
                  style={{ borderColor: '#7C3AED', color: '#7C3AED' }}
                >
                  <ArrowLeft className="mr-2 w-5 h-5" /> Back
                </Button>
                <Button
                  onClick={handleComplete}
                  size="lg"
                  disabled={updateProfileMutation.isLoading}
                  className="font-bold shadow-lg"
                  style={{ backgroundColor: '#7C3AED', color: 'white' }}
                >
                  {updateProfileMutation.isLoading ? (
                    <>
                      <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Storefront...
                    </>
                  ) : (
                    <>
                      Launch My Storefront
                      <Check className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}