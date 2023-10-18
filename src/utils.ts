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

  return gameResponse.results.reduce((res, game) => {
    return [
      ...res,
      {
        ...game,
      }
    ]
  }, [])
}