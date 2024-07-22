const getAccessToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Spotify client ID or client secret is not defined',
    );
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(
    'https://accounts.spotify.com/api/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    },
  );

  if (!response.ok) {
    throw new Error('Failed to obtain access token');
  }

  const data = await response.json();
  return data.access_token;
};

let accessToken: string | null = null;
let tokenExpiration: number | null = null;

const spotifyApi = async (
  endpoint: string,
  options: RequestInit = {},
) => {
  if (
    !accessToken ||
    !tokenExpiration ||
    Date.now() > tokenExpiration
  ) {
    accessToken = await getAccessToken();
    tokenExpiration = Date.now() + 3600 * 1000; // Token expires in 1 hour
  }

  const response = await fetch(
    `https://api.spotify.com/v1${endpoint}`,
    {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Spotify API request failed');
  }

  return response.json();
};

export { spotifyApi };
