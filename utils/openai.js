import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getFakeArtistAnalysis(artistData) {
  const systemPrompt = `
    You are a helpful AI that examines Spotify data to determine if an artist might be "fake."
    Return JSON with fields: "score" (0 to 100) and "analysis" (short text).
  `;

  const userPrompt = `
    Artist Data:
    Name: ${artistData.name}
    Followers: ${artistData.followers}
    Popularity: ${artistData.popularity}
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

  // Attempt to parse JSON from the AI response
  try {
    const result = JSON.parse(rawText);
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
