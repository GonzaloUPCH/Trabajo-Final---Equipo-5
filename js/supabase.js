import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://dakuectdqyrwyvvzwepl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRha3VlY3RkcXlyd3l2dnp3ZXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MjcwMjIsImV4cCI6MjA5ODIwMzAyMn0.ZdAaNeCNZlJUzuPV25Vs2Iy-ndIeNa4OhTiard9jphM'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase
