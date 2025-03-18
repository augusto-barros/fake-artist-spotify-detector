export async function getSpotifyToken() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  
    if (!clientId || !clientSecret) {
      throw new Error('Spotify Client ID/Secret not set in environment.');
    }
  
    const tokenUrl = 'https://accounts.spotify.com/api/token';
  
    const resp = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      body: new URLSearchParams({ grant_type: 'client_credentials' }),
    });
  
    if (!resp.ok) {
      throw new Error('Failed to get Spotify access token');
    }
  
    const data = await resp.json();
    return data.access_token;
  }
  
  export async function getArtistByName(name) {
    const token = await getSpotifyToken();
    // The Spotify Search endpoint
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      name
    )}&type=artist&limit=1`;
  
    const resp = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (!resp.ok) {
      throw new Error('Failed to search artist by name');
    }
  
    const json = await resp.json();
    const artists = json?.artists?.items;
    if (!artists || artists.length === 0) {
      // No artist found
      return null;
    }
    return artists[0]; // Return the first matching artist
  }
  