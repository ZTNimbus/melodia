interface Song {
  _id: string;
  title: string;
  artist: string;
  album: string | null;
  imageUrl: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

interface Album {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
  songs: Song[];
}

export type { Song, Album };
