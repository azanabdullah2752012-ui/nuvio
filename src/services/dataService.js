import { supabase } from '../lib/supabase';
import { authService } from './authService';

export const dataService = {
  list: async (entityName) => {
    const user = authService.me();
    if (!user) {
      const localData = localStorage.getItem(`nuvio_local_${entityName}`);
      return localData ? JSON.parse(localData) : [];
    }

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
    const newItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      user_id: user?.id || 'guest-0000-0000-0000-000000000000'
    };

    if (!user) {
      const localData = JSON.parse(localStorage.getItem(`nuvio_local_${entityName}`) || '[]');
      const updatedData = [newItem, ...localData];
      localStorage.setItem(`nuvio_local_${entityName}`, JSON.stringify(updatedData));
      return newItem;
    }

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
    const user = authService.me();
    if (!user) {
      const localData = JSON.parse(localStorage.getItem(`nuvio_local_${entityName}`) || '[]');
      const updatedList = localData.map(item => item.id === id ? { ...item, ...data } : item);
      localStorage.setItem(`nuvio_local_${entityName}`, JSON.stringify(updatedList));
      return updatedList.find(item => item.id === id);
    }

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
    const user = authService.me();
    if (!user) {
      const localData = JSON.parse(localStorage.getItem(`nuvio_local_${entityName}`) || '[]');
      const updatedList = localData.filter(item => item.id !== id);
      localStorage.setItem(`nuvio_local_${entityName}`, JSON.stringify(updatedList));
      return;
    }

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
