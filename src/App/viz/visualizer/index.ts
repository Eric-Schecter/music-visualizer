import { BufferGeometry, ShaderMaterial, Mesh, Scene, Float32BufferAttribute, BufferAttribute, Vector3, DynamicDrawUsage, Material } from "three";
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
  private handleIndex = () => {
    const indices = [];
    for (let j = 1; j <= this.radialSegments; j++) {
      for (let i = 1; i <= this.tubularSegments; i++) {
        const a = (this.tubularSegments + 1) * j + i - 1;
        const b = (this.tubularSegments + 1) * (j - 1) + i - 1;
        const c = (this.tubularSegments + 1) * (j - 1) + i;
        const d = (this.tubularSegments + 1) * j + i;
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }
    return indices;
  }
  private handleParas = () => {
    const tube = 1;
    const uvs = [];
    const vertices = [];
    const normals = [];

    const center = new Vector3();
    const vertex = new Vector3();
    const normal = new Vector3();

    for (let j = 0; j <= this.radialSegments; j++) {

      for (let i = 0; i <= this.tubularSegments; i++) {

        const u = i / this.tubularSegments * Math.PI * 2;
        const v = j / this.radialSegments * Math.PI * 2;

        vertex.x = (this.radius + tube * Math.cos(v)) * Math.cos(u);
        vertex.y = (this.radius + tube * Math.cos(v)) * Math.sin(u);
        vertex.z = tube * Math.sin(v);

        vertices.push(vertex.x, vertex.y, vertex.z);

        center.x = this.radius * Math.cos(u);
        center.y = this.radius * Math.sin(u);
        normal.subVectors(vertex, center).normalize();

        normals.push(normal.x, normal.y, normal.z);

        uvs.push(i / this.tubularSegments);
        uvs.push(j / this.radialSegments);
      }
    }
    return { vertices, normals, uvs };
  }
  private createGeo = () => {
    const geo = new BufferGeometry();
    const radians = new Array((this.radialSegments + 1) * (this.tubularSegments + 1))
      .fill(0)
      .map((d, i) => i % (this.tubularSegments + 1) / this.tubularSegments * Math.PI * 2)
    const { vertices, normals, uvs } = this.handleParas();
    const indices = this.handleIndex();
    geo.setIndex(indices);
    geo.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geo.setAttribute('normal', new Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
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
        uTime: { value: 0},
      },
    });
  }
  public update = (frequency: number[],time:number) => {
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