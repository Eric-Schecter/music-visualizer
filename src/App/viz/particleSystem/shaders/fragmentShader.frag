uniform float uTime;
in vec4 vParams;
in vec3 vPos;

#include <lighteffect.glsl>;

void main(){
	float distance=length(2.*gl_PointCoord-1.);
	if(distance>1.||length(vPos)==0.){
		discard;
	}
	float life=max(0.,(vParams.z-(uTime-vParams.w))/vParams.z);
	life=vParams.w==0.?0.:life;
	vec3 color=addLightEffect(vPos,0.,uTime)+.4;
	gl_FragColor=vec4(color,life);
}