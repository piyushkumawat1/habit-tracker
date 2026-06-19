import { supabase } from './supabase';

// Helper to format responses like Axios ({ data })
const formatRes = async (promise) => {
  const { data, error } = await promise;
  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }
  return { data };
};

// ── Auth ──
export const authApi = {
  updateProfile: async (updates) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // We only update public.users
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) throw error;
    return { data };
  },
};

// ── Habits ──
export const habitsApi = {
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return formatRes(supabase.from('habits').select('*').eq('user_id', user.id).order('created_at', { ascending: false }));
  },
  create: async (habitData) => {
    const { data: { user } } = await supabase.auth.getUser();
    return formatRes(supabase.from('habits').insert({ id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...habitData, user_id: user.id }).select().single());
  },
  update: async (id, habitData) => {
    return formatRes(supabase.from('habits').update({ ...habitData, updated_at: new Date().toISOString() }).eq('id', id).select().single());
  },
  delete: async (id) => {
    return formatRes(supabase.from('habits').delete().eq('id', id));
  },
};

// ── Logs ──
export const logsApi = {
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    // We need to fetch all logs for the user's habits
    const { data: habits } = await supabase.from('habits').select('id').eq('user_id', user.id);
    if (!habits || habits.length === 0) return { data: {} };
    
    const habitIds = habits.map(h => h.id);
    const { data, error } = await supabase.from('logs').select('*').in('habit_id', habitIds);
    if (error) throw error;

    // Format logs for the frontend: { 'YYYY-MM-DD': { habitId: log } }
    const formatted = {};
    data.forEach(log => {
      if (!formatted[log.date]) formatted[log.date] = {};
      formatted[log.date][log.habit_id] = log;
    });
    return { data: formatted };
  },
  toggle: async (date, habitId) => {
    // Check if log exists
    const { data: existing } = await supabase.from('logs').select('*').eq('date', date).eq('habit_id', habitId).maybeSingle();
    if (existing) {
      await supabase.from('logs').delete().eq('id', existing.id);
      return { data: { action: 'removed' } };
    } else {
      const { data } = await supabase.from('logs').insert({ id: crypto.randomUUID(), date, habit_id: habitId }).select().single();
      return { data: { action: 'added', log: data } };
    }
  },
};

// ── Challenges ──
export const challengesApi = {
  create: async (challengeData) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const payload = {
      id: crypto.randomUUID(),
      title: challengeData.title,
      type: challengeData.type,
      target: parseInt(challengeData.target, 10) || 10,
      reward: challengeData.reward,
      user_id: user.id,
      notified: false,
      created_at: new Date().toISOString()
    };
    
    // Map habitId to habit_id for the database
    if (challengeData.habitId) {
      payload.habit_id = challengeData.habitId;
    }
    
    return formatRes(supabase.from('custom_challenges').insert(payload).select().single());
  },
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return formatRes(supabase.from('custom_challenges').select('*').eq('user_id', user.id).order('created_at', { ascending: false }));
  },
  notify: async (id) => {
    return formatRes(supabase.from('custom_challenges').update({ notified: true }).eq('id', id));
  },
  update: async (id, challengeData) => {
    const payload = {
      title: challengeData.title,
      type: challengeData.type,
      target: parseInt(challengeData.target, 10) || 10,
    };
    if (challengeData.habitId !== undefined) {
      payload.habit_id = challengeData.habitId ? challengeData.habitId : null;
    }
    return formatRes(supabase.from('custom_challenges').update(payload).eq('id', id).select().single());
  },
  delete: async (id) => {
    return formatRes(supabase.from('custom_challenges').delete().eq('id', id));
  },
};

export const templatesApi = {
  getAll: async () => {
    return formatRes(supabase.from('custom_templates').select('*').order('created_at', { ascending: false }));
  },
  create: async (templateData) => {
    return formatRes(supabase.from('custom_templates').insert([templateData]).select().single());
  },
  delete: async (id) => {
    return formatRes(supabase.from('custom_templates').delete().eq('id', id));
  },
  apply: async (userId, templateHabitsArray) => {
    // Add the required fields (id, timestamps) that Supabase expects
    const now = new Date().toISOString();
    const habitsToInsert = templateHabitsArray.map(habit => ({
      id: crypto.randomUUID(),
      user_id: userId,
      name: habit.name,
      category: habit.category || 'Other',
      frequency: habit.frequency || 'Daily',
      difficulty: habit.difficulty || 'Easy',
      icon: habit.icon || '⭐',
      created_at: now,
      updated_at: now
    }));
    return formatRes(supabase.from('habits').insert(habitsToInsert));
  }
};

// ── Mood & Energy ──
export const moodApi = {
  getToday: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null };
    const today = new Date().toISOString().split('T')[0];
    return formatRes(supabase.from('mood_logs').select('*').eq('user_id', user.id).eq('date', today).maybeSingle());
  },
  logToday: async (moodLevel, energyLevel) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    
    const today = new Date().toISOString().split('T')[0];
    const payload = {
      user_id: user.id,
      date: today,
      mood: moodLevel,
      energy: energyLevel,
      updated_at: new Date().toISOString()
    };
    
    // Use upsert to prevent race conditions if the user clicks multiple buttons very fast
    return formatRes(
      supabase.from('mood_logs')
        .upsert(payload, { onConflict: 'user_id,date' })
        .select()
        .single()
    );
  }
};

export default supabase;
