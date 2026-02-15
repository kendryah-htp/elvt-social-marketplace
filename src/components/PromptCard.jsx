import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Play, Pin, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CopyButton from './CopyButton';
import { toast } from 'sonner';

const SUPER_ADMIN_EMAILS = [
  'kendryah@gmail.com',
  'support@highticketpurpose.com',
  'support@elvt.social',
  'denahornsby@yahoo.com'
];

const isSuperAdmin = (email) => email && SUPER_ADMIN_EMAILS.includes(email.toLowerCase());

export default function PromptCard({
  prompt,
  userEmail,
  onCopy,
  onUse,
  onSelect,
  onTogglePin,
  onDelete
}) {
  const canEdit = isSuperAdmin(userEmail) || prompt.owner_email === userEmail;
  const canPin = isSuperAdmin(userEmail);
  const canDelete = isSuperAdmin(userEmail) || prompt.owner_email === userEmail;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="elvt-glass rounded-lg p-6 hover:elvt-glow transition-all cursor-pointer group"
      onClick={() => onSelect?.(prompt)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {prompt.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
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
          <div className="text-right ml-4">
            <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
              {prompt.use_count}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>uses</div>
          </div>
        )}
      </div>

      <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
        {prompt.prompt_body}
      </p>

      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full" 
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
              #{tag}
            </span>
          ))}
          {prompt.tags.length > 3 && (
            <span className="text-xs px-2 py-1" style={{ color: 'var(--text-muted)' }}>
              +{prompt.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton
          textToCopy={prompt.prompt_body}
          label="Copy"
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onCopy?.(prompt);
          }}
        />
        
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onUse?.(prompt);
            toast.success('Prompt ready to use');
          }}
          className="gap-2"
        >
          <Play className="w-4 h-4" />
          Use
        </Button>

        {canPin && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin?.(prompt.id, !prompt.is_pinned_by_admin);
            }}
            className={prompt.is_pinned_by_admin ? 'text-yellow-600' : 'text-gray-400'}
          >
            <Pin className="w-4 h-4" fill={prompt.is_pinned_by_admin ? 'currentColor' : 'none'} />
          </Button>
        )}

        {canDelete && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Delete this prompt?')) {
                onDelete?.(prompt.id);
              }
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}