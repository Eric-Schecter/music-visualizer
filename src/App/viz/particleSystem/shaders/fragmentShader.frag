uniform float uTime;
varying vec4 vParams;

void main(){
	float life=max(0.,(vParams.z-(uTime-vParams.w))/vParams.z);
	life=vParams.w==0.?0.:life;
	vec3 color=vec3(1.);
	gl_FragColor=vec4(color,life);
}