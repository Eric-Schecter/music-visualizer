import { PerspectiveCamera } from "three";

export class MyCamera {
  private _instance: PerspectiveCamera;
  constructor() {
    const { innerWidth: width, innerHeight: height } = window;
    this._instance = new PerspectiveCamera(30, width / height, 0.1, 1000);
    this._instance.position.set(0, 0, 200);
    this._instance.lookAt(0, 0, 0);
  }
  public get instance() {
    return this._instance;
  }
}