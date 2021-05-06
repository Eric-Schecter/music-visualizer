import { GPUComputationRenderer, Variable } from "three/examples/jsm/misc/GPUComputationRenderer";
import { IUniform, WebGLRenderer, DataTexture, RepeatWrapping, RGBAFormat, Vector2 } from "three";
import { fragmentPos, fragmentVelocity } from "./shaders";

export class GPUHandler {
  private gpuCompute: GPUComputationRenderer;
  private positionVariable: Variable;
  private velocityVariable: Variable;
  private velocityUniforms: { [uniform: string]: IUniform<any> } = {};
  constructor(size: number, renderer: WebGLRenderer) {
    this.gpuCompute = new GPUComputationRenderer(size, size, renderer);
    const currPos = this.gpuCompute.createTexture();
    const currVelocity = this.initVelocity();
    this.positionVariable = this.gpuCompute.addVariable("texturePosition", fragmentPos, currPos);
    this.velocityVariable = this.gpuCompute.addVariable("textureVelocity", fragmentVelocity, currVelocity);
    this.setupGpgpu(size);
  }
  private initVelocity = () => {
    const velocity = this.gpuCompute.createTexture();
    const range = 1000;
    const length = velocity.image.data.length;
    const generate = () => Math.random() * range - range / 2;
    for (let i = 0; i < length; i += 4) {
      velocity.image.data.set(new Array(3).fill(0).map(() => generate()), i);
    }
    return velocity;
  }
  private setupGpgpu = (size: number) => {
    const initData = new Uint8Array(size * 4).fill(0);
    const initDataTexture = new DataTexture(initData, size, size, RGBAFormat);

    this.gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable]);
    this.positionVariable.wrapS = RepeatWrapping;
    this.positionVariable.wrapT = RepeatWrapping;

    this.gpuCompute.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable]);
    this.velocityUniforms = this.velocityVariable.material.uniforms;
    this.velocityUniforms.textureTargetPosition = { value: initDataTexture };
    this.velocityUniforms.uMouse = { value: new Vector2(-10000, -10000) };
    this.velocityVariable.wrapS = RepeatWrapping;
    this.velocityVariable.wrapT = RepeatWrapping;

    const error = this.gpuCompute.init();
    if (error !== null) {
      console.error(error);
    }
  }
  public update = (uniforms: { [uniform: string]: IUniform<any> }, mouse: Vector2) => {
    this.gpuCompute.compute();
    uniforms.texturePosition.value = (this.gpuCompute.getCurrentRenderTarget(this.positionVariable) as any).texture;
    uniforms.textureVelocity.value = (this.gpuCompute.getCurrentRenderTarget(this.velocityVariable) as any).texture;
    this.velocityUniforms.uMouse.value.set(mouse.x, -mouse.y);
  }
  public updateTargetPos = (data: DataTexture) => {
    this.velocityUniforms.textureTargetPosition.value = data;
  }
}
