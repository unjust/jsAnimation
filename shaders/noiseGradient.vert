#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;

// varying vec2 v_texcoord;

void main() {
  // copy the texture coordinates
  // vTexCoord = aTexCoord;
  // v_texcoord = aTexCoord;

  // Copy the position data into a vec4, adding 1.0 as the w parameter
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
