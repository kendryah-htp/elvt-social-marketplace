import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Copy, Download, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ContentStudio() {
  const queryClient = useQueryClient();
  const [contentType, setContentType] = useState('blog_post');
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  // Fetch user and brand voice configs
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: brandVoices = [] } = useQuery({
    queryKey: ['brand-voices', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.MiloBrandVoiceConfig.filter({ user_email: user.email, is_active: true });
    },
    enabled: !!user?.email
  });

  const { data: knowledgeItems = [] } = useQuery({
    queryKey: ['knowledge-items', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.MiloKnowledgeItem.filter({ user_email: user.email, is_active: true });
    },
    enabled: !!user?.email
  });

  const generateContent = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedContent('');

    try {
      // Build context from brand voice and knowledge items
      const selectedBrandVoice = brandVoices.find(v => v.id === selectedVoiceId);
      const contextParts = [];

      if (selectedBrandVoice) {
        contextParts.push(`Brand Voice: ${selectedBrandVoice.voice_description}`);
        if (selectedBrandVoice.key_values?.length) {
          contextParts.push(`Key Values: ${selectedBrandVoice.key_values.join(', ')}`);
        }
        if (selectedBrandVoice.unique_phrases?.length) {
          contextParts.push(`Signature Phrases: ${selectedBrandVoice.unique_phrases.join(', ')}`);
        }
      }

      if (knowledgeItems.length > 0) {
        const relevantKnowledge = knowledgeItems
          .filter(k => k.priority !== 'low')
          .slice(0, 3)
          .map(k => k.content)
          .join('\n\n');
        contextParts.push(`Relevant Knowledge:\n${relevantKnowledge}`);
      }

      const context = contextParts.join('\n\n');

      const prompt = `You are writing ${contentType === 'blog_post' ? 'a comprehensive blog post' : contentType === 'social_post' ? 'an engaging social media post' : 'an email'} about: "${topic}"

${context ? `\nContext about the brand:\n${context}` : ''}

Generate high-quality, original content that is engaging and authentic. For blog posts, include an introduction, main sections, and conclusion. For social posts, keep it concise and platform-optimized. For emails, include a compelling subject line.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: contentType === 'blog_post'
      });

      setGeneratedContent(response);

      // Track AI usage
      base44.analytics.track({
        eventName: 'ai_content_generated',
        properties: {
          content_type: contentType,
          has_brand_voice: !!selectedVoiceId,
          knowledge_items_used: knowledgeItems.length
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const downloadAsMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `content_${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="w-10 md:w-12 h-10 md:h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F0EDFF' }}>
              <Sparkles className="w-5 md:w-6 h-5 md:h-6" style={{ color: '#7C3AED' }} />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold" style={{ 
              background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Content Studio</h1>
          </div>
          <p className="text-sm md:text-base" style={{ color: '#6B6B80' }}>Generate high-quality content in your brand voice instantly</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-8 border shadow-xl" style={{ 
              backgroundColor: 'white',
              borderColor: 'rgba(139, 92, 246, 0.15)'
            }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A1A2E' }}>Create Content</h2>

            <div className="space-y-6">
              {/* Content Type */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#1A1A2E' }}>Content Type</label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog_post">Blog Post</SelectItem>
                    <SelectItem value="social_post">Social Media Post</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Voice */}
              {brandVoices.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: '#1A1A2E' }}>Brand Voice (Optional)</label>
                  <Select value={selectedVoiceId} onValueChange={setSelectedVoiceId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a brand voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandVoices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.brand_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Topic Input */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#1A1A2E' }}>Topic or Keywords</label>
                <Textarea
                  placeholder={`Enter the topic for your ${contentType === 'blog_post' ? 'blog post' : contentType === 'social_post' ? 'social post' : 'email'}...`}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="min-h-24"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex gap-3 p-4 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #EF4444' }}>
                  <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#EF4444' }} />
                  <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={generateContent}
                disabled={isGenerating || !topic.trim()}
                size="lg"
                className="w-full font-bold py-6 shadow-lg"
                style={{ backgroundColor: '#7C3AED', color: 'white' }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Output Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-8 border shadow-xl" style={{ 
              backgroundColor: 'white',
              borderColor: 'rgba(139, 92, 246, 0.15)'
            }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A1A2E' }}>Generated Content</h2>

            {generatedContent ? (
              <div className="space-y-4">
                <div
                  className="p-6 rounded-lg max-h-96 overflow-y-auto border shadow-sm"
                  style={{ backgroundColor: '#F8F7FF', borderColor: 'rgba(139, 92, 246, 0.15)' }}
                >
                  <p style={{ color: '#1A1A2E', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {generatedContent}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="flex-1"
                    style={{ borderColor: '#7C3AED', color: '#7C3AED' }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    onClick={downloadAsMarkdown}
                    variant="outline"
                    className="flex-1"
                    style={{ borderColor: '#7C3AED', color: '#7C3AED' }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg border shadow-sm" style={{ 
                  backgroundColor: '#ECFDF5',
                  borderLeftColor: '#10B981',
                  borderLeftWidth: '3px'
                }}>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#10B981' }} />
                  <p className="text-sm" style={{ color: '#047857' }}>Content generated successfully</p>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center p-12 rounded-lg text-center border shadow-sm"
                style={{ backgroundColor: '#F8F7FF', borderColor: 'rgba(139, 92, 246, 0.15)' }}
              >
                <Sparkles className="w-12 h-12 mb-4" style={{ color: '#9CA3AF' }} />
                <p style={{ color: '#9CA3AF' }}>Generate content to see it here</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}