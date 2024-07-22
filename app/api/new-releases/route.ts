import { NextResponse } from 'next/server';
import { spotifyApi } from '@/utils/spotify';

export async function GET(request: Request) {
  try {
    const data = await spotifyApi('/browse/new-releases?limit=20'); // Adjust limit as needed

    const formattedAlbums = data.albums.items.map((album: any) => ({
      id: album.id,
      title: album.name,
      coverUrl: album.images[0].url,
      releaseDate: new Date(album.release_date).toLocaleDateString(),
      trackCount: album.total_tracks,
      artists: album.artists.map(
        (artist: { name: string }) => artist.name,
      ),
    }));

    return NextResponse.json(formattedAlbums);
  } catch (error) {
    console.error('Error fetching new releases:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
