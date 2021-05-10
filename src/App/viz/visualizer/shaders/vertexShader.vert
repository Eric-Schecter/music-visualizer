attribute float aRadian;
attribute float aFrequency;
uniform float radius;
uniform float uTime;

varying vec3 vPos;
varying float vFrequency;

vec3 addVolume(vec3 pos){
  vec3 offset=vec3(cos(aRadian),sin(aRadian),0.)*(radius - 1.);
  pos-=offset;
  float val=aFrequency/2.;
  float scale=max(length(vec2(val*cos(aRadian),val*sin(aRadian)))/3.,.1);
  pos*=scale;
  pos+=vec3(cos(aRadian),sin(aRadian),0.)*scale;
  pos+=offset;
  vFrequency = aFrequency;
  return pos;
}

void main(){
  vec3 pos=position.xyz;
  pos=addVolume(pos);
  vFrequency=min(10.,aFrequency);
  vPos=pos;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
}