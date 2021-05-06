import * as mm from 'music-metadata-browser';
import { Audio } from "./audio";
import { Analyser } from "./analyser";
import { getfft } from "./getfft";
import { Status } from '../../shared/types';

type Metadata = {
  cover: mm.IPicture | null;
  album: string;
  artist: string;
  title: string;
}

export class AudioProcessor {
  private response?: ArrayBuffer;
  private audio?: Audio;
  private analyser: Analyser;
  private context: AudioContext;
  private offset = 0;
  private isStart = true;
  private data?: string | ArrayBuffer;
  constructor(outputSize = 2048, private cb: () => any) {
    const fft = getfft(outputSize);
    this.context = new AudioContext();
    this.analyser = new Analyser(this.context, fft, outputSize);
  }
  public load = async (data: string | ArrayBuffer) => {
    this.data = data;
    const isFirst = !this.audio;
    if (!this.audio) {
      this.audio = new Audio(this.context);
    }
    this.init(this.audio);
    this.response = await this.getAudioFile(data);
    await this.audio.decode(this.response, this.analyser.analyser, isFirst);
    this.cb();
    return this.audio;
  }
  private init = (audio: Audio) => {
    this.cb();
    audio.reset();
    audio.pause();
    this.offset = this.analyser.getData().currentTime;
    this.isStart = true;
  }
  private getAudioFile = (data: string | ArrayBuffer) => {
    if (typeof data === 'string') {
      const request = new XMLHttpRequest();
      request.open('GET', data, true);
      request.responseType = 'arraybuffer';
      const response: Promise<ArrayBuffer> = new Promise((resolve, reject) => {
        request.onload = () => resolve(request.response);
        request.onerror = () => reject('load music fail');
      })
      request.send();
      return response;
    }
    return data;
  }
  public start = async (): Promise<Status> => {
    this.isStart = false;
    return new Promise(async (resolve) => {
      if (!this.audio) {
        if (!this.data) {
          resolve('stop');
          return;
        }
        this.audio = await this.load(this.data);
      }
      if (!this.audio.isReady) {
        resolve('loading');
      } else if (!this.audio.isPlaying) {
        this.audio.start();
        resolve('start');
      } else {
        this.audio.pause();
        resolve('stop');
      }
    });
  }
  public getData() {
    const { frequency, currentTime } = this.analyser.getData();
    if (this.isStart) {
      this.offset = currentTime;
    }
    return {
      duration: this.audio?.duration,
      currentTime: currentTime - this.offset, // fix bugs for different case of currentTime
      frequency,
    }
  };
  private arrayBuffer2buffer = (data: ArrayBuffer) => {
    const buffer = Buffer.alloc(data.byteLength);
    const view = new Uint8Array(data);
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = view[i];
    }
    return buffer;
  }
  public getmetadata = (): Promise<Metadata | null> => {
    if (!this.data) { return new Promise((resolve) => resolve(null)) }
    const data = typeof this.data === 'string'
      ? mm.fetchFromUrl(this.data)
      : mm.parseBuffer(this.arrayBuffer2buffer(this.data))
    return data.then(d => {
      const { picture, album = '', artist = '', title = '' } = d.common;
      const cover = mm.selectCover(picture);
      return {
        cover, album, artist, title,
      }
    })
  }
}