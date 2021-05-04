import { Analyser } from "./analyser";

export class Audio {
  private source: AudioBufferSourceNode;
  private _isStart = false;
  private buffer?: AudioBuffer;
  constructor(private analyser: Analyser, private context: AudioContext) {
    this.source = this.context.createBufferSource();
  }

  private connect = (buffer: AudioBuffer) => {
    this.source.buffer = buffer;
    this.source.loop = true;
    const analyser = this.analyser.analyser;
    this.source.connect(analyser);
    analyser.connect(this.context.destination);
  }
  public decode = async (response: ArrayBuffer) => {
    this.buffer = await this.context.decodeAudioData(response, buffer => buffer);
    this.connect(this.buffer);
  }
  public start = () => {
    if (this._isStart) {
      this.context.resume();
      return;
    }
    this.source.start(0);
    this._isStart = true;
  }
  public stop = () => {
    this.context.suspend();
  }
  public get isPlaying() {
    if (!this._isStart) {
      return false;
    }
    return this.context.state === 'running';
  }
  public get duration() {
    return this.buffer?.duration;
  }
  public get isStart(){
    return this._isStart;
  }
}
