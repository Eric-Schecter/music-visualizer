uniform float uTime;
varying vec3 vPos;

vec3 adjustByPos(){
  float offset=distance(vPos.xy,vec2(0.)) /1000.;
  return vec3(offset)*vec3(0.,.5,1.);
}

void main(){
  vec3 color=vec3(0.);
  color+=adjustByPos();
  gl_FragColor=vec4(color,.95);
}