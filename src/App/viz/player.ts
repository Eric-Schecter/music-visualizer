import { Visualizer } from "./visualizer";
import { Background } from "./background";
import { ParticleSystem } from "./particleSystem";
import { Scene, WebGLRenderer, Clock, BufferAttribute } from "three";

export class Player {
  private radius = 30;
  private visualizer: Visualizer;
  private ps: ParticleSystem;
  private background: Background;
  private frequencies: BufferAttribute;
  private radialSegments = 2;
  private tubularSegments = 360;
  constructor(renderer: WebGLRenderer, scene: Scene, clock: Clock) {
    this.frequencies = new BufferAttribute(new Float32Array((this.radialSegments + 1) * (this.tubularSegments + 1)), 1);
    this.ps = new ParticleSystem(renderer, scene, this.radius, clock, this.frequencies, this.radialSegments, this.tubularSegments);
    this.visualizer = new Visualizer(scene, this.radius, this.frequencies, this.radialSegments, this.tubularSegments);
    this.background = new Background(scene);
  }
  private updateFrequency = (frequency: number[]) => {
    this.frequencies.needsUpdate = true;
    for (let i = 0; i < this.frequencies.count; i++) {
      (this.frequencies.array[i] as any) = frequency[i % (this.tubularSegments + 1)] || 0;
    }
  }
  public update = (frequency: number[], time: number) => {
    this.updateFrequency(frequency)
    this.visualizer.update(time);
    this.background.update(time);
    this.ps.update(frequency, time);
  }
  public dispose = () => {
    this.ps.dispose();
    this.visualizer.dispose();
    this.background.dispose();
  }
}