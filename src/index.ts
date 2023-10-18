import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie, setCookie } from 'hono/cookie'
import { serve } from '@hono/node-server'

import { db, getData } from './firebase';
import { gamesApiFetch, getIgdbToken } from './utils';

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
  const { gameId } = await c.req.json();

  const ref = db.collection('arcades');
  const response = await getData(
    ref, ['games', 'array-contains-any', [parseInt(gameId)]]);

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
