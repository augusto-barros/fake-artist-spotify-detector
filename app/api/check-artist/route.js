import { NextResponse } from 'next/server';
import { getArtistByName } from '@/utils/spotify';
import { checkWikipediaPresence } from '@/utils/wikipedia';
import { getFakeArtistAnalysis } from '@/utils/openai';
import fetchInstagramProfile from '@/utils/instagram';

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

    // Fetch Instagram profile data using the constructed artistData.
    const instagramResults = await fetchInstagramProfile(artistData);
    // Assume the actor returns an array; extract the first profile.
    const instagramProfile =
      Array.isArray(instagramResults) && instagramResults.length > 0
        ? instagramResults[0]
        : {};

    // Get analysis from OpenAI with the full artist data, including Instagram data.
    const aiResult = await getFakeArtistAnalysis({
      ...artistData,
      InstagramData: instagramProfile,
    });

    return NextResponse.json({
      artistName: artistData.name,
      fakeScore: aiResult.score,
      analysis: aiResult.analysis,
      wikiData,
      instagramData: {
        followers: instagramProfile.followersCount
          ? instagramProfile.followersCount.toLocaleString()
          : 'N/A',
        verified: instagramProfile.verified ? 'Yes' : 'No',
      },
      spotifyInfo: {
        followers: artistData.followers.toLocaleString(),
        photo: artistData.photo,
      },
    });
  } catch (err) {
    console.error('Error in check-artist route:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
