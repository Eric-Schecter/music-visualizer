uniform sampler2D texturePosition;
uniform sampler2D textureParams;
in vec2 reference;
out vec4 vParams;
out vec3 vPos;

void main(){
  vec3 pos=position.xyz;
  vec4 p=texture(texturePosition,reference);
  vec4 params=texture(textureParams,reference);
  pos+=p.xyz;
  vParams=params;
  vPos=pos;
  gl_PointSize = 10.;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
}