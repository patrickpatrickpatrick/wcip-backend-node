import {
  createClient,
} from '@supabase/supabase-js'
import { Database } from './../supabase';

const supabaseUrl = 'https://iophpxwuqfrtgujyfbiz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
  throw "Provide a SUPABASE KEY."
}

const supabase = createClient<Database>(supabaseUrl, SUPABASE_KEY);

interface gameFilter {
  regionId?: number,
  countryId?: number,
  cityId?: number,
}

export const getGameData = async (game_id: number, filter: gameFilter) => {
  const { regionId, countryId, cityId } = filter;

  let query = supabase
    .from('arcade')
    .select(`*, games_to_arcades!inner(game_id), ...address(*, ...city(*, ...region(*, ...country(*))))`)
    .eq('games_to_arcades.game_id', game_id)

  if (regionId) {
    query = query.eq('code', regionId)  
  }

  if (countryId) {
    query = query.eq('country.code', countryId)
  }

  if (cityId) {
    query = query.eq('arcade.address.city.id', cityId)
  }  

  const { data, error } = await query;

  // better way of debugging
  // have to find :)
  console.log(error)

  if (error) throw error
  return data;
}