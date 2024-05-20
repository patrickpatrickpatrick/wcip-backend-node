import {
  createClient,
  PostgrestError,
  QueryResult,
  QueryData,
  QueryError
} from '@supabase/supabase-js'
import { Database } from './../supabase';

const supabaseUrl = 'https://iophpxwuqfrtgujyfbiz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
  throw "Provide a SUPABASE KEY."
}

const supabase = createClient<Database>(supabaseUrl, SUPABASE_KEY);

type dbType = 'country' | 'games_to_arcades' | 'region' | 'city'

// const queryBuilder = (db: dbType) => {
//   return {
//     games_to_arcades: supabase
//       .from('games_to_arcades')
//       .select(`arcade!inner ( id, lat, lng, name, osm_id, games:games_to_arcades ( game_id ), address!inner ( road, postcode, house_number, city!inner ( name, id ), region!inner ( code, name, country!inner ( code, name ) ) ) )`),
//     country: supabase
//       .from('country')
//       .select(`name, code`),
//     city: supabase
//       .from('city')
//       .select(`id, name`),
//     region: supabase
//       .from('region')
//       .select(`name, code`)
//   }[db]
// }

// const getDataQuery = (db: dbType) => {
  // const { regionId, countryId, cityId } = filter;

  // let query = supabase
    // .from(db)
    // .select(selects[db] as '*')

  // https://github.com/supabase/supabase-js/issues/551
  // let query = queryBuilder(db);
  // type queryType = QueryData<typeof query>
  
  // if (regionId) {
  //   query = query.eq('code', regionId)
  // }

  // if (countryId) {
  //   query.eq
  //   // query = query.eq('country.code', countryId)
  // }

  // if (cityId) {
  //   query = query.eq('arcade.address.city.id', cityId)
  // }

  // if (typeof value == "string") {
  //   query = query.textSearch(column, value, {
  //     config: 'english'
  //   });
  // } else {
  //   query = query.eq(column, value);
  // }

  // return query;

  // const { data, error } = await query;
  // if (error) throw error
  // const returnData: queryType = data;
  // return returnData;
// }

// export const getLocationData = async (query: string) => {
//   // const countryResponse = getData('country')('name', query);
//   // const cityResponse = getData('city')('name', query);
//   // const regionResponse = getData('region')('name', query);


//   const data = await Promise.all([ countryResponse, cityResponse, regionResponse ])

//   const response = {
//     countries: data[0],
//     cities: data[1],
//     regions: data[2],
//   }

//   return response;
// }

interface gameFilter {
  regionId?: number,
  countryId?: number,
  cityId?: number,
}

export const getGameData = async (game_id: number, filter: gameFilter) => {
  const { regionId, countryId, cityId } = filter;

  let query = supabase
    .from('arcade')
    .select(`*, games_to_arcades!inner(game_id), ...address(*, ...region(*, ...country(*)))`)
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