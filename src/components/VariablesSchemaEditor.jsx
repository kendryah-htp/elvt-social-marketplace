import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

export default function VariablesSchemaEditor({
  variables = [],
  onVariablesChange,
  readOnly = false
}) {
  const handleAddVariable = () => {
    const newVariable = {
      key: '',
      description: '',
      required: false,
      example: ''
    };
    onVariablesChange([...variables, newVariable]);
  };

  const handleRemoveVariable = (index) => {
    const updated = variables.filter((_, i) => i !== index);
    onVariablesChange(updated);
  };

  const handleUpdateVariable = (index, field, value) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    onVariablesChange(updated);
  };

  // Validate: key must be unique and non-empty
  const validateKey = (key, currentIndex) => {
    if (!key) return 'Key is required';
    if (variables.some((v, i) => i !== currentIndex && v.key === key)) {
      return 'Duplicate key';
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Variables</h3>
        {!readOnly && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddVariable}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Variable
          </Button>
        )}
      </div>

      {variables.length === 0 && (
        <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600 text-center">
          No variables defined yet. {!readOnly && 'Add variables like {{first_name}}, {{offer}}, etc.'}
        </div>
      )}

      <div className="space-y-3">
        {variables.map((variable, index) => {
          const keyError = validateKey(variable.key, index);
          return (
            <Card key={index} className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Key</label>
                  <Input
                    placeholder="e.g., first_name"
                    value={variable.key}
                    onChange={(e) => handleUpdateVariable(index, 'key', e.target.value)}
                    readOnly={readOnly}
                    className={keyError ? 'border-red-500' : ''}
                  />
                  {keyError && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      {keyError}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Example</label>
                  <Input
                    placeholder="e.g., John"
                    value={variable.example || ''}
                    onChange={(e) => handleUpdateVariable(index, 'example', e.target.value)}
                    readOnly={readOnly}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  placeholder="What does this variable represent?"
                  value={variable.description || ''}
                  onChange={(e) => handleUpdateVariable(index, 'description', e.target.value)}
                  readOnly={readOnly}
                  className="h-20 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={variable.required || false}
                    onCheckedChange={(checked) => 
                      handleUpdateVariable(index, 'required', checked)
                    }
                    disabled={readOnly}
                  />
                  <span className="text-sm">Required</span>
                </label>

                {!readOnly && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveVariable(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}