import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for job applications
export interface JobApplication {
  id?: string
  created_at?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  position: string
  address: string
  employment_status: string
  ssn: string
  id_card_front_url?: string
  id_card_back_url?: string
  status?: string
}

export interface JobApplicationWithFiles extends JobApplication {
  idCardFront: File | null
  idCardBack: File | null
}
