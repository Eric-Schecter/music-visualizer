uniform sampler2D textureParams;
uniform float uTime;

void main(){
  vec2 uv=gl_FragCoord.xy/resolution.xy;
  vec4 params=texture2D(textureParams,uv);
  if(params.w!=0.&&uTime==params.w){
    discard;
  }
  vec4 p=texture2D(texturePosition,uv);
  vec4 v=texture2D(textureVelocity,uv);
  p.xy=params.xy;
  p+=v;
  
  gl_FragColor=vec4(p.xyz,1.);
}