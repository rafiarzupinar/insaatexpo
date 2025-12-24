import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Supabase proje bilgilerini buraya gir
// Bu bilgileri Supabase Dashboard > Settings > API'den alabilirsin
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper fonksiyonlar
export const handleSupabaseError = (error: any) => {
  console.error('Supabase Error:', error);
  return {
    error: true,
    message: error?.message || 'Bir hata oluştu',
  };
};

// Auth fonksiyonları
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) return handleSupabaseError(error);
  return { data, error: null };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return handleSupabaseError(error);
  return { data, error: null };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) return handleSupabaseError(error);
  return { error: null };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Session listener
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
