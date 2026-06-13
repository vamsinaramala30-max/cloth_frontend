import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// NOTE:
// Provide these in `.env.local` at the frontend level:
// NEXT_PUBLIC_SUPABASE_URL
// NEXT_PUBLIC_SUPABASE_ANON_KEY
// NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET (optional, default: "profile-images")
//
// IMPORTANT (Vercel/Production-safe):
// Never throw at module import time. Missing env vars can happen in preview builds,
// misconfigured environments, or during local development.
// Instead, we validate and fail gracefully when a Supabase call is actually made.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const SUPABASE_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'profile-images';

const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);

let _supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!hasSupabaseEnv || !supabaseUrl || !supabaseAnonKey) {
    // Throw with a meaningful message, but only when code actually tries to use Supabase.
    // This prevents Vercel from failing just by importing the module.
    throw new Error(
      'Supabase is not configured. Missing NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Add them to frontend/.env.local (or Vercel env vars) and redeploy.'
    );
  }

  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      // Keep realtime + storage performant
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }

  return _supabase;
}

// Backwards-compatible export for existing code.
// If env vars are missing, accessing `supabase` will still error,
// but imports remain safe.
export const supabase: SupabaseClient = (() => {
  if (!hasSupabaseEnv || !supabaseUrl || !supabaseAnonKey) {
    // Create a minimal proxy-like client that throws on usage.
    // We cannot fully mock the SupabaseClient shape here without breaking types,
    // so we intentionally throw when methods are accessed.
    return new Proxy(
      {},
      {
        get() {
          throw new Error(
            'Supabase is not configured. Missing NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
              'Add them to frontend/.env.local (or Vercel env vars) and redeploy.'
          );
        },
      }
    ) as unknown as SupabaseClient;
  }

  return getSupabaseClient();
})();


