export interface Dimensions {
  height: number;
  width: number;
}

export interface Album {
  name: string;
  image: string;
  dimensions: Dimensions;
}

export interface Track {
  name: string;
  artists: string[];
  uri?: string;
  album: Album;
}
