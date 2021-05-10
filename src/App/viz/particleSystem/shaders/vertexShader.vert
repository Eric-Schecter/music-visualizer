uniform sampler2D texturePosition;
uniform sampler2D textureParams;
attribute vec2 reference;
varying vec4 vParams;
varying vec3 vPos;
varying float vFrequency;
attribute float aFrequency;

void main(){
  vec3 pos=position.xyz;
  vec4 p=texture2D(texturePosition,reference);
  vec4 params=texture2D(textureParams,reference);
  pos+=p.xyz;
  vParams=params;
  vPos=pos;
  vFrequency=aFrequency;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
}