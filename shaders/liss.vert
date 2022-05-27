#ifdef GL_ES
precision mediump float;
#endif

// https://itp-xstory.github.io/p5js-shaders/#/./docs/examples/basic_gradient?id=shadervert-file
attribute vec3 aPosition;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}

