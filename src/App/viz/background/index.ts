import { ShaderMaterial, Mesh, Scene, Material, PlaneGeometry } from "three";
import { vertexShader, fragmentShader } from './shaders';

export class Background {
  private _instance: Mesh;
  constructor(scene: Scene) {
    const geo = new PlaneGeometry(3000, 3000);
    const mat = this.createMat();
    this._instance = new Mesh(geo, mat);
    this._instance.position.setZ(-10);
    scene.add(this._instance);
  }
  private createMat = () => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
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