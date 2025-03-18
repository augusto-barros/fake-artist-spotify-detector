
export async function checkWikipediaPresence(artistName) {
    // Build the Wikipedia API URL
    // We add &origin=* to handle CORS in some environments.
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${encodeURIComponent(
      artistName
    )}`;
  
    try {
      const resp = await fetch(apiUrl);
      if (!resp.ok) {
        throw new Error(`Wikipedia API error: ${resp.status} ${resp.statusText}`);
      }
  
      const data = await resp.json();
      const searchResults = data?.query?.search;
  
      if (!searchResults || searchResults.length === 0) {
        // No results found at all
        return {
          hasWikipedia: false,
          pageTitle: null,
          pageUrl: null,
        };
      }
  
      // Simple heuristic: look at the first search result
      const firstResult = searchResults[0];
      const title = firstResult.title;
  
      // Optional: you could refine checks (e.g., fuzzy matching, partial match).
      // For now, we assume the first search result is relevant if it has some partial match:
      const normalizedArtistName = artistName.toLowerCase().trim();
      const normalizedTitle = title.toLowerCase().trim();
  
      let isMatch = false;
      // Very naive check if the artist name is included in the wiki title
      if (normalizedTitle.includes(normalizedArtistName)) {
        isMatch = true;
      }
      // Or if the snippet has the name
      const snippet = firstResult.snippet?.toLowerCase() || '';
      if (snippet.includes(normalizedArtistName)) {
        isMatch = true;
      }
  
      // If it’s a match, build the full Wikipedia URL
      if (isMatch) {
        const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}`;
        return {
          hasWikipedia: true,
          pageTitle: title,
          pageUrl,
        };
      }
  
      // If the top result doesn’t match well, you can do more logic or iterate over more results
      // For simplicity, we’ll say "not present"
      return {
        hasWikipedia: false,
        pageTitle: null,
        pageUrl: null,
      };
    } catch (err) {
      console.error('Error checking Wikipedia presence:', err);
      // Return a default fallback
      return {
        hasWikipedia: false,
        pageTitle: null,
        pageUrl: null,
      };
    }
  }
  