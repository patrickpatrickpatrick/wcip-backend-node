import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie, setCookie } from 'hono/cookie'
import { serve } from '@hono/node-server'

import { gamesApiFetch, getIgdbToken } from './utils';

import { getGameData } from './supabase';

const { SUPABASE_KEY, IGDB_SECRET, IGDB_ID } = process.env;

if (!(IGDB_ID && IGDB_SECRET)) {
  throw "Provide a clientID and clientSecret for IGDB!!"
}

if (!SUPABASE_KEY) {
  throw "Provide a key for Supabase!!"
}

const accessTokenGetter = async (c) => {
  let accessToken = getCookie(c, "igdb_access_token");

  if (!accessToken) {
    const { access_token, expires_in  } = await getIgdbToken(IGDB_ID, IGDB_SECRET);
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
  const data = await getGameData(gameId, { regionId, cityId, countryId });

  if (data) {
    return c.json(data);
  }
})

app.post('/games', async(c) => {
  const accessToken = await accessTokenGetter(c);
  const { query } = await c.req.json();
  const queryIgdb = `search "${query.replaceAll("\"", "")}"; fields name,first_release_date;`;
  const response = await gamesApiFetch(IGDB_ID, accessToken, queryIgdb);

  return c.json(response);
})

app.post('/game/:id', async(c) => {
  const accessToken = await accessTokenGetter(c);
  const id = c.req.param('id');
  const queryIgdb = `fields name,first_release_date,cover.*; where id = ${id};`;
  const response = await gamesApiFetch(IGDB_ID, accessToken, queryIgdb);

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
