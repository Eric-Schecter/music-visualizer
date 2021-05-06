uniform sampler2D texturePosition;
attribute vec2 reference;

void main() {
  vec3 pos = position.xyz;
	vec4 p = texture2D( texturePosition, reference );	
	pos += p.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}