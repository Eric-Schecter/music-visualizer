import {
  InstancedBufferGeometry, ShaderMaterial, Mesh, InstancedBufferAttribute,
  UniformsUtils, WebGLRenderer, IUniform, BoxBufferGeometry, Scene, Clock
} from "three";
import { vertexShader, fragmentShader } from './shaders';
import { GPUHandler } from "./gpuHandler";
import { EmitHandler } from "./emitHandler";
export class ParticleSystem {
  private uniforms: { [uniform: string]: IUniform<any> } = {};
  private gpuHandler: GPUHandler;
  private emitHandler: EmitHandler;
  private clock = new Clock();
  constructor(renderer: WebGLRenderer, scene: Scene,radius:number) {
    const size = 128;
    const geo = this.setupGeometry(size);
    const mat = this.setupMaterial();
    const mesh = new Mesh(geo, mat);
    scene.add(mesh);
    this.gpuHandler = new GPUHandler(size, renderer, this.uniforms, this.clock);
    this.emitHandler = new EmitHandler(this.gpuHandler,radius);
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
}