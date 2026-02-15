import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function VariablesDrawer({
  variablesSchema = [],
  onClose,
  onInsertVariable,
  isOpen = true
}) {
  const [copied, setCopied] = React.useState(null);

  const handleInsert = (key) => {
    const varString = `{{${key}}}`;
    navigator.clipboard.writeText(varString);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
    toast.success(`Copied {{${key}}} to clipboard`);
    onInsertVariable?.(varString);
  };

  if (!isOpen || variablesSchema.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 h-96 w-96 elvt-glass border-t border-l rounded-tl-xl shadow-2xl flex flex-col p-4 z-40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Variables</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {variablesSchema.map((variable) => (
          <div key={variable.key} className="p-2 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm font-bold" style={{ color: 'var(--accent)' }}>
                  {`{{${variable.key}}}`}
                </div>
                {variable.description && (
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {variable.description}
                  </div>
                )}
                {variable.example && (
                  <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Example: {variable.example}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleInsert(variable.key)}
                className="flex-shrink-0 ml-2 p-1 rounded hover:opacity-70 transition-opacity"
              >
                {copied === variable.key ? (
                  <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                ) : (
                  <Copy className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}