import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Save, X, AlertCircle } from 'lucide-react';
import PromptTagInput from './PromptTagInput';
import VariablesSchemaEditor from './VariablesSchemaEditor';
import { toast } from 'sonner';

export default function PromptEditorForm({
  initialData = null,
  categories = [],
  allTags = [],
  isLoading = false,
  onSubmit,
  onCancel
}) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    prompt_body: '',
    category: '',
    intended_agent: '',
    tags: [],
    variables_schema: [],
    status: 'draft'
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.prompt_body?.trim()) newErrors.prompt_body = 'Prompt body is required';
    if (!formData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }
    onSubmit?.(formData);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {initialData ? 'Edit Prompt' : 'New Prompt'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
            Title *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="e.g., Instagram Caption Generator"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
              <AlertCircle className="w-3 h-3" />
              {errors.title}
            </div>
          )}
        </div>

        {/* Prompt Body */}
        <div>
          <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
            Prompt *
          </label>
          <Textarea
            value={formData.prompt_body}
            onChange={(e) => handleFieldChange('prompt_body', e.target.value)}
            placeholder="Write your prompt template here. Use {{variable_name}} for dynamic variables..."
            className={`h-40 resize-none ${errors.prompt_body ? 'border-red-500' : ''}`}
          />
          {errors.prompt_body && (
            <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
              <AlertCircle className="w-3 h-3" />
              {errors.prompt_body}
            </div>
          )}
        </div>

        {/* Category & Agent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              className={`w-full px-3 py-2 rounded-md border bg-white text-sm ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                <AlertCircle className="w-3 h-3" />
                {errors.category}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Intended Agent
            </label>
            <select
              value={formData.intended_agent || ''}
              onChange={(e) => handleFieldChange('intended_agent', e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm"
            >
              <option value="">Select an agent</option>
              <option value="Milo">Milo</option>
              <option value="Milo Jr.">Milo Jr.</option>
              <option value="Claude">Claude</option>
              <option value="Email Writer">Email Writer</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
            Tags
          </label>
          <PromptTagInput
            selectedTags={formData.tags || []}
            onTagsChange={(tags) => handleFieldChange('tags', tags)}
            availableTags={allTags}
            placeholder="Add relevant tags..."
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleFieldChange('status', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Variables */}
        <div>
          <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
            Variables
          </label>
          <VariablesSchemaEditor
            variables={formData.variables_schema || []}
            onVariablesChange={(vars) => handleFieldChange('variables_schema', vars)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <Button
            type="submit"
            disabled={isLoading}
            className="gap-2"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save Prompt'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}