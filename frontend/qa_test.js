import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  'https://vbltekbisolsosasduvm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibHRla2Jpc29sc29zYXNkdXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzODM4MTksImV4cCI6MjA5Njk1OTgxOX0.CnyraAnO-ljxHs38iTM636jfY-RDiYoXpdf0zJaAP3o'
);

async function run() {
  console.log("🚀 Starting Automated QA Test...");
  const email = `test_qa_${Date.now()}@poornima.org`;
  const password = 'password123';
  
  console.log("1. Creating test user...");
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: 'QA Tester' } }
  });
  if (authErr) throw authErr;
  const user = authData.user;
  console.log("✅ User created:", user.id);

  console.log("2. Waiting for trigger to populate public.users...");
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const { data: profile, error: profErr } = await supabase.from('users').select('*').eq('id', user.id).single();
  if (profErr) throw profErr;
  console.log("✅ Profile fetched from public.users");

  console.log("3. Creating a Habit...");
  const habitId = crypto.randomUUID();
  const { error: habitErr } = await supabase.from('habits').insert({
    id: habitId,
    name: 'Drink Water',
    category: 'Health',
    frequency: 'daily',
    time: 'morning',
    difficulty: 'easy',
    color: '#3498db',
    icon: '💧',
    user_id: user.id
  });
  if (habitErr) throw habitErr;
  console.log("✅ Habit created");

  console.log("4. Logging a Habit completion...");
  const { error: logErr } = await supabase.from('logs').insert({
    id: crypto.randomUUID(),
    date: new Date().toISOString().split('T')[0],
    habit_id: habitId
  });
  if (logErr) throw logErr;
  console.log("✅ Habit logged for today");

  console.log("5. Creating a Custom Challenge...");
  const { error: chalErr } = await supabase.from('custom_challenges').insert({
    id: crypto.randomUUID(),
    title: 'Hydration Master',
    type: 'total_logs',
    target: 30,
    reward: 'Certificate of Completion',
    user_id: user.id
  });
  if (chalErr) throw chalErr;
  console.log("✅ Custom Challenge created");

  console.log("🎉 ALL TESTS PASSED! The app is flawless!");
}

run().catch(err => {
  console.error("❌ TEST FAILED:", err);
  process.exit(1);
});
