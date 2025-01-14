interface Song {
  _id: string;
  title: string;
  artist: string;
  album: string | null;
  imageUrl: string;
  audioUrl: string;
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

interface Stats {
  totalSongsCount: number;
  totalAlbumsCount: number;
  totalUsersCount: number;
  totalArtistsCount: number;
}

export type { Song, Album, Stats };
