export class Analyser {
  private frequencyDomain: Float32Array;
  private _analyser: AnalyserNode;
  private frequencyOutput: number[];
  constructor(private context: AudioContext, fft: number, length: number) {
    this._analyser = context.createAnalyser();
    this._analyser.fftSize = fft;
    this.frequencyDomain = new Float32Array(this.analyser.frequencyBinCount);
    this.frequencyOutput = new Array(length + 1).fill(0);
  }
  private getInterval = (splitPoint = 1) => {
    const targetLength = this.frequencyOutput.length * splitPoint;
    const sourceLength = this.analyser.frequencyBinCount;
    return sourceLength / targetLength;
  }
  private calcVal = (index: number, average: number, num: number) => {
    const length = this.frequencyDomain.length;
    const ratio = index / Math.round(length * 0.12);
    const p = this.frequencyDomain[num >= length ? length - 1 : num] - average;
    const multi = Math.max(0, Math.min(1, 5 / 6 * (ratio - 1) ** 3 + 1));
    return p * multi || 0;
  }
  private calcFrequency = (interval: number, average: number, index: number) => {
    const n1 = ~~(index * interval);
    return Math.max(0, this.calcVal(index, average, n1));
  }
  private createArray = (average: number) => {
    const interval = this.getInterval();
    for (let i = 0, j = 0; j < this.frequencyOutput.length; i ++, j+=2) {
      this.frequencyOutput[j] = this.calcFrequency(interval, average, i);
    }
  }
  private transformData2Ouput = () => {
    const sum = this.frequencyDomain.reduce((pre, curr) => pre + curr, 0);
    const average = sum / this.frequencyDomain.length;
    this.createArray(average)
  }
  private init = () => {
    this.frequencyOutput.fill(0);
  }
  private update = () => {
    this.analyser.getFloatFrequencyData(this.frequencyDomain);
    this.transformData2Ouput();
  }
  public getData = () => {
    if (this.context.state !== 'running') {
      this.init();
    } else {
      this.update();
    }
    return {
      frequency: this.frequencyOutput,
      currentTime: this.context.currentTime,
    }
  }
  public get analyser() {
    return this._analyser;
  }
}