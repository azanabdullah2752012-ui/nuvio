import { supabase } from '../lib/supabase';
import { authService } from './authService';

export const dataService = {
  list: async (entityName) => {
    const user = authService.me();
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from(entityName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(`Supabase Error [list ${entityName}]:`, error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error(`Fetch Error [list ${entityName}]:`, err);
      return [];
    }
  },

  get: async (entityName, id) => {
    const { data, error } = await supabase
      .from(entityName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  create: async (entityName, data) => {
    const user = authService.me();
    if (!user) throw new Error("Authentication required for cloud storage.");

    const newItem = {
      ...data,
      user_id: user.id || '00000000-0000-0000-0000-000000000000' // Using simulated ID or real Auth ID
    };

    const { data: insertedData, error } = await supabase
      .from(entityName)
      .insert([newItem])
      .select()
      .single();

    if (error) {
      console.error(`Supabase Error [create ${entityName}]:`, error.message);
      throw error;
    }
    return insertedData;
  },

  update: async (entityName, id, data) => {
    const { data: updatedData, error } = await supabase
      .from(entityName)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedData;
  },

  delete: async (entityName, id) => {
    const { error } = await supabase
      .from(entityName)
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Helper for batch filtering
  filter: async (entityName, column, value) => {
    const { data, error } = await supabase
      .from(entityName)
      .select('*')
      .eq(column, value);

    if (error) return [];
    return data || [];
  }
};
