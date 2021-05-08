import { GPUHandler } from "./gpuHandler";

export class EmitHandler {
  private preData: number[] = [];
  constructor(private gpuHandler: GPUHandler,private radius:number) { }
  private generateParticle = (data: number[]) => {
    const limit = 3;
    for (let i = 0; i < data.length; i += 5) {
      if (data[i] > this.preData[i] + limit) {
        const radian = i / 180 * Math.PI + (Math.random() - 0.5) * 90 * Math.PI;
        const force = (data[i] - this.preData[i]);
        const x = Math.cos(radian) * this.radius;
        const y = Math.sin(radian) * this.radius;
        this.gpuHandler.emit(x,y, force)
      }
    }
    this.preData = data.slice();
  }
  private checkData = (data: number[]) => {
    if (this.preData.length === 0) {
      this.preData = data.slice();
      return;
    }
    this.generateParticle(data);
  }
  public update = (frequency: number[]) => {
    this.checkData(frequency);
  }
}
