import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Missing Authorization header', { status: 401 });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return new Response('Not Authenticated', { status: 401 });

    // Fetch Mood Logs
    const { data: moodLogs } = await supabase.from('mood_logs').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(30);
    
    // Fetch Habits & Habit Logs
    const { data: habits } = await supabase.from('habits').select('*').eq('user_id', user.id);
    const { data: logs } = await supabase.from('logs').select('*').in('habit_id', habits?.map(h => h.id) || []);

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      // Fallback response if no API key is configured
      return new Response(JSON.stringify({ 
        insight: "Add your GROQ_API_KEY to Vercel to unlock AI-powered mood insights!",
        correlation: 0
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const systemPrompt = `You are a data analyst for Habitley. Analyze the user's habits, logs, and mood history over the last 30 days. Identify patterns. Which habit correlates most with their high mood days? Return ONLY a JSON object with this exact structure: {"insight": "A short 1-sentence insight", "correlation": 85, "topHabit": "Meditation"}`;

    const dataPayload = {
      habits,
      habitLogs: logs,
      moodLogs
    };

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
          { role: 'user', content: JSON.stringify(dataPayload) }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API Error: ${await aiResponse.text()}`);
    }

    const aiData = await aiResponse.json();
    const result = JSON.parse(aiData.choices[0].message.content);

    return new Response(JSON.stringify(result), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Mood Insights API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}
