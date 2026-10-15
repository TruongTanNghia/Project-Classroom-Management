import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Chấp nhận cả 2 tên biến: key mới (sb_publishable_…) hoặc anon key kiểu cũ
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/** Returns the shared Supabase client, or null when env vars are absent (demo mode). */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client)
    client = createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: "aihlt-auth" },
      global: {
        // CHẶN CACHE: trình duyệt từng trả lại bản dữ liệu cũ sau khi F5 khiến
        // điểm danh vừa lưu "biến mất". Ép mọi request luôn lấy bản mới nhất.
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, { ...init, cache: "no-store" }),
      },
    });
  return client;
}
