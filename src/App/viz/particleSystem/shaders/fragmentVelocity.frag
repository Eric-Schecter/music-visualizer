uniform sampler2D textureParams;

vec4 friction(vec4 v){
  return-v*.05;
}

vec3 force(vec2 uv,vec4 params){
  vec2 initPos=params.xy;
  vec2 originPos=vec2(0.);
  vec2 direction=normalize(initPos-originPos);
  return vec3(direction*params.z*.05,.03);
}

void main(){
  vec2 uv=gl_FragCoord.xy/resolution.xy;
  vec4 params=texture2D(textureParams,uv);
  vec4 p=texture2D(texturePosition,uv);
  vec4 v=texture2D(textureVelocity,uv);
  
  if(params.w!=0.){
    v.xyz+=force(uv,params);
  }
  v+=friction(v);
  gl_FragColor=vec4(v.xyz,1.);
}