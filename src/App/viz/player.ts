import { Visualizer } from "./visualizer";
import { Background } from "./background";
import { ParticleSystem } from "./particleSystem";
import { Scene, WebGLRenderer, Clock } from "three";

export class Player {
  private radius = 30;
  private visualizer: Visualizer;
  private ps: ParticleSystem;
  private background: Background;
  constructor(renderer: WebGLRenderer, scene: Scene, clock: Clock) {
    this.ps = new ParticleSystem(renderer, scene, this.radius, clock);
    this.visualizer = new Visualizer(scene, this.radius);
    this.background = new Background(scene);
  }
  public update = (frequency: number[], time: number) => {
    this.visualizer.update(frequency,time);
    this.background.update(time);
    this.ps.update(frequency, time);
  }
  public dispose = () => {
    this.ps.dispose();
    this.visualizer.dispose();
    this.background.dispose();
  }
}