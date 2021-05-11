uniform sampler2D textureParams;
uniform float uTime;

void main(){
  vec2 uv=gl_FragCoord.xy/resolution.xy;
  vec4 params=texture(textureParams,uv);
  vec4 p=texture(texturePosition,uv);
  vec4 v=texture(textureVelocity,uv);
  if(params.w!=0.&&uTime==params.w){
    p.xy=params.xy;
  }
  bool alive=params.w!=0. && uTime-params.w < params.z;
  if(!alive){
    p.xyz = vec3(0.);
  }
  p+=v;
  gl_FragColor=vec4(p.xyz,1.);
}