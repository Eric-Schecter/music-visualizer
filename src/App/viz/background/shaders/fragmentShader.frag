uniform float uTime;
in vec3 vPos;

#include <lighteffect.glsl>;

void main(){
  vec3 light = addLightEffect(vPos,0.,uTime/10.)/50.;
  vec3 color = vec3(length(vPos))/20.;
  color*=light;
  gl_FragColor=vec4(color,.95);
}