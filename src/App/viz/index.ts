import { Scene, WebGLRenderer, PerspectiveCamera, Vector2, Clock } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { resizeRendererToDisplaySize } from './resize';
import { AudioProcessor } from '../audio';
import { Visualizer } from './visualizer';
import { MyCamera } from './camera';
import { ParticleSystem } from './particleSystem';
import { Renderer } from './renderer';
import { MyScene } from './scene';
import { Background } from './background';

export class Viz {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private visualizer: Visualizer;
  private ps: ParticleSystem;
  private composer: EffectComposer;
  private background: Background;
  private clock = new Clock();
  private _data = { currentTime: 0, duration: 0 };

  constructor(canvas: HTMLCanvasElement, private audio: AudioProcessor) {
    this.renderer = new Renderer(canvas).instance;
    this.scene = new MyScene().instance;
    this.camera = new MyCamera().instance;
    this.composer = this.initComposer();
    const radius = 30;
    this.ps = new ParticleSystem(this.scene, radius);
    this.visualizer = new Visualizer(this.scene, radius);
    this.background = new Background(this.scene);
    this.update();
  }
  private initComposer = () => {
    const renderScene = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0;
    const composer = new EffectComposer(this.renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    return composer;
  }
  private update = () => {
    const time = this.clock.getElapsedTime();
    this.composer.render();
    const { frequency, currentTime = 0, duration = 0 } = this.audio.getData();
    Object.assign(this._data, { currentTime, duration });
    this.visualizer.update(frequency, time);
    this.background.update(time);
    this.ps.update(frequency);
    resizeRendererToDisplaySize(this.renderer, this.camera, this.composer);
    requestAnimationFrame(this.update);
  }
  public unregister = () => {
    this.renderer.dispose();
    this.ps.dispose();
    this.visualizer.dispose();
    this.background.dispose();
  }
  // public click = () =>{
  //   return this.audio.start();
  // }
  public get data() {
    return this._data;
  }
}