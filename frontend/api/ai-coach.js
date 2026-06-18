import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { message } = await req.json();
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return new Response('Missing Authorization header', { status: 401 });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase Environment Variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response('Not Authenticated', { status: 401 });
    }

    // Fetch user's habits for context
    const { data: habits } = await supabase
      .from('habits')
      .select('name, category, frequency, difficulty')
      .eq('user_id', user.id);

    const systemPrompt = `You are a supportive, concise, and highly intelligent habit coach for the premium web app Habitly. 
    The user's current habits are: ${JSON.stringify(habits)}. 
    Give them actionable, short advice based on these habits. Keep responses relatively brief and highly encouraging. Use emojis where appropriate.`;

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      throw new Error("Missing GROQ_API_KEY in Vercel Environment Variables");
    }

    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI API Error:", errText);
      return new Response(`AI API Error: ${errText}`, { status: 500 });
    }

    // Return the stream to the frontend
    return new Response(aiResponse.body, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}
