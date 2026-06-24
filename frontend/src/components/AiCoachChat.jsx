import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Send, Sparkles, User, Loader2 } from 'lucide-react';

export default function AiCoachChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your Habitly AI Coach. Ask me for health tips or advice on building better habits!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Add a temporary empty assistant message to stream into
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              const text = data.choices[0]?.delta?.content || '';
              fullContent += text;
              
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = fullContent;
                return newMessages;
              });
            } catch (e) {
              // Ignore parse errors on incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = "Sorry, I'm having trouble connecting right now.";
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card flex flex-col h-[500px] mt-6" style={{ overflow: 'hidden' }}>
      <div className="dash-card-header border-b border-border bg-card/50 px-4 py-3">
        <div className="dash-card-title flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          AI Coach Chat
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex shrink-0 h-8 w-8 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
              {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} className="text-primary" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`} style={{ whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1].role === 'user' && (
          <div className="flex items-start gap-3">
            <div className="flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground">
              <Loader2 size={14} className="animate-spin text-muted-foreground" />
            </div>
            <div className="max-w-[80%] rounded-2xl px-4 py-2 text-sm bg-secondary text-muted-foreground">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-border p-3 flex gap-2 bg-card/50">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask for advice..."
          className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
