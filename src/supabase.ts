import { createClient, PostgrestError } from '@supabase/supabase-js'
import { Database } from './../supabase';

const supabaseUrl = 'https://iophpxwuqfrtgujyfbiz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type DbResultErr = PostgrestError

if (!SUPABASE_KEY) {
  throw "Provide a SUPABASE KEY."
}

const supabase = createClient<Database>(supabaseUrl, SUPABASE_KEY);

type db = 'country' | 'games_to_arcades' | 'region' | 'city'

const selects = {
  games_to_arcades: `
    arcade!inner ( id, lat, lng, name, osm_id, games:games_to_arcades ( game_id ), address!inner ( road, postcode, house_number, city!inner ( name, id ), region!inner ( code, name, country!inner ( code, name ) ) ) )
  `,
  country: `
    name,
    code
  `,
  region: `
    name,
    code
  `,
  city: `
    id,
    name
  `,
}

interface filter {
  regionId?: number,
  countryId?: number,
  cityId?: number,
}

interface gameQuery {
  game_id: number,
  db: 'games'
}

const getData = (db: db) => async (
  column: string,
  value: number|string,
  filter: {
    regionId?: number,
    countryId?: number,
    cityId?: number
  } = {}
) => {
  const { regionId, countryId, cityId } = filter;

  let query = supabase
    .from(db)
    .select(selects[db])

  if (regionId) {
    query = query.eq('region.code', regionId)
  }

  if (countryId) {
    query = query.eq('country.code', countryId)
  }

  if (cityId) {
    query = query.eq('arcade.address.city.id', cityId)
  }  

  if (typeof value == "string") {
    query = query.textSearch(column, value, {
      config: 'english'
    });
  } else {
    query = query.eq(column, value);
  }

  const response: DbResult<typeof query> = await query;

  return response;
}

export const getLocationData = async (query: string) => {
  const countryResponse = getData('country')('name', query);
  const cityResponse = getData('city')('name', query);
  const regionResponse = getData('region')('name', query);

  const data = await Promise.all([ countryResponse, cityResponse, regionResponse ])

  const response = {
    countries: data[0].data,
    cities: data[1].data,
    regions: data[2].data,
  }

  return response;
}

export const getGameData = async (game_id: number, filter: filter) => {
  const response = await getData('games_to_arcades')('game_id', game_id, filter);
  return response;
}