import Link from 'next/link';
import { Badge } from '../components/badge';
import { Divider } from '../components/divider';
import { Heading, Subheading } from '../components/heading';

import Image from 'next/image';

export function Stat({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div>
      <Divider />
      <div className="mt-6 font-medium text-lg/6 sm:text-sm/6">
        {title}
      </div>
      <div className="mt-3 font-semibold text-3xl/8 sm:text-2xl/8">
        {value}
      </div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <Badge color={change.startsWith('+') ? 'lime' : 'pink'}>
          {change}
        </Badge>{' '}
        <span className="text-zinc-500">from last week</span>
      </div>
    </div>
  );
}
async function getNewReleases() {
  // const res = await fetch('http://localhost:3000/api/new-releases');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/new-releases`,
  );
  if (!res.ok) {
    throw new Error('Failed to fetch new releases');
  }
  return res.json();
}

function AlbumCard({ albumData }: { albumData: any }) {
  return (
    <div className="w-full overflow-hidden transition-all duration-300 transform rounded-lg shadow-lg bg-gradient-to-br from-neutral-900 to-neutral-800 hover:shadow-2xl hover:-translate-y-1">
      <div className="relative aspect-square group">
        <Image
          src={albumData.coverUrl}
          alt={albumData.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-opacity duration-300 group-hover:opacity-75"
        />
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <Link
            href={`/albums/${albumData.id}`}
            className="px-4 py-2 font-semibold text-gray-900 transition-colors duration-200 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            View Album
          </Link>
          {/* <button className="px-4 py-2 font-semibold text-gray-900 transition-colors duration-200 bg-white rounded-full shadow-lg hover:bg-gray-100">
            Play Album
          </button> */}
        </div>
      </div>
      <div className="p-4">
        <h2 className="mb-1 text-lg font-bold text-white truncate">
          {albumData.title}
        </h2>
        <p className="mb-2 text-xs font-semibold text-emerald-400">
          New Release
        </p>
        <div className="flex justify-between mb-2 text-xs text-gray-400">
          <p>Release: {albumData.releaseDate}</p>
          <p>{albumData.trackCount} Tracks</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {albumData.artists.map((artist: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 text-xs text-gray-300 transition-colors duration-200 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600"
            >
              {artist}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  let albums = await getNewReleases();

  return (
    <>
      {/* <Heading>Good afternoon, Erica</Heading> */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {albums.map((album: any) => (
          <AlbumCard key={album.id} albumData={album} />
        ))}
      </div>
    </>
  );
}
