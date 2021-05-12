import {
  ShaderMaterial, UniformsUtils, WebGLRenderer, IUniform, Scene, Clock, BufferAttribute,
  Points, BufferGeometry,
} from "three";
import { vertexShader, fragmentShader } from './shaders';
import { GPUHandler } from "./gpuHandler";
import { EmitHandler } from "./emitHandler";
export class ParticleSystem {
  private uniforms: { [uniform: string]: IUniform<any> } = {};
  private gpuHandler: GPUHandler;
  private emitHandler: EmitHandler;
  private geo: BufferGeometry;
  private mat: ShaderMaterial;
  private size = 128;
  private _instance: Points;
  constructor(renderer: WebGLRenderer, scene: Scene, radius: number, private clock: Clock) {
    this.geo = this.setupGeometry(this.size);
    this.mat = this.setupMaterial();
    this._instance = new Points(this.geo, this.mat);
    scene.add(this._instance);
    this.gpuHandler = new GPUHandler(this.size, renderer, this.uniforms, this.clock);
    this.emitHandler = new EmitHandler(this.gpuHandler, radius);
  }
  private setReference = (cnt: number, size: number) => {
    const references = new BufferAttribute(new Float32Array(cnt * 2), 2);
    for (let i = 0; i < cnt; i++) {
      const x = (i % size) / size;
      const y = ~~(i / size) / size;
      references.setXY(i, x, y);
    }
    return references;
  }
  private setupGeometry = (size: number) => {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(size ** 2 * 3), 3));
    geo.setAttribute('reference', this.setReference(size ** 2, size));
    return geo;
  }
  private setupMaterial = () => {
    this.uniforms = UniformsUtils.merge([
      { textureParams: { value: null } },
      { texturePosition: { value: null } },
      { textureVelocity: { value: null } },
      { uTime: { value: 0 } },
    ]);
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
    });
  }
  public update = (frequency: number[], time: number) => {
    this.uniforms.uTime.value = time;
    this.gpuHandler.update();
    this.emitHandler.update(frequency);
  }
  public dispose = () => {
    this.geo.dispose();
    this.mat.dispose();
  }
}