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

    // Fetch artist info from Spotify including photo, monthlyListeners, and verified status.
    const artist = await getArtistByName(artistName);
    if (!artist) {
      return NextResponse.json(
        { error: `No artist found for "${artistName}".` },
        { status: 404 }
      );
    }

    // Perform a Wikipedia check for additional context.
    const wikiData = await checkWikipediaPresence(artistName);

    // Combine artist data including the new Spotify fields.
    const artistData = {
      name: artist.name,
      followers: artist.followers,
      popularity: artist.popularity,
      photo: artist.photo,
      monthlyListeners: artist.monthlyListeners,
      verified: artist.verified,
      socialPresence: {
        hasWiki: wikiData.hasWikipedia,
        wikiTitle: wikiData.pageTitle,
        wikiUrl: wikiData.pageUrl,
      },
    };

    // Get analysis from OpenAI with the full artist data.
    const aiResult = await getFakeArtistAnalysis(artistData);

    return NextResponse.json({
      artistName: artistData.name,
      fakeScore: aiResult.score,
      analysis: aiResult.analysis,
      wikiData,
      spotifyInfo: {
        followers: artistData.followers,
        photo: artistData.photo,
        monthlyListeners: artistData.monthlyListeners,
        verified: artistData.verified,
      },
    });
  } catch (err) {
    console.error('Error in check-artist route:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
