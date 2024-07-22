import Image from 'next/image';
import Link from 'next/link';
import { spotifyApi } from '@/utils/spotify';
import Vibrant from 'node-vibrant';

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex,
  );
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  );
}

function adjustColor(hex: string): string {
  const [r, g, b] = hexToRgb(hex);

  // Darken
  const darkenFactor = 0.4; // Adjust this value to make it darker or lighter
  const darkened = [
    Math.floor(r * darkenFactor),
    Math.floor(g * darkenFactor),
    Math.floor(b * darkenFactor),
  ];

  // Desaturate
  const desaturateFactor = 0.7; // Adjust this value to control desaturation
  const avg = (darkened[0] + darkened[1] + darkened[2]) / 3;
  const desaturated = darkened.map((channel) =>
    Math.round(
      channel * desaturateFactor + avg * (1 - desaturateFactor),
    ),
  );

  return rgbToHex(...(desaturated as [number, number, number]));
}

async function getImageColor(imageUrl: string) {
  try {
    const palette = await Vibrant.from(imageUrl).getPalette();
    const vibrantHex = palette.Vibrant?.hex || '#000000';
    return adjustColor(vibrantHex);
  } catch (error) {
    console.error('Error extracting color:', error);
    return '#000000';
  }
}

function PlayIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function ShuffleIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      className="w-6 h-6 text-gray-800 "
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13.484 9.166 15 7h5m0 0-3-3m3 3-3 3M4 17h4l1.577-2.253M4 7h4l7 10h5m0 0-3 3m3-3-3-3"
      />
    </svg>
  );
}

function TrackEntry({ track, index }: { track: any; index: number }) {
  return (
    <div className="flex items-center py-3 text-gray-300 hover:bg-opacity-10 hover:bg-white">
      <span className="w-8 text-right mr-4 text-gray-400">
        {index + 1}
      </span>
      <div className="flex-grow">
        <h3 className="text-white">{track.name}</h3>
        <p className="text-sm text-gray-400">
          {track.artists
            .map((artist: { name: string }) => artist.name)
            .join(', ')}
        </p>
      </div>
      <span className="w-16 text-right text-gray-400">
        {track.plays}
      </span>
      <span className="w-16 text-right text-gray-400">
        {track.duration}
      </span>
    </div>
  );
}

export default async function Album({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const { id } = params;
  const page = Number(searchParams.page) || 1;
  const tracksPerPage = 8;
  const data = await spotifyApi(`/albums/${id}`);

  const startIndex = (page - 1) * tracksPerPage;
  const endIndex = startIndex + tracksPerPage;
  const currentTracks = data.tracks.items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(
    data.tracks.items.length / tracksPerPage,
  );

  const dominantColor = await getImageColor(data.images[0]?.url);

  const backgroundStyle = {
    background: `linear-gradient(to bottom, ${dominantColor}, #121212)`,
  };

  return (
    <div
      className="flex flex-col text-white  h-[calc(100vh-theme('spacing.8'))]"
      style={backgroundStyle}
    >
      <div className="flex-grow  flex flex-col">
        {/* Album details section */}
        <div className="bg-opacity-30 bg-black rounded-lg p-4 sm:p-5 md:p-6 mb-2">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="w-40 sm:w-48 md:w-52 flex-shrink-0">
                <Image
                  src={data.images[0]?.url}
                  alt={data.name}
                  width={200}
                  height={200}
                  className="shadow-lg rounded-lg w-full h-auto"
                />
              </div>
              <div className="text-center sm:text-left flex-grow">
                <p className="text-xs sm:text-sm font-bold mb-1 sm:mb-2">
                  Album
                </p>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 line-clamp-3">
                  {data.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-300">
                  <span className="font-bold">
                    {data.artists[0].name}
                  </span>{' '}
                  • {new Date(data.release_date).getFullYear()} •{' '}
                  {data.total_tracks} songs, {data.duration}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Small gap */}
        <div className="h-2"></div>

        {/* Tracks section */}
        <div className="flex-grow overflow-hidden flex flex-col bg-opacity-50 bg-black rounded-t-lg">
          {/* Fixed buttons container */}
          <div className="px-8 py-4">
            <div className="flex items-center gap-4">
              <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                <PlayIcon className="h-6 w-6 text-black" />
              </button>
              <button className="w-10 h-10 text-white opacity-70 hover:opacity-100 transition-opacity">
                <ShuffleIcon className="h-6 w-6" />
              </button>
              {/* Add more buttons here if needed */}
            </div>
          </div>

          {/* Tracks table */}
          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Album
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTracks.map((track: any, index: number) => (
                  <tr
                    key={track.id}
                    className="hover:bg-white hover:bg-opacity-10"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">
                          {track.name}
                        </span>
                        <span className="text-sm text-gray-400">
                          {track.artists
                            .map((artist: any) => artist.name)
                            .join(', ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {data.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-right">
                      {track.duration_ms}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination section */}
      <div className="bg-neutral-900 p-4 border-t border-neutral-700">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          {page > 1 ? (
            <Link
              href={`/albums/${id}?page=${page - 1}`}
              className="text-pink-500 hover:text-pink-400"
            >
              Previous
            </Link>
          ) : (
            <span className="text-gray-500">Previous</span>
          )}
          <span className="text-gray-400">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/albums/${id}?page=${page + 1}`}
              className="text-pink-500 hover:text-pink-400"
            >
              Next
            </Link>
          ) : (
            <span className="text-gray-500">Next</span>
          )}
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600; // Revalidate every hour
