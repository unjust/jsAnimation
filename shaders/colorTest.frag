#ifdef GL_ES
precision mediump float;
#endif


// this is the same variable we declared in the vertex shader
// we need to declare it here too!
uniform vec2 u_resolution;

void main() {
  vec2 coord = gl_FragCoord.xy/u_resolution.xy;
  
  // x values for red, y values for green, both for blue
  gl_FragColor = vec4(coord.x, 0., 0., 1.0 );
}
