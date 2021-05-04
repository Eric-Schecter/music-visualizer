import { Renderer, PerspectiveCamera } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

export const resizeRendererToDisplaySize = (renderer: Renderer, camera: PerspectiveCamera,composer:EffectComposer) => {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const { width, clientWidth, height, clientHeight } = canvas;
  const cWidth = clientWidth * pixelRatio | 0;
  const cHeight = clientHeight * pixelRatio | 0;
  const needResize = cWidth !== width || cHeight !== height;
  if (needResize) {
    renderer.setSize(cWidth, cHeight, false);
    composer.setSize(cWidth,cHeight);
    camera.aspect = cWidth / cHeight;
    camera.updateProjectionMatrix();
  }
}
