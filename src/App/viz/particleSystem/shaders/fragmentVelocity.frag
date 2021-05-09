uniform sampler2D textureParams;
uniform float uTime;

vec4 friction(vec4 v){
  return-v*.5;
}

vec3 force(vec2 uv,vec4 params){
  vec2 initPos=params.xy;
  vec2 originPos=vec2(0.);
  vec2 direction=normalize(initPos-originPos);
  return vec3(direction*params.z*0.01,.5);
}

void main(){
  vec2 uv=gl_FragCoord.xy/resolution.xy;
  vec4 params=texture2D(textureParams,uv);
  vec4 v=texture2D(textureVelocity,uv);
  bool alive=params.w!=0. && uTime-params.w < params.z;
  if(alive){
    v.xyz+=force(uv,params);
    v+=friction(v);
  }else{
    v.xyz=vec3(0.);
  }
  
  gl_FragColor=vec4(v.xyz,1.);
}