import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fpagcvbhxzrfrqsbcsuw.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwYWdjdmJoeHpyZnJxc2Jjc3V3Iiwicm9sZSI6ImFub25fcm9sZSIsImlhdCI6MTc4MjU0MTE4NiwiZXhwIjoyMDk4MTE3MTg2fQ.URqFW9PCplJui7LSQD0yOCnb-V7dIGXHDvsncOmW52w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
