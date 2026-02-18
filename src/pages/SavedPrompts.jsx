import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PromptEditorForm from '@/components/PromptEditorForm';
import PromptCard from '@/components/PromptCard';
import VariablesDrawer from '@/components/VariablesDrawer';
import CopyButton from '@/components/CopyButton';

// Super Admin emails - hardwired for authorization
const SUPER_ADMIN_EMAILS = [
  'kendryah@gmail.com',
  'support@highticketpurpose.com',
  'support@elvt.social',
  'denahornsby@yahoo.com'
];

const isSuperAdmin = (email) => email && SUPER_ADMIN_EMAILS.includes(email.toLowerCase());

export default function SavedPrompts() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [sortBy, setSortBy] = useState('-created_date');
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showVariablesDrawer, setShowVariablesDrawer] = useState(false);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        toast.error('Authentication failed');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch prompts
  const { data: prompts = [], isLoading: promptsLoading } = useQuery({
    queryKey: ['savedPrompts', searchTerm, selectedCategory, selectedStatus, sortBy, user?.email],
    queryFn: async () => {
      if (!user?.email) return [];

      const query = {
        status: selectedStatus || undefined
      };

      if (searchTerm) {
        // Note: Base44 filter doesn't support partial text search, so we'll filter client-side
        query.title = searchTerm;
      }

      if (selectedCategory) {
        query.category = selectedCategory;
      }

      try {
        const results = await base44.entities.SavedPrompt.filter(query);
        
        // Client-side filtering for search and tags
        let filtered = results.filter(prompt => {
          // Permission check: can user read this prompt?
          if (isSuperAdmin(user.email)) return true;
          if (prompt.status === 'active' && !prompt.owner_email) return true;
          if (prompt.owner_email === user.email) return true;
          return false;
        });

        // Filter by search term (partial match on title and prompt body)
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(term) || 
            p.prompt_body.toLowerCase().includes(term)
          );
        }

        // Filter by tags
        if (selectedTags.length > 0) {
          filtered = filtered.filter(p => 
            selectedTags.some(tag => p.tags?.includes(tag))
          );
        }

        // Sort
        if (sortBy === '-use_count') {
          filtered.sort((a, b) => (b.use_count || 0) - (a.use_count || 0));
        } else if (sortBy === '-last_used_at') {
          filtered.sort((a, b) => 
            new Date(b.last_used_at || 0) - new Date(a.last_used_at || 0)
          );
        } else if (sortBy === '-created_date') {
          filtered.sort((a, b) => 
            new Date(b.created_date || 0) - new Date(a.created_date || 0)
          );
        } else if (sortBy === 'title') {
          filtered.sort((a, b) => a.title.localeCompare(b.title));
        }

        return filtered;
      } catch (err) {
        console.error('Failed to fetch prompts:', err);
        toast.error('Failed to load prompts');
        return [];
      }
    },
    enabled: !!user?.email,
    staleTime: 30000 // 30 second cache
  });

  // Query client for mutations
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['promptCategories'],
    queryFn: async () => {
      try {
        const result = await base44.entities.PromptCategory.list();
        return result.map(c => c.name);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        return [];
      }
    }
  });

  // Fetch tags
  const { data: allTags = [] } = useQuery({
    queryKey: ['promptTags'],
    queryFn: async () => {
      try {
        const result = await base44.entities.PromptTag.list();
        return result.map(t => t.name);
      } catch (err) {
        console.error('Failed to fetch tags:', err);
        return [];
      }
    }
  });

  // Save/Update Prompt Mutation
  const savePromptMutation = useMutation({
    mutationFn: async (formData) => {
      if (selectedPrompt?.id) {
        return await base44.entities.SavedPrompt.update(selectedPrompt.id, formData);
      } else {
        return await base44.entities.SavedPrompt.create({
          ...formData,
          owner_email: isSuperAdmin(user.email) ? null : user.email
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedPrompts'] });
      toast.success(selectedPrompt?.id ? 'Prompt updated' : 'Prompt created');
      setSelectedPrompt(null);
      setIsEditing(false);
    },
    onError: (err) => {
      console.error('Failed to save prompt:', err);
      toast.error('Failed to save prompt');
    }
  });

  // Delete Prompt Mutation
  const deletePromptMutation = useMutation({
    mutationFn: async (promptId) => {
      return await base44.entities.SavedPrompt.delete(promptId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedPrompts'] });
      toast.success('Prompt deleted');
      setSelectedPrompt(null);
    },
    onError: (err) => {
      console.error('Failed to delete prompt:', err);
      toast.error('Failed to delete prompt');
    }
  });

  // Pin/Unpin Mutation
  const pinPromptMutation = useMutation({
    mutationFn: async ({ promptId, isPinned }) => {
      return await base44.entities.SavedPrompt.update(promptId, {
        is_pinned_by_admin: isPinned
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedPrompts'] });
      toast.success('Updated');
    },
    onError: (err) => {
      console.error('Failed to pin prompt:', err);
      toast.error('Failed to update prompt');
    }
  });

  // Record usage
  const recordUsageMutation = useMutation({
    mutationFn: async ({ promptId, eventType }) => {
      // Create usage record
      await base44.entities.PromptUsage.create({
        prompt_id: promptId,
        user_email: user.email,
        event_type: eventType
      });
      // Update prompt metrics
      const currentPrompt = prompts.find(p => p.id === promptId);
      if (currentPrompt) {
        await base44.entities.SavedPrompt.update(promptId, {
          use_count: (currentPrompt.use_count || 0) + 1,
          last_used_at: new Date().toISOString()
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedPrompts'] });
    }
  });

  const handleCopyPrompt = async (prompt) => {
    await recordUsageMutation.mutateAsync({ promptId: prompt.id, eventType: 'copied' });
    toast.success('Copied to clipboard');
  };

  const handleUsePrompt = async (prompt) => {
    await recordUsageMutation.mutateAsync({ promptId: prompt.id, eventType: 'used' });
  };

  const handleSavePrompt = async (formData) => {
    setIsSaving(true);
    await savePromptMutation.mutateAsync(formData);
    setIsSaving(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full mx-auto mb-4 animate-spin" style={{ borderColor: '#7C3AED', borderTopColor: 'transparent' }} />
          <p style={{ color: '#2E2E42' }}>Loading prompts...</p>
        </div>
      </div>
    );
  }

  const isAdmin = isSuperAdmin(user.email);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ 
                background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Saved Prompts</h1>
              <p style={{ color: '#6B6B80' }}>
                {isAdmin ? 'Manage global and personal prompts' : 'Browse and use saved prompt templates'}
              </p>
            </div>
            {isAdmin && (
              <Button 
                onClick={() => {
                  setSelectedPrompt(null);
                  setIsEditing(true);
                }}
                className="gap-2 text-white shadow-lg"
                style={{ backgroundColor: '#7C3AED' }}
              >
                <Plus className="w-5 h-5" />
                New Prompt
              </Button>
            )}
          </div>
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-6 mb-8 border shadow-lg" style={{ 
            backgroundColor: 'white',
            borderColor: 'rgba(139, 92, 246, 0.15)'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#6B6B80' }}>
                Search
              </label>
              <Input
                placeholder="Search by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ backgroundColor: '#F8F7FF', borderColor: 'rgba(139, 92, 246, 0.2)' }}
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#6B6B80' }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-md border text-sm"
                style={{ backgroundColor: '#F8F7FF', borderColor: 'rgba(139, 92, 246, 0.2)', color: '#1A1A2E' }}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#6B6B80' }}>
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-md border text-sm"
                style={{ backgroundColor: '#F8F7FF', borderColor: 'rgba(139, 92, 246, 0.2)', color: '#1A1A2E' }}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
                {isAdmin && <option value="">All</option>}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#6B6B80' }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-md border text-sm"
                style={{ backgroundColor: '#F8F7FF', borderColor: 'rgba(139, 92, 246, 0.2)', color: '#1A1A2E' }}
              >
                <option value="-created_date">Newest</option>
                <option value="-use_count">Most Used</option>
                <option value="-last_used_at">Recently Used</option>
                <option value="title">A-Z</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {promptsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-xl p-6 animate-pulse border shadow-lg" style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.15)'
                }}>
                  <div className="h-6 rounded mb-3" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }} />
                  <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }} />
                  <div className="h-4 rounded w-1/2" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }} />
                </div>
              ))}
            </div>
          ) : prompts.length === 0 ? (
            <div className="rounded-xl p-8 md:p-12 text-center border shadow-lg" style={{ 
              backgroundColor: 'white',
              borderColor: 'rgba(139, 92, 246, 0.15)'
            }}>
              <div className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 md:mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0EDFF' }}>
                <AlertCircle className="w-6 md:w-8 h-6 md:h-8" style={{ color: '#7C3AED' }} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3" style={{ color: '#1A1A2E' }}>No prompts found</h3>
              <p className="text-sm md:text-base" style={{ color: '#2E2E42' }}>
                {isAdmin ? 'Create your first prompt to get started' : 'Check back soon for new prompts'}
              </p>
              {isAdmin && (
                <Button 
                  onClick={() => {
                    setSelectedPrompt(null);
                    setIsEditing(true);
                  }}
                  className="mt-6 font-semibold text-white shadow-lg"
                  style={{ backgroundColor: '#7C3AED' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Prompt
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  userEmail={user.email}
                  onSelect={() => setSelectedPrompt(prompt)}
                  onCopy={handleCopyPrompt}
                  onUse={handleUsePrompt}
                  onTogglePin={(id, isPinned) => pinPromptMutation.mutate({ promptId: id, isPinned })}
                  onDelete={(id) => deletePromptMutation.mutate(id)}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Editor or Detail Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl w-full max-w-2xl p-8 my-8 border shadow-2xl" style={{ 
                backgroundColor: 'white',
                borderColor: 'rgba(139, 92, 246, 0.15)'
              }}
            >
              <PromptEditorForm
                initialData={selectedPrompt}
                categories={categories}
                allTags={allTags}
                isLoading={isSaving}
                onSubmit={handleSavePrompt}
                onCancel={() => {
                  setIsEditing(false);
                  setSelectedPrompt(null);
                }}
              />
            </motion.div>
          </div>
        )}

        {/* Detail View Modal */}
        {selectedPrompt && !isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl max-w-3xl w-full p-8 my-8 border shadow-2xl" style={{ 
                backgroundColor: 'white',
                borderColor: 'rgba(139, 92, 246, 0.15)'
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
                  {selectedPrompt.title}
                </h2>
                <button
                  onClick={() => setSelectedPrompt(null)}
                  style={{ color: '#6B6B80' }}
                  className="hover:opacity-70"
                >
                  ✕
                </button>
              </div>

              <div className="rounded-lg p-6 mb-6 font-mono text-sm whitespace-pre-wrap border shadow-sm" style={{ 
                backgroundColor: '#F8F7FF',
                borderColor: 'rgba(139, 92, 246, 0.2)',
                color: '#1A1A2E'
              }}>
                {selectedPrompt.prompt_body}
              </div>

              {selectedPrompt.variables_schema?.length > 0 && (
                <div className="mb-6 p-4 rounded-lg border shadow-sm" style={{ 
                  backgroundColor: '#F0EDFF',
                  borderColor: 'rgba(139, 92, 246, 0.15)'
                }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: '#1A1A2E' }}>Variables</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPrompt.variables_schema.map(v => (
                      <div key={v.key} className="text-xs" style={{ color: '#2E2E42' }}>
                        <code style={{ color: '#7C3AED' }}>{`{{${v.key}}}`}</code>
                        {v.description && <div className="mt-1">{v.description}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPrompt.tags?.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full" 
                    style={{ backgroundColor: '#F0EDFF', color: '#2E2E42' }}>
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-6 border-t" style={{ borderColor: 'rgba(139, 92, 246, 0.15)' }}>
                <CopyButton
                  textToCopy={selectedPrompt.prompt_body}
                  label="Copy Prompt"
                  size="sm"
                />
                {isSuperAdmin(user.email) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedPrompt(null)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Variables Drawer */}
        {selectedPrompt && selectedPrompt.variables_schema?.length > 0 && (
          <VariablesDrawer
            variablesSchema={selectedPrompt.variables_schema}
            isOpen={showVariablesDrawer}
            onClose={() => setShowVariablesDrawer(false)}
          />
        )}
      </div>
    </div>
  );
}