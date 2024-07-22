import { NextResponse } from 'next/server';
import { spotifyApi } from '@/utils/spotify';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const data = await spotifyApi(`/albums/${id}`);

    const formattedAlbum = {
      id: data.id,
      name: data.name,
      artists: data.artists.map(
        (artist: { name: string }) => artist.name,
      ),
      release_date: data.release_date,
      total_tracks: data.total_tracks,
      image_url: data.images[0]?.url,
      tracks: data.tracks.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        duration_ms: track.duration_ms,
        track_number: track.track_number,
        preview_url: track.preview_url,
        artists: track.artists.map(
          (artist: { name: string }) => artist.name,
        ),
      })),
      genres: data.genres,
      label: data.label,
      popularity: data.popularity,
    };

    return NextResponse.json(formattedAlbum);
  } catch (error) {
    console.error('Error fetching album:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
