import { createClient, PostgrestError } from '@supabase/supabase-js'
import { Database } from './../supabase-js';

const supabaseUrl = 'https://iophpxwuqfrtgujyfbiz.supabase.co';
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvcGhweHd1cWZydGd1anlmYml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg2ODQ0OTQsImV4cCI6MjAxNDI2MDQ5NH0.KSsPfXIZAcUP-TS7o4Y7hWAne7AY782ZBjkzR3RLykA";

type DbResult<T> = T extends PromiseLike<infer U> ? U : never
type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
type DbResultErr = PostgrestError

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

type db = 'countries' | 'games_to_arcades' | 'states'

const selects = {
  games_to_arcades: `
    id
    game_id
    arcades ( created_at, games, id, lat, lng, name, osm_id, place_id )
  `
}

interface query {
  id?: number,
  game_id?: number,
}

export const getData => (db: db) => ({ 
  column,
  value
}: query) => {
  const { data, error } = await supabase
    .from(db)
    .select(selects[db])
    .eq(column, value)

  console.log(data)
  console.log(error)
}
