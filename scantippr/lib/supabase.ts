import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://fpagcvbhxzrfrqsbcsuw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwYWdjdmJoeHpyZnJxc2Jjc3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NDExODYsImV4cCI6MjA5ODExNzE4Nn0.gEYHH3whzquG1QcdcEvO5dWUbXOP4k6HiT1zDDyuSFY'
)