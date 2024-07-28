export interface Track {
  id: string;
  name: string;
  preview_url: string;
  artists: Array<{ name: string }>;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  uri: string;
  type: string;
  album?: {
    images: Array<{ url: string }>;
  };
}
