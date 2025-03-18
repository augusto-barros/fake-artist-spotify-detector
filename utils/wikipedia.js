/**
 * Checks if an artist has a Wikipedia page
 * @param {string} artistName - The name of the artist to search for
 * @returns {Promise<Object>} Object containing Wikipedia presence data
 */
export async function checkWikipediaPresence(artistName) {
  try {
    // Wikipedia API endpoint for searching
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      artistName
    )}&format=json&origin=*`;

    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error('Failed to search Wikipedia');
    }

    const data = await response.json();
    const searchResults = data?.query?.search || [];

    // If we found any results
    if (searchResults.length > 0) {
      const topResult = searchResults[0];
      const pageTitle = topResult.title;
      const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`;
      
      return {
        hasWikipedia: true,
        pageTitle,
        pageUrl,
        snippet: topResult.snippet,
      };
    }

    // No Wikipedia entry found
    return {
      hasWikipedia: false,
      pageTitle: null,
      pageUrl: null,
      snippet: null,
    };
  } catch (error) {
    console.error('Wikipedia API error:', error);
    return {
      hasWikipedia: false,
      pageTitle: null,
      pageUrl: null,
      error: error.message,
    };
  }
}
