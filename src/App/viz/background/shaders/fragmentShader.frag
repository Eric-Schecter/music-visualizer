uniform float uTime;
varying vec3 vPos;
varying float vFrequency;
varying vec2 vUv;

void main(){
  vec3 color=smoothstep(vec3(0.0),vec3(1.),vec3(length((vUv+vec2(0.5,0.2)).y))/5.);
  gl_FragColor=vec4(color,.95);
}