import { useState, useRef, useEffect } from 'react';
import supabase from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Coach({ onNavigate }) {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Habitly AI Coach ✨. I can see all your current habits. How can I help you crush your goals today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }, { role: 'assistant', content: '' }]);
    setIsLoading(true);

    try {
      // 1. Get the user's session token to prove they are logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      // 2. Fetch the Vercel Edge Function directly to handle the stream
      const res = await fetch(
        '/api/ai-coach', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}` // Send Auth token!
          },
          body: JSON.stringify({ message: userMessage })
        }
      );

      if (!res.ok) {
        let errMessage = `HTTP ${res.status}`;
        const rawText = await res.text();
        try {
          const errData = JSON.parse(rawText);
          errMessage = errData.error || errMessage;
        } catch (e) {
          errMessage = rawText || errMessage;
        }
        throw new Error(errMessage);
      }

      // 3. Setup stream reading
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      // 4. Loop through the incoming chunks
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6);
            if (dataStr === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(dataStr);
              // Extract the text delta specifically from OpenAI/Moonshot's response format
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                // Update the last message in the array (which is the assistant's currently typing message)
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content += content;
                  return newMessages;
                });
              }
            } catch (e) {
              console.warn("Could not parse chunk", dataStr);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = `⚠️ Server Error: ${error.message}`;
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user?.is_pro) {
    return (
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '24px' }}>
        <div className="page-header" style={{ flexShrink: 0, marginBottom: '16px' }}>
          <h1 className="page-title">✨ AI Coach</h1>
          <p className="page-subtitle">Personalized advice based on your actual habit data.</p>
        </div>
        <div className="card glass-card" style={{ flex: 1, textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px', border: '1px solid var(--accent)', background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(168,85,247,0.05) 100%)' }}>
          <div style={{ fontSize: '5rem', animation: 'float 6s ease-in-out infinite' }}>🤖</div>
          <h2 style={{ margin: 0 }}>Meet Your AI Coach</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 450, margin: '0 auto', lineHeight: 1.6 }}>
            Unlock personalized, data-driven advice every day. The AI Coach analyzes your mood and habit data to give you highly specific tips and keep you accountable. Available exclusively on the Pro Plan.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('profile')} style={{ marginTop: 16, padding: '12px 32px', fontSize: '1.05rem', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)' }}>
            Upgrade to Pro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '100vh', paddingBottom: '0' }}>
      <div className="page-header" style={{ flexShrink: 0, marginBottom: '16px' }}>
        <h1 className="page-title">✨ AI Coach</h1>
        <p className="page-subtitle">Personalized advice based on your actual habit data.</p>
      </div>

      <div 
        className="chat-container" 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          background: 'var(--bg-card)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '16px'
        }}
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            style={{ 
              display: 'flex', 
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              width: '100%'
            }}
          >
            <div 
              style={{
                maxWidth: '75%',
                padding: '12px 16px',
                borderRadius: '16px',
                background: msg.role === 'user' ? 'var(--primary)' : 'var(--bg-raised)',
                color: msg.role === 'user' ? '#ffffff' : 'var(--text-primary)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {msg.content}
              {msg.role === 'assistant' && msg.content === '' && isLoading && (
                <span style={{ opacity: 0.5 }}>Thinking...</span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ flexShrink: 0, paddingBottom: '24px', display: 'flex', gap: '12px' }}>
        <textarea
          className="form-input"
          placeholder="Ask for advice... (e.g., 'How do I stop skipping my morning meditation?')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows="1"
          style={{ 
            flex: 1, 
            resize: 'none', 
            borderRadius: '24px', 
            padding: '12px 20px',
            minHeight: '48px',
            maxHeight: '120px'
          }}
        />
        <button 
          className="btn btn-primary"
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          style={{ 
            borderRadius: '24px', 
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Send 🚀
        </button>
      </div>
    </div>
  );
}
