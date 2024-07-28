import Image from 'next/image';
import Link from 'next/link';
import { spotifyApi } from '@/utils/spotify';
import Vibrant from 'node-vibrant';
import AlbumDetails from '@/components/AlbumDetails';
import { TrackPlayButton } from '@/components/TrackPlayButton';
import { PlayIcon } from '@/components/icons/PlayIcon';
import { PauseIcon } from '@/components/icons/PauseIcon';
import { AudioPlayer } from '@/components/player/AudioPlayer';

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

// function PlayIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
//   return (
//     <svg
//       aria-hidden="true"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//       {...props}
//     >
//       <path d="M8 5v14l11-7z" />
//     </svg>
//   );
// }

function ShuffleIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      className="w-7 h-7 text-gray-200 "
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13.484 9.166 15 7h5m0 0-3-3m3 3-3 3M4 17h4l1.577-2.253M4 7h4l7 10h5m0 0-3 3m3-3-3-3"
      />
    </svg>
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

  const tHeaderStyle = {
    backgroundColor: adjustColor(dominantColor),
  };

  return (
    <div className="min-h-screen text-white" style={backgroundStyle}>
      <div className="flex-grow  flex flex-col">
        <AlbumDetails data={data} />
        {/* Small gap */}
        <div className="h-2"></div>

        {/* Tracks section */}
        <div className=" flex flex-col bg-opacity-50 bg-black rounded-lg px-1 sm:px-2 md:px-3 py-2 sm:py-3 md:py-4">
          {/* Fixed buttons container */}
          <div className="px-8 py-4">
            <div className="flex items-center gap-4">
              <button className="w-12 h-12 bg-pink-700 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                <PlayIcon className="h-6 w-6 text-black" />
              </button>
              <button className="w-10 h-10 text-white opacity-70 hover:opacity-100 transition-opacity">
                <ShuffleIcon className="h-6 w-6" />
              </button>
              {/* Add more buttons here if needed */}
            </div>
          </div>

          {/* Tracks table */}
          {/* <div className="flex-grow overflow-y-auto"> */}
          <div className="flex flex-col h-full">
            {/* Sticky header */}
            <div className="sticky top-0 bg-black bg-opacity-90 z-20">
              <table className="min-w-full">
                <thead style={tHeaderStyle}>
                  <tr>
                    <th
                      scope="col"
                      className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[10%]"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[30%] hidden md:table-cell"
                    >
                      Album
                    </th>
                    <th
                      scope="col"
                      className="px-2 sm:px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-[15%]"
                    >
                      Duration
                    </th>
                  </tr>
                </thead>
              </table>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-grow">
              <div className="overflow-hidden bg-opacity-50 bg-black">
                <table className="min-w-full border-separate border-spacing-0">
                  <tbody>
                    {data.tracks.items.map(
                      (track: any, index: number) => (
                        console.log(
                          'Track being passed to TrackPlayButton:',
                          JSON.stringify(track, null, 2),
                        ),
                        (
                          <tr
                            key={track.id}
                            className="group hover:bg-white hover:bg-opacity-10"
                          >
                            {/* <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-md text-gray-400 w-[10%] group-hover:rounded-l-lg">
                            <div className="relative w-8 h-8">
                              
                              <span className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-200">
                                {index + 1}
                              </span>
                              <button className="absolute inset-0 flex items-center justify-center text-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <PlayIcon className="h-7 w-7" />
                              </button>
                            </div>
                          </td> */}
                            <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-md text-gray-400 w-[10%] group-hover:rounded-l-lg">
                              <TrackPlayButton
                                track={{
                                  id: track.id,
                                  name: track.name,
                                  preview_url: track.preview_url,
                                  artists: track.artists,
                                  duration_ms: track.duration_ms,
                                  external_urls: track.external_urls,
                                  uri: track.uri,
                                  type: track.type,
                                }}
                                playing={
                                  <PauseIcon className="w-4 h-4" />
                                }
                                paused={
                                  <PlayIcon className="w-4 h-4" />
                                }
                              />
                            </td>

                            <td className="px-2 sm:px-4 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-white truncate">
                                  {track.name}
                                </span>
                                <span className="text-sm text-gray-400 truncate">
                                  {track.artists
                                    .map((artist: any) => artist.name)
                                    .join(', ')}
                                </span>
                              </div>
                            </td>
                            <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-400 w-[30%] hidden md:table-cell">
                              <span className="truncate block">
                                {data.name}
                              </span>
                            </td>
                            <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-400 text-right w-[15%] group-hover:rounded-r-lg">
                              {formatDuration(track.duration_ms)}
                            </td>
                          </tr>
                        )
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>

      {/* Pagination section */}
      {/* <div className="bg-neutral-900 p-4 border-t border-neutral-700">
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
      </div> */}
    </div>
  );
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
}

export const revalidate = 3600; // Revalidate every hour
