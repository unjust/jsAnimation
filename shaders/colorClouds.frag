#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  u_resolution;  // viewport resolution (in pixels)
uniform float u_time;        // shader playback time (in seconds)
uniform vec2  u_originA;
uniform vec2  u_originB;
uniform vec3  u_vector1;
uniform vec3  u_vector2;

// not sure where this came from
float noise1d(float value) {
  return cos(value + cos(value * 90.) * 100.) * 0.5 + 0.5;
}

float circle(vec2 st, vec2 origin, float r, float blur) {
  float pct = 0.0;
  vec2 center = vec2(0.5);

  if (blur > 0.) {
    pct = smoothstep(r + blur, r, distance(st, origin));
  } else {
    pct = step(distance(st, origin), r);
  }
  return pct;
}

float gradient(vec2 st, vec2 origin, float r, float blur) {
  float pct = 0.0;
  vec2 center = vec2(0.5);
  pct = mix(r + blur, r, distance(st, origin));
  return pct;
}

// https://thebookofshaders.com/10/
float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;

  float c1 = gradient(st, u_originA, 0.001, sin(u_time)/5.);
  // c1 += gradient(st, vec2(u_origin), radius/2., sin(u_time)/5.);
  
  float c2 = gradient(st, u_originB, 0.001, sin(u_time)/5.);
  // c2 += gradient(st, vec2(u_origin_2), radius/2., sin(u_time)/5.);
  
  gl_FragColor = vec4((c1 * u_vector1) + (c2 * u_vector2), 1.);
  
  // debug
  // gl_FragColor = vec4(st.x, 0., 0., 1.);
  
}
