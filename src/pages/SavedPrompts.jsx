import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { isSuperAdmin } from '@/utils/permissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SavedPrompts() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [sortBy, setSortBy] = useState('-created_date');
  const [selectedPrompt, setSelectedPrompt] = useState(null);

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
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="elvt-glass rounded-lg p-6 hover:elvt-glow transition-all cursor-pointer"
                  onClick={() => setSelectedPrompt(prompt)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        {prompt.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        {prompt.category && (
                          <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--accent)' }}>
                            {prompt.category}
                          </span>
                        )}
                        {prompt.intended_agent && (
                          <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                            {prompt.intended_agent}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${
                          prompt.status === 'active' ? 'bg-green-100 text-green-700' :
                          prompt.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {prompt.status}
                        </span>
                      </div>
                    </div>
                    {prompt.use_count > 0 && (
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                          {prompt.use_count}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>uses</div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    {prompt.prompt_body}
                  </p>
                  {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {prompt.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full" 
                          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                          #{tag}
                        </span>
                      ))}
                      {prompt.tags.length > 3 && (
                        <span className="text-xs px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                          +{prompt.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Detail Modal Placeholder */}
        {selectedPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="elvt-glass rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto p-8"
            >
              <button
                onClick={() => setSelectedPrompt(null)}
                className="float-right text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4">{selectedPrompt.title}</h2>
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                Status: <strong>{selectedPrompt.status}</strong>
              </p>
              <div className="bg-slate-50 rounded p-4 mb-4 font-mono text-sm whitespace-pre-wrap">
                {selectedPrompt.prompt_body}
              </div>
              <Button onClick={() => setSelectedPrompt(null)}>Close</Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}