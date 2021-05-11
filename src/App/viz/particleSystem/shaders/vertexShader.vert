uniform sampler2D texturePosition;
uniform sampler2D textureParams;
in vec2 reference;
in float aFrequency;
out vec4 vParams;
out vec3 vPos;
out float vFrequency;

void main(){
  vec3 pos=position.xyz;
  vec4 p=texture(texturePosition,reference);
  vec4 params=texture(textureParams,reference);
  pos+=p.xyz;
  vParams=params;
  vPos=pos;
  vFrequency=aFrequency;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
}