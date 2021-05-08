uniform float uTime;
varying vec2 vParams;

void main(){
	float life=(vParams.x-(uTime-vParams.y))/vParams.x;
	if(vParams.y==0.||life<=0.){
		discard;
	}
	vec3 color = vec3(1.);
	gl_FragColor=vec4(color,life);
}