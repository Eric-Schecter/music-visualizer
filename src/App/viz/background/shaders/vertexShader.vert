varying vec3 vPos;
varying float vFrequency;
attribute float aFrequency;
varying vec2 vUv;

void main(){
  vUv = uv;
  vPos=position.xyz;
  vFrequency=aFrequency;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(vPos,1.);
}