import {
  InstancedBufferGeometry, ShaderMaterial, Mesh, InstancedBufferAttribute,
  UniformsUtils, WebGLRenderer, IUniform, BoxBufferGeometry, Vector2, Scene
} from "three";
import { vertexShader, fragmentShader } from './shaders';
import { GPUHandler } from "./gpuHandler";

export class ParticleSystem {
  private _instance: Mesh;
  private uniforms: { [uniform: string]: IUniform<any> } = {};
  private gpuHandler: GPUHandler;
  constructor(renderer: WebGLRenderer,scene:Scene) {
    const size =128;
    this.gpuHandler = new GPUHandler(size, renderer);
    const geo = this.setupGeometry(size);
    const mat = this.setupMaterial();
    this._instance = new Mesh(geo, mat);
    scene.add(this._instance)
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
    const length = 20;
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
      { texturePosition: { value: null } },
      { textureVelocity: { value: null } },
    ]);
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
    });
  }
  public update = (mouse: Vector2) => {
    this.gpuHandler.update(this.uniforms, mouse);
  }
  public get instance() {
    return this._instance;
  }
}