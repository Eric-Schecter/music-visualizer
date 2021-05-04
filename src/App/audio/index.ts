import * as mm from 'music-metadata-browser';
import { Audio } from "./audio";
import { Analyser } from "./analyser";
import { getfft } from "./getfft";
import { Status } from '../../shared/types';

export class AudioProcessor {
  private response: Promise<ArrayBuffer>;
  private audio?: Audio;
  private analyser: Analyser;
  private context: AudioContext;
  private time: number;
  private offset = 0;
  private _status:Promise<Status> = Promise.resolve('stop');
  constructor(private url: string, outputSize = 2048) {
    this.response = this.getAudioFile(url);
    const fft = getfft(outputSize);
    this.context = new AudioContext();
    this.analyser = new Analyser(this.context, fft, outputSize);
    this.time = Date.now();
  }
  private getAudioFile = (url: string) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    const response: Promise<ArrayBuffer> = new Promise((resolve, reject) => {
      request.onload = () => resolve(request.response);
      request.onerror = () => reject('load music fail');
    })
    request.send();
    return response;
  }
  private initAudio = async () => {
    const audio = new Audio(this.analyser, this.context);
    const res = await this.response;
    await audio.decode(res);
    return audio;
  }
  public start = async () => {
    this._status = new Promise(async(resolve)=>{
      if (!this.audio) {
        this.audio = await this.initAudio();
        this.time = Date.now();
      }
      if (!this.audio.isPlaying) {
        this.audio.start();
        resolve('start');
      } else {
        this.audio.stop();
        resolve('stop');
      }
    });
  }
  public getData() {
    const { frequency, currentTime } = this.analyser.getData();
    if (!this.audio?.isStart) {
      this.offset = (Date.now() - this.time) / 1000;
    }
    console.log(this.offset,currentTime,currentTime-this.offset)
    return {
      duration: this.audio?.duration,
      currentTime: currentTime - this.offset,
      frequency,
    }
  };
  public getmetadata = () => {
    return mm.fetchFromUrl(this.url).then(d => {
      const { picture, album = '', artist = '', title = '' } = d.common;
      const cover = mm.selectCover(picture);
      return {
        cover, album, artist, title,
      }
    })
  }
  public get status() {
    return this._status;
  }
}