import Image from 'next/image';

interface Artist {
  name: string;
  // Add other artist properties as needed
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Copyright {
  text: string;
  type: string;
}

interface ExternalUrls {
  spotify: string;
}

interface AlbumData {
  name: string;
  artists: Artist[];
  album_type: string;
  release_date: string;
  total_tracks: number;
  duration: string; // Assuming this is pre-formatted
  images: Image[];
  label?: string;
  popularity?: number;
  genres?: string[];
  copyrights?: Copyright[];
  external_urls: ExternalUrls;
}

interface AlbumDetailsProps {
  data: AlbumData;
}

const AlbumDetails: React.FC<AlbumDetailsProps> = ({ data }) => {
  return (
    <div className="bg-opacity-30 bg-black rounded-lg p-4 sm:p-5 md:p-6 mb-2">
      <div className="max-w-full">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
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
              {data.album_type.charAt(0).toUpperCase() +
                data.album_type.slice(1)}
            </p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 line-clamp-3">
              {data.name}
            </h1>
            <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-gray-300">
              <span className="font-bold">
                {data.artists.map((artist) => artist.name).join(', ')}
              </span>
              <span>•</span>
              <span>{new Date(data.release_date).getFullYear()}</span>
              <span>•</span>
              <span>{data.total_tracks} songs</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-sm text-gray-300">
          <div>
            <p>Release Date:</p>
            <p className="font-semibold">
              {new Date(data.release_date).toLocaleDateString()}
            </p>
          </div>
          {data.label && (
            <div>
              <p>Label:</p>
              <p className="font-semibold">{data.label}</p>
            </div>
          )}
          {data.popularity !== undefined && (
            <div>
              <p>Popularity:</p>
              <p className="font-semibold">{data.popularity}/100</p>
            </div>
          )}
        </div>

        {data.genres && data.genres.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-300 mb-2">Genres:</p>
            <div className="flex flex-wrap gap-2">
              {data.genres.map((genre, index) => (
                <span
                  key={index}
                  className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.copyrights && data.copyrights.length > 0 && (
          <div className="text-xs text-gray-400 mt-4">
            {data.copyrights.map((copyright, index) => (
              <p key={index}>{copyright.text}</p>
            ))}
          </div>
        )}

        {/* {data.external_urls && data.external_urls.spotify && (
          
            href={data.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-400 text-sm mt-4 inline-block"
          >
            View on Spotify
          </a>
        )} */}
      </div>
    </div>
  );
};

export default AlbumDetails;
