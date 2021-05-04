import { WebGLRenderer } from "three";

export class Renderer {
  private _instance: WebGLRenderer;
  constructor(canvas: HTMLCanvasElement) {
    this._instance = new WebGLRenderer({canvas, antialias: true });
  }
  public get instance() {
    return this._instance;
  }
}