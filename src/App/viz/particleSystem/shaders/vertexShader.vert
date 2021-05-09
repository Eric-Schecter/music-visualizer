uniform sampler2D texturePosition;
uniform sampler2D textureParams;
attribute vec2 reference;
varying vec4 vParams;

void main(){
  vec3 pos=position.xyz;
  vec4 p=texture2D(texturePosition,reference);
  vec4 params=texture2D(textureParams,reference);
  pos+=p.xyz;
  vParams=params;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
}