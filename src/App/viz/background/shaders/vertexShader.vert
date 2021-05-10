varying vec3 vPos;
varying vec2 vUv;
// varying float vFrequency;
// attribute float aFrequency;

void main(){
  vUv = uv;
  vPos=position.xyz;
  // vFrequency=aFrequency;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(vPos,1.);
}