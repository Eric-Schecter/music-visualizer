import { ShaderMaterial, Mesh, Scene, Float32BufferAttribute, BufferAttribute, Material, TorusGeometry } from "three";
import { vertexShader, fragmentShader } from './shaders';

export class Visualizer {
  private _instance: Mesh;
  constructor(scene: Scene, private radius: number, private frequencies: BufferAttribute,
    private radialSegments: number, private tubularSegments: number) {
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
  public update = (time: number) => {
    (this._instance.material as any).uniforms.uTime.value = time;
  }
  public dispose = () => {
    this._instance.geometry.dispose();
    (this._instance.material as Material).dispose();
  }
}