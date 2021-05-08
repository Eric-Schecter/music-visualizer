uniform float uTime;
varying vec2 vParams;

void main(){
	float life=max(0.,vParams.x-(uTime-vParams.y))/vParams.x;
	if(vParams.y==0.||life<=0.){
		discard;
	}
	gl_FragColor=vec4(vec3(1.),life);
}