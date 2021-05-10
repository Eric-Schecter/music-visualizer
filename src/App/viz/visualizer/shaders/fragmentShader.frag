varying vec3 vPos;
varying float vFrequency;
uniform float uTime;

#include <lighteffect.glsl>;

void main(){
  vec3 color =addLightEffect(vPos,vFrequency,uTime);
  gl_FragColor=vec4(color,.95);
}