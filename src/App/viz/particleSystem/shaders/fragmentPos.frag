void main()	{
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 p = texture2D( texturePosition, uv );
  vec4 v = texture2D( textureVelocity, uv );
  p+=v;

  gl_FragColor = vec4( p.xyz , 1. );
}