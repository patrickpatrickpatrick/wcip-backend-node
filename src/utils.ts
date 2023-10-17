const API_URL = "https://api.igdb.com/v4/";

export const requestBuilder = (clientId: string, accessToken: string, query: string) => ({
  headers: {
    "Client-ID": clientId,
    "Authorization": `Bearer ${accessToken}`,
  },
  method: "POST",
  body: query  
});

interface igdbTokenResponse {
  access_token: string,
  expires_in: string,
  token_type: string,
}

const handleResponse = async (res) => {
  if (res.ok) {

    const json = await res.json();

    console.log(json)

    return {
      results: json,
      type: "success",
    }  
  } else {
    return {
      type: 'error',
      message: res.body || 'An error has occurred',
    }
  }  
}

export const getIgdbToken = (client_id: string, client_secret: string): Promise<igdbTokenResponse> => fetch(
  `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`,
  {
    method: "POST"
  }
)
.then(data => data.json())
.then(json => json as igdbTokenResponse);
  
export const gamesApiFetch = async (clientId: string, accessToken: string, query: string) => {
  const gamesQuery = query;
  const gameResponse = await fetch(
    `${API_URL}games`,
    requestBuilder(clientId, accessToken, gamesQuery)
  ).then(res => handleResponse(res));

  if (gameResponse.type == 'error') {
    return gameResponse;
  }

  const coversIds = gameResponse.results.filter(x => x.cover).map(x => x.cover).join(',')
  const coverQuery = `fields url; where id = (${coversIds});`
  let coverResponse;

  if (coversIds && coversIds.length) {
    coverResponse = await fetch(
      `${API_URL}covers`,
      requestBuilder(clientId, accessToken, coverQuery)
    ).then(res => handleResponse(res));

    if (coverResponse.type == 'error') {
      console.log("Error occured when trying to fetch covers. Non-blocking error.")
    }
  }

  return gameResponse.results.reduce((res, game) => {
    let cover = coverResponse.results.find(x => x.id == game.cover);
    return [
      ...res,
      {
        ...game,
        ...(
          cover ? { cover_url: cover.url } : {} 
        )
      }
    ]
  }, [])
}