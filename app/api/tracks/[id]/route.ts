import { NextResponse } from 'next/server';
import { spotifyApi } from '@/utils/spotify';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const trackId = params.id;
    const data = await spotifyApi(`/tracks/${trackId}`);

    const formattedTrack = {
      id: data.id,
      name: data.name,
      artists: data.artists.map((artist: any) => ({
        id: artist.id,
        name: artist.name,
        externalUrls: artist.external_urls,
      })),
      album: {
        id: data.album.id,
        name: data.album.name,
        releaseDate: data.album.release_date,
        totalTracks: data.album.total_tracks,
        images: data.album.images,
      },
      durationMs: data.duration_ms,
      popularity: data.popularity,
      explicit: data.explicit,
      externalUrls: data.external_urls,
      previewUrl: data.preview_url,
      isPlayable: data.is_playable,
      trackNumber: data.track_number,
      discNumber: data.disc_number,
      externalIds: data.external_ids,
      availableMarkets: data.available_markets,
    };

    return NextResponse.json(formattedTrack);
  } catch (error) {
    console.error('Error fetching track details:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
