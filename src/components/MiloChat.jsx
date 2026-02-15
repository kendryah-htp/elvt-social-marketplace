import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function MiloChat() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation
  useEffect(() => {
    const initChat = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) {
          base44.auth.redirectToLogin();
          return;
        }

        const newConversation = await base44.agents.createConversation({
          agent_name: 'milo',
          metadata: {
            name: `Chat with MILO - ${new Date().toLocaleDateString()}`,
            user_email: user.email
          }
        });

        setConversation(newConversation);
        setMessages(newConversation.messages || []);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };

    initChat();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!conversation?.id) return;

    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (updatedConversation) => {
      setMessages(updatedConversation.messages || []);
    });

    return unsubscribe;
  }, [conversation?.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversation || loading) return;

    setLoading(true);
    try {
      await base44.agents.addMessage(conversation, {
        role: 'user',
        content: input
      });
      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <span className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>M</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Hey! I'm MILO</h3>
              <p style={{ color: 'var(--text-secondary)' }} className="max-w-sm">
                I'm your AI co-pilot designed to help you create content, answer questions, and grow your business using proven strategies from your admin.
              </p>
              <div className="mt-6 space-y-2">
                <p style={{ color: 'var(--text-muted)' }} className="text-sm">Try asking:</p>
                <div className="text-sm space-y-1" style={{ color: 'var(--accent)' }}>
                  <p>• Help me write a blog post about...</p>
                  <p>• What should I post on TikTok?</p>
                  <p>• How do I get started?</p>
                </div>
              </div>
            </motion.div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-xs lg:max-w-md rounded-lg px-4 py-3"
                  style={{
                    backgroundColor: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-tertiary)',
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)'
                  }}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm">{msg.content}</p>
                  ) : (
                    <div className="text-sm prose prose-invert prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:text-blue-400 [&_a]:underline">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                          li: ({ children }) => <li className="ml-2">{children}</li>,
                          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                          code: ({ children }) => <code style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '2px 4px', borderRadius: '3px' }}>{children}</code>
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="rounded-lg px-4 py-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent)' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4" style={{ borderColor: 'var(--border)' }}>
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask MILO anything..."
            disabled={loading}
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}