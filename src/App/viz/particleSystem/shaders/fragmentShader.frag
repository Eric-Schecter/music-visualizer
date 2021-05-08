uniform float uTime;
varying vec2 vParams;

void main(){
	if(vParams.y==0.||uTime-vParams.y>vParams.x * 10.){
		discard;
	}
	float life=max(0.,vParams.x-(uTime-vParams.y))/vParams.x;
	gl_FragColor=vec4(vec3(1.),life);
}