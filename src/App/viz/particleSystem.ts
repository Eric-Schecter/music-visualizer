import { Scene, Vector3, TextureLoader, BufferGeometry, Points, PointsMaterial, Float32BufferAttribute, AdditiveBlending, Material } from "three";

class Particle {
  public static texture = new TextureLoader().load('textures/snowflake2.png');
  private life = Math.random() * 250 + 250;
  private _instance: Points;
  private p = new Vector3();
  private v = new Vector3();
  private a = new Vector3();
  private resistance = 0.05;
  private gravity = 0.005;
  constructor(radian: number, force: number, radius: number) {
    const vertices = [
      Math.cos(radian) * radius / 2,
      Math.sin(radian) * radius / 2,
      0
    ]
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    const mat = new PointsMaterial({
      // map: Particle.texture,
      size: 1,
      transparent: true,
      blending: AdditiveBlending,
    });
    this._instance = new Points(geo, mat);
    this.initParams(vertices, radian, radius, force);
  }
  private initParams = (vertices: number[], radian: number, radius: number, force: number) => {
    this.p.set(vertices[0], vertices[1], vertices[2]);
    this.a.set(Math.cos(radian) * radius, Math.sin(radian) * radius, this.gravity)
      .multiplyScalar(0.001 * force)
  }
  public update = () => {
    this.v.add(this.a);
    if (this.v.length() > 1) {
      this.v.z *= (1 - this.resistance);
    }
    this.p.add(this.v);
    this._instance.position.copy(this.p);
    (this._instance.material as Material).opacity = this.life / 500;
    this.life--;
    this.a.set(0, 0, this.gravity);
  }
  public dispose = () => {
    this._instance.geometry.dispose();
    (this._instance.material as Material).dispose();
  }
  public get isDead() {
    return this.life <= 0;
  }
  public get instance() {
    return this._instance;
  }
}

export class ParticleSystem {
  private observers = new Set<Particle>();
  private preData: number[] = [];
  constructor(private scene: Scene, private radius: number) { }
  public add = (radian: number, force: number) => {
    const particle = new Particle(radian + Math.PI / 2, force, this.radius);
    this.observers.add(particle);
    this.scene.add(particle.instance);
  }
  private remove = (observer: Particle) => {
    this.observers.delete(observer);
    this.scene.remove(observer.instance)
  }
  private generateParticle = (data: number[]) => {
    const limit = 3;
    for (let i = 0; i < data.length; i += 5) {
      if (data[i] > this.preData[i] + limit) {
        const radian = i / 180 * Math.PI + (Math.random() - 0.5) * 90 * Math.PI;
        const force = (data[i] - this.preData[i]);
        this.add(radian, force);
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
  public update = (data: number[]) => {
    this.checkData(data);
    this.observers.forEach(observer => {
      observer.update();
      if (observer.isDead) {
        this.remove(observer);
      }
    });
  }
  public dispose = () => {
    Particle.texture.dispose();
    this.observers.forEach(observer => observer.dispose());
  }
}