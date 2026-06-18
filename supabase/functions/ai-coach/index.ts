import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request from the browser
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    // 1. Initialize Supabase client using the Auth header from the user's request
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 2. Verify the user is logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Not authenticated')

    // 3. Fetch their habits to give Claude context
    const { data: habits } = await supabase
      .from('habits')
      .select('name, category, frequency, difficulty')
      .eq('user_id', user.id)

    // 4. Construct the prompt for Claude
    const systemPrompt = `You are a supportive, concise, and highly intelligent habit coach for the premium web app Habitly. 
    The user's current habits are: ${JSON.stringify(habits)}. 
    Give them actionable, short advice based on these habits. Keep responses relatively brief and highly encouraging. Use emojis where appropriate.`

    // 5. Call Anthropic API and ask for a stream
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }],
        stream: true, 
      }),
    })

    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.text();
      console.error('Anthropic API error:', errorData);
      throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
    }

    // 6. Return the raw stream directly to React
    return new Response(anthropicResponse.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    })
  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
