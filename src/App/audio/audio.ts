export class Audio {
  private source: AudioBufferSourceNode;
  private _isStart = true;
  private _isReady = false;
  constructor(private context: AudioContext) {
    this.source = this.context.createBufferSource();
  }
  private connect = (buffer: AudioBuffer, analyser: AudioNode, isFirst: boolean) => {
    if (!isFirst) {
      this.source.disconnect();
      this.source = this.context.createBufferSource();
    }
    this.source.buffer = buffer;
    this.source.loop = true;
    this.source.connect(analyser);
    analyser.connect(this.context.destination);
  }
  public decode = async (response: ArrayBuffer, analyser: AudioNode, isFirst: boolean) => {
    this._isReady = false;
    const buffer = await this.context.decodeAudioData(response, buffer => buffer);
    this.connect(buffer, analyser, isFirst);
    this._isReady = true;
  }
  public start = () => {
    if (!this._isStart) {
      this.source.start(0);
      this._isStart = true;
    }
    this.context.resume();
  }
  public pause = () => {
    this.context.suspend();
  }
  public reset = () => {
    this._isStart = false;
  }
  public get isPlaying() {
    if (!this._isStart) {
      return false;
    }
    return this.context.state === 'running';
  }
  public get duration() {
    return this.source.buffer?.duration;
  }
  public get isStart() {
    return this._isStart;
  }
  public set isStart(state: boolean) {
    this._isStart = state;
  }
  public get isReady() {
    return this._isReady;
  }
}
