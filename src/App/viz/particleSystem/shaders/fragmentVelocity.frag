uniform sampler2D textureTargetPosition;
uniform vec2 uMouse;

const float size=128.;

vec4 abstraction(vec4 p,vec2 uv){
  vec4 targetPos=texture2D(textureTargetPosition,uv);
  float dis=distance(p,targetPos);
  return normalize(targetPos-p)*dis/20.;
}

vec4 friction(vec4 v){
  return-v*.5;
}

vec4 mouseForce(vec4 p){
  vec3 pMouse=vec3(uMouse.x*resolution.x,0.,uMouse.y*resolution.y/2.);
  float dis2mouse=length(p.xyz-pMouse);
  return dis2mouse<5.?vec4(normalize(p.xyz-pMouse),0.)*10./(dis2mouse*2.):vec4(0.);
}

void main(){
  vec2 uv=gl_FragCoord.xy/resolution.xy;
  vec4 p=texture2D(texturePosition,uv);
  vec4 v=texture2D(textureVelocity,uv);
  v+=abstraction(p,uv);
  v+=friction(v);
  // v-=mouseForce(p);
  gl_FragColor=vec4(v.xyz,1.);
}