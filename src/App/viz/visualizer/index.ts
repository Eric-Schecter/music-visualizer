import { ShaderMaterial, Mesh, Scene, Float32BufferAttribute, BufferAttribute, DynamicDrawUsage, Material, TorusGeometry } from "three";
import { vertexShader, fragmentShader } from './shaders';

export class Visualizer {
  private radialSegments = 2;
  private tubularSegments = 360;
  private frequencies: BufferAttribute;
  private _instance: Mesh;
  constructor(scene: Scene, private radius: number) {
    this.frequencies = new BufferAttribute(new Float32Array((this.radialSegments + 1) * (this.tubularSegments + 1)), 1);
    const geo = this.createGeo();
    const mat = this.createMat();
    this._instance = new Mesh(geo, mat);
    this._instance.rotateZ(Math.PI / 2);
    scene.add(this._instance);
  }
  private createGeo = () => {
    const radians = new Array((this.radialSegments + 1) * (this.tubularSegments + 1))
      .fill(0)
      .map((d, i) => i % (this.tubularSegments + 1) / this.tubularSegments * Math.PI * 2)
    const geo = new TorusGeometry(this.radius, 1, this.radialSegments, this.tubularSegments);
    geo.setAttribute('aFrequency', this.frequencies);
    geo.setAttribute('aRadian', new Float32BufferAttribute(radians, 1));
    this.frequencies.setUsage(DynamicDrawUsage);
    return geo;
  }
  private createMat = () => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        radius: { value: this.radius },
        uTime: { value: 0 },
      },
    });
  }
  public update = (frequency: number[], time: number) => {
    (this._instance.material as any).uniforms.uTime.value = time;
    this.frequencies.needsUpdate = true;
    for (let i = 0; i < this.frequencies.count; i++) {
      (this.frequencies.array[i] as any) = frequency[i % (this.tubularSegments + 1)] || 0;
    }
  }
  public dispose = () => {
    this._instance.geometry.dispose();
    (this._instance.material as Material).dispose();
  }
}