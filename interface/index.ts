export interface DispatchType {
  type: string;
  payload?: any;
}

type imagePayload = {
  height: number;
  url: string;
  width: number;
};

export type ArtistPayload = {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: null | string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: imagePayload[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
};

type TrackArtistPayload = {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type AlbumPayload = {
  album_type: string;
  artists: TrackArtistPayload[];
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: imagePayload[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
};

export type PlaylistPayload = {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  image: imagePayload[];
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: any;
  public: any;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
};

export type TrackPayload = {
  album: AlbumPayload;
  artists: TrackArtistPayload[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
};
