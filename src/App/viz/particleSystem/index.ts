import {
  InstancedBufferGeometry, ShaderMaterial, Mesh, InstancedBufferAttribute,
  UniformsUtils, WebGLRenderer, IUniform, BoxBufferGeometry, Scene, Clock
} from "three";
import { vertexShader, fragmentShader } from './shaders';
import { GPUHandler } from "./gpuHandler";

class EmitHandler {
  private preData: number[] = [];
  private radius = 30;
  constructor(private gpuHandler: GPUHandler) { }
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

export class ParticleSystem {
  private _instance: Mesh;
  private uniforms: { [uniform: string]: IUniform<any> } = {};
  private gpuHandler: GPUHandler;
  private emitHandler: EmitHandler;
  private clock = new Clock();
  constructor(renderer: WebGLRenderer, scene: Scene) {
    const size = 128;
    const geo = this.setupGeometry(size);
    const mat = this.setupMaterial();
    this._instance = new Mesh(geo, mat);
    scene.add(this._instance);
    this.gpuHandler = new GPUHandler(size, renderer, this.uniforms, this.clock);
    this.emitHandler = new EmitHandler(this.gpuHandler);
  }
  private setReference = (cnt: number, size: number) => {
    const references = new InstancedBufferAttribute(new Float32Array(cnt * 2), 2);
    for (let i = 0; i < cnt; i++) {
      const x = (i % size) / size;
      const y = ~~(i / size) / size;
      references.setXY(i, x, y);
    }
    return references;
  }
  private setupGeometry = (size: number) => {
    const length = 0.3;
    const originGeo = new BoxBufferGeometry(length, length, length);
    const geo = new InstancedBufferGeometry();
    const pos = originGeo.attributes.position.clone();
    const normal = originGeo.attributes.normal.clone();
    const uv = originGeo.attributes.uv.clone();
    const indices = originGeo.index?.clone();
    geo.setAttribute('position', pos);
    geo.setAttribute('normal', normal);
    geo.setAttribute('uv', uv);
    geo.setIndex(indices === undefined ? [] : indices);
    geo.setAttribute('reference', this.setReference(size ** 2, size));
    return geo;
  }
  private setupMaterial = () => {
    this.uniforms = UniformsUtils.merge([
      { textureParams: { value: null } },
      { texturePosition: { value: null } },
      { textureVelocity: { value: null } },
      { uTime: { value: 0 }, }
    ]);
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
    });
  }
  public update = (frequency: number[]) => {
    this.gpuHandler.update();
    this.emitHandler.update(frequency);
    this.uniforms.uTime.value = this.clock.getElapsedTime();
  }
  public get instance() {
    return this._instance;
  }
}