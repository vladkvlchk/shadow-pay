import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL! || "https://lhvnrduefupisliwhreu.supabase.co";
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

// Create a Supabase client with service role key for server-side operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create a client-side Supabase client for real-time subscriptions
export const supabaseClient = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export type Payment = {
  id: string;
  receiver: string;
  token: "ETH" | "USDC";
  comment?: string;
  status: "pending" | "paid" | "expired";
  amount: number;
  created_at?: string;
  updated_at?: string;
  sender_address?: string;
  tx_hash?: string;
};
