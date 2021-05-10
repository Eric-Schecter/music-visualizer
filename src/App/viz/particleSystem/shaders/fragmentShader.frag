uniform float uTime;
varying vec4 vParams;
varying vec3 vPos;
varying float vFrequency;

#include <lighteffect.glsl>;

void main(){
	float life=max(0.,(vParams.z-(uTime-vParams.w))/vParams.z);
	life=vParams.w==0.?0.:life;
  vec3 color =addLightEffect(vPos,vFrequency,uTime)+0.5;
	gl_FragColor=vec4(color,life);
}