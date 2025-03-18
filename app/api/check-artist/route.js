// app/api/check-artist/route.js
import { NextResponse } from 'next/server';
import { getArtistByName } from '@/utils/spotify';
import { checkWikipediaPresence } from '@/utils/wikipedia';
import { getFakeArtistAnalysis } from '@/utils/openai';

export async function POST(request) {
  try {
    const { artistName } = await request.json();
    if (!artistName) {
      return NextResponse.json({ error: 'Missing artistName' }, { status: 400 });
    }

    // Fetch from Spotify
    const artist = await getArtistByName(artistName);
    if (!artist) {
      return NextResponse.json(
        { error: `No artist found for "${artistName}".` },
        { status: 404 }
      );
    }

    // Wikipedia check
    const wikiData = await checkWikipediaPresence(artistName);

    // Combine into the data we’ll pass to OpenAI
    const artistData = {
      name: artist.name,
      followers: artist.followers?.total ?? 0,
      popularity: artist.popularity ?? 0,
      socialPresence: {
        hasWiki: wikiData.hasWikipedia,
        wikiTitle: wikiData.pageTitle,
        wikiUrl: wikiData.pageUrl,
      },
    };

    // Get analysis from OpenAI
    const aiResult = await getFakeArtistAnalysis(artistData);

    return NextResponse.json({
      artistName: artistData.name,
      fakeScore: aiResult.score,
      analysis: aiResult.analysis,
      wikiData,
    });
  } catch (err) {
    console.error('Error in check-artist route:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
