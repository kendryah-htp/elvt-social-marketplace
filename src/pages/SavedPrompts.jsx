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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const isAdmin = isSuperAdmin(user.email);

  return (
    <div className="min-h-screen elvt-gradient">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">Saved Prompts</h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                {isAdmin ? 'Manage global and personal prompts' : 'Browse and use saved prompt templates'}
              </p>
            </div>
            {isAdmin && (
              <Button 
                onClick={() => {
                  setSelectedPrompt(null);
                  setIsEditing(true);
                }}
                className="gap-2 pulse-glow"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
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
          className="elvt-glass rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                Search
              </label>
              <Input
                placeholder="Search by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
                {isAdmin && <option value="">All</option>}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm"
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
            <div className="text-center py-12">
              <Sparkles className="w-8 h-8 mx-auto mb-2 animate-spin" style={{ color: 'var(--accent)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Loading prompts...</p>
            </div>
          ) : prompts.length === 0 ? (
            <div className="elvt-glass rounded-xl p-12 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
              <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {isAdmin ? 'Create your first prompt to get started' : 'Check back soon for new prompts'}
              </p>
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
              className="elvt-glass rounded-xl w-full max-w-2xl p-8 my-8"
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
              className="elvt-glass rounded-xl max-w-3xl w-full p-8 my-8"
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {selectedPrompt.title}
                </h2>
                <button
                  onClick={() => setSelectedPrompt(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 mb-6 font-mono text-sm whitespace-pre-wrap border border-gray-200 dark:border-gray-700">
                {selectedPrompt.prompt_body}
              </div>

              {selectedPrompt.variables_schema?.length > 0 && (
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Variables</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPrompt.variables_schema.map(v => (
                      <div key={v.key} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <code style={{ color: 'var(--accent)' }}>{{`${v.key}`}}</code>
                        {v.description && <div className="mt-1">{v.description}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPrompt.tags?.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full" 
                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
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