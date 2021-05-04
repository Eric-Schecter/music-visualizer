import { Scene, Color } from "three";

export class MyScene {
  private _instance: Scene;
  constructor() {
    this._instance = new Scene();
    this._instance.background = new Color('black');
  }
  public get instance() {
    return this._instance;
  }
}