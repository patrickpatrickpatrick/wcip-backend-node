import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie, setCookie } from 'hono/cookie'
import { serve } from '@hono/node-server'

import { gamesApiFetch, getIgdbToken } from './utils';

import { getGameData, getLocationData } from './supabase';

const igbdClientID = process.env.IGDB_ID;
const igbdClientSecret = process.env.IGDB_SECRET;

if (!(igbdClientID && igbdClientSecret)) {
  throw "Provide a clientID and clientSecret for IGDBB."
}

const accessTokenGetter = async (c) => {
  let accessToken = getCookie(c, "igdb_access_token");

  if (!accessToken) {
    const { access_token, expires_in  } = await getIgdbToken(igbdClientID, igbdClientSecret);
    const expire_date = new Date();

    expire_date.setSeconds(expire_date.getSeconds() + parseInt(expires_in))

    setCookie(
      c,
      "igdbAccessToken",
      access_token,
      {
        expires: expire_date
      }
    );

    accessToken = access_token;
  }

  return accessToken;
}

const app = new Hono()

process.on('uncaughtException', function (err) {
  console.log(err);
});

app.use('/*', cors())

app.get('/', (c) => c.text('This is the "Where Can I Play?" backend. It is implemented using Hono and nodejs.'))

app.post('/arcades', async(c) => {
  const { gameId, regionId, cityId, countryId } = await c.req.json();

  const { data, error } = await getGameData(gameId, { regionId, cityId, countryId });

  if (data) {

    // i dunno if there's way to actually get the flattened
    // response from supabase? guess i have to do it here!
    // one more reason to eventually just use my own API i
    // guess...
    // https://github.com/orgs/supabase/discussions/6874


    console.log(data)

    return c.json(data.map(({ arcade }) => ({
      ...arcade,
      games: arcade.games.map(game => game.game_id),
      address: {
        ...arcade.address[0],
        city: arcade.address[0].city,
      }
    })));
  } else if (error) {
    return c.json(error);
  }
})

app.post('/locations', async (c) => {
  const { query } = await c.req.json();

  const response = await getLocationData(query);

  return c.json(response);
})

app.post('/games', async(c) => {
  const accessToken = await accessTokenGetter(c);
  const { query } = await c.req.json();
  const queryIgdb = `search "${query.replaceAll("\"", "")}"; fields name,first_release_date;`;
  const response = await gamesApiFetch(igbdClientID, accessToken, queryIgdb);

  return c.json(response);
})

app.post('/game/:id', async(c) => {
  const accessToken = await accessTokenGetter(c);
  const id = c.req.param('id');
  const queryIgdb = `fields name,first_release_date,cover.*; where id = ${id};`;
  const response = await gamesApiFetch(igbdClientID, accessToken, queryIgdb);

  return c.json(response[0]);
})

let port = 3000;

if (process.env.PORT) {
  port = parseInt(process.env.PORT);
}

serve({
  fetch: app.fetch,
  port: port
})
