import { GPUComputationRenderer, Variable } from "three/examples/jsm/misc/GPUComputationRenderer";
import { IUniform, WebGLRenderer, RepeatWrapping, Texture, DataTexture, RGBAFormat, Clock, FloatType } from "three";
import { fragmentPos, fragmentVelocity } from "./shaders";

export class GPUHandler {
  private gpuCompute: GPUComputationRenderer;
  private positionVariable: Variable;
  private velocityVariable: Variable;
  private index = 0;
  private dataTexture: DataTexture;
  private velocityUniforms: { [uniform: string]: IUniform<Texture> } = {};
  private positionUniforms: { [uniform: string]: IUniform<Texture | number> } = {};
  constructor(size: number, renderer: WebGLRenderer, private uniforms: { [uniform: string]: IUniform<Texture> },
    private clock: Clock) {
    this.gpuCompute = new GPUComputationRenderer(size, size, renderer);
    const currPos = this.gpuCompute.createTexture();
    const currVelocity = this.gpuCompute.createTexture();
    this.positionVariable = this.gpuCompute.addVariable("texturePosition", fragmentPos, currPos);
    this.velocityVariable = this.gpuCompute.addVariable("textureVelocity", fragmentVelocity, currVelocity);

    const initData = new Float32Array(size ** 2 * 4).fill(0);
    this.dataTexture = new DataTexture(initData, size, size, RGBAFormat, FloatType);

    this.setupGpgpu();
  }
  private setDependency = (dependencies: Variable[]) => {
    dependencies.forEach(dependency => {
      this.gpuCompute.setVariableDependencies(dependency, dependencies);
      dependency.wrapS = RepeatWrapping;
      dependency.wrapT = RepeatWrapping;
    })
  }
  private setupGpgpu = () => {
    this.setDependency([this.positionVariable, this.velocityVariable]);
    this.velocityUniforms = this.velocityVariable.material.uniforms;
    this.positionUniforms = this.positionVariable.material.uniforms;
    this.velocityUniforms.textureParams = { value: this.dataTexture };
    this.positionUniforms.textureParams = { value: this.dataTexture };
    this.positionUniforms.uTime = { value: 0 };
    const error = this.gpuCompute.init();
    if (error !== null) {
      console.error(error);
    }
  }
  public update = () => {
    this.gpuCompute.compute();
    this.uniforms.texturePosition.value = (this.gpuCompute.getCurrentRenderTarget(this.positionVariable) as any).texture;
    this.uniforms.textureVelocity.value = (this.gpuCompute.getCurrentRenderTarget(this.velocityVariable) as any).texture;
    this.positionUniforms.uTime.value = this.clock.elapsedTime;
  }
  public emit = (particles: { x: number, y: number, force: number }[]) => {
    const texture = this.dataTexture.clone();
    particles.forEach(({ x, y, force }) => {
      this.dataTexture.image.data.set([x, y, force, this.clock.elapsedTime], this.index);
      this.index += 4;
      if (this.index > texture.image.data.length - 1) {
        this.index = 0;
      }
    })
    this.uniforms.textureParams.value = texture;
    this.velocityUniforms.textureParams.value = texture;
    this.positionUniforms.textureParams.value = texture;
  }
}
