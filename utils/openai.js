import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getFakeArtistAnalysis(artistData) {
  const systemPrompt = `
  You are a specialized AI that analyzes Spotify data to determine if an artist might be "fake" or AI created.
  Given an artist's data, you should analyze their Spotify metrics, social presence, and other relevant information to determine the likelihood of them being a fake artist.
  Your analysis should be based on the following criteria:
  - The artist's follower count on Spotify.
  - The artist's popularity score on Spotify.
  - The artist's social presence on Instagram, including follower count and verification status.
  - The artist's presence on Wikipedia.
  - Any other relevant data that might indicate the artist is fake or AI-generated.
  Your response should include a "score" from 0 to 100, where a higher score indicates a higher likelihood of the artist being fake, and an "analysis" explaining the reasoning behind the score.
  
    Using these data points, respond only with a JSON object that includes:
    - "score" (an integer from 0 to 100)
    - "analysis" (a short textual summary)
  No additional text or formatting should be returned.
  
  `; 
  
  const userPrompt = `
    Artist Data:
    Name: ${artistData.name}
    Followers: ${artistData.followers}
    Popularity: ${artistData.popularity}
    Instagram Followers: ${artistData.socialPresence?.instagram?.followers}
    Instagram Verified: ${artistData.socialPresence?.instagram?.verified}
    Wikipedia Presence: ${artistData.socialPresence?.hasWiki}
    Social Presence: ${JSON.stringify(artistData.socialPresence)}

    Instructions:
    1. "score" should be an integer 0–100 (higher = more suspicious).
    2. "analysis" is a short explanation.
  `;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const rawText = completion.choices[0].message?.content;
  console.log('Raw AI response:', rawText);

  try {
    const jsonMatch = rawText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON object found in the AI response.");
    }
    const jsonString = jsonMatch[0];
    const result = JSON.parse(jsonString);
    return {
      score: result.score ?? 0,
      analysis: result.analysis ?? 'No analysis provided.',
    };
  } catch (err) {
    console.error('Failed to parse JSON from AI:', err);
    return {
      score: 0,
      analysis: 'Unable to parse AI response. Possibly invalid format.',
    };
  }
}
