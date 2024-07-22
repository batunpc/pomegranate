import { NextResponse } from 'next/server';
import { spotifyApi } from '@/utils/spotify';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const albumId = params.id;
    const data = await spotifyApi(
      `/albums/${albumId}/tracks?limit=50`,
    ); // Adjust limit as needed

    const formattedTracks = data.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map(
        (artist: { name: string }) => artist.name,
      ),
      durationMs: track.duration_ms,
      trackNumber: track.track_number,
      discNumber: track.disc_number,
      explicit: track.explicit,
      previewUrl: track.preview_url,
      isPlayable: track.is_playable,
      externalUrls: track.external_urls,
    }));

    const response = {
      tracks: formattedTracks,
      total: data.total,
      limit: data.limit,
      offset: data.offset,
      next: data.next,
      previous: data.previous,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching album tracks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
