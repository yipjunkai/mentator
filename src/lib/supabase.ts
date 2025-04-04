import { createClient } from '@supabase/supabase-js'

// Define types for our database schema
export type Deck = {
  id: string
  user_id: string
  title: string
  description: string
  created_at: string
  updated_at: string
}

export type Card = {
  id: string
  deck_id: string
  front: string
  back: string
  created_at: string
  updated_at: string
  last_reviewed: string | null
  next_review: string | null
  ease_factor: number
  interval: number
  repetitions: number
}

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 