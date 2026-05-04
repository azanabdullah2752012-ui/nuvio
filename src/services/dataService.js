import { supabase } from '../lib/supabase';
import { authService } from './authService';

export const dataService = {
  list: async (entityName) => {
    const user = authService.me();
    const localData = JSON.parse(localStorage.getItem(`nuvio_local_${entityName}`) || '[]');

    if (!user) {
      return localData;
    }

    try {
      const { data, error } = await supabase
        .from(entityName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn(`Supabase Error [list ${entityName}], falling back to local:`, error.message);
        return localData;
      }
      return data || [];
    } catch (err) {
      console.warn(`Fetch Error [list ${entityName}], falling back to local:`, err);
      return localData;
    }
  },

  get: async (entityName, id) => {
    try {
      const { data, error } = await supabase
        .from(entityName)
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      const localData = JSON.parse(localStorage.getItem(`nuvio_local_${entityName}`) || '[]');
      return localData.find(i => i.id === id) || null;
    }
  },

  create: async (entityName, data) => {
    const user = authService.me();
    const newItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      user_id: user?.id || 'guest-0000-0000-0000-000000000000'
    };

    // Save locally first for instantaneous offline support
    const localData = JSON.parse(localStorage.getItem(`nuvio_local_${entityName}`) || '[]');
    localStorage.setItem(`nuvio_local_${entityName}`, JSON.stringify([newItem, ...localData]));

    if (!user) {
      return newItem;
    }

    try {
      const cloudItem = {
        ...data,
        user_id: user.id || '00000000-0000-0000-0000-000000000000'
      };

      const { data: insertedData, error } = await supabase
        .from(entityName)
        .insert([cloudItem])
        .select()
        .single();

      if (error) throw error;
      return insertedData;
    } catch (err) {
      console.warn(`Supabase insert failed, using local fallback:`, err?.message || err);
      return newItem; // Return local item so UI doesn't break
    }
  },

  update: async (entityName, id, data) => {
    const user = authService.me();
    
    // Update local storage
    const localData = JSON.parse(localStorage.getItem(`nuvio_local_${entityName}`) || '[]');
    const updatedList = localData.map(item => item.id === id ? { ...item, ...data } : item);
    localStorage.setItem(`nuvio_local_${entityName}`, JSON.stringify(updatedList));
    const localUpdatedItem = updatedList.find(item => item.id === id) || { id, ...data };

    if (!user) {
      return localUpdatedItem;
    }

    try {
      const { data: updatedData, error } = await supabase
        .from(entityName)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    } catch (err) {
      console.warn(`Supabase update failed, using local fallback:`, err.message);
      return localUpdatedItem;
    }
  },

  delete: async (entityName, id) => {
    const user = authService.me();
    
    // Delete from local storage
    const localData = JSON.parse(localStorage.getItem(`nuvio_local_${entityName}`) || '[]');
    const updatedList = localData.filter(item => item.id !== id);
    localStorage.setItem(`nuvio_local_${entityName}`, JSON.stringify(updatedList));

    if (!user) {
      return;
    }

    try {
      const { error } = await supabase
        .from(entityName)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.warn(`Supabase delete failed, relying on local fallback:`, err.message);
    }
  },

  // Helper for batch filtering
  filter: async (entityName, column, value) => {
    const user = authService.me();
    const localData = JSON.parse(localStorage.getItem(`nuvio_local_${entityName}`) || '[]');
    const filteredLocal = localData.filter(i => i[column] === value);

    if (!user) return filteredLocal;

    try {
      const { data, error } = await supabase
        .from(entityName)
        .select('*')
        .eq(column, value);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn(`Supabase filter failed, falling back to local:`, err.message);
      return filteredLocal;
    }
  }
};
