import { IPicture } from 'music-metadata/lib/type';

export type TimeType = {
  currentTime: number,
  duration: number,
}

export type InfoType = {
  cover: IPicture | null;
  album: string;
  artist: string;
  title: string;
}

export type Status =
| 'stop'
| 'start'