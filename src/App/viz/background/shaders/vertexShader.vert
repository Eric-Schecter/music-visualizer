varying vec3 vPos;

void main(){
  vPos = position.xyz;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(vPos,1.);
}