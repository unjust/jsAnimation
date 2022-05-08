#ifdef GL_ES
precision mediump float;
#endif

uniform vec3     u_resolution;  // viewport resolution (in pixels)
uniform float    u_time;        // shader playback time (in seconds)

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

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  float speed = 10.;
  float dist_range = 0.1;
  float radius = 0.1;
  // float r = circle(st, vec2(0.5 + sin(u_time * speed) * dist_range), radius, (sin(u_time) + 1.1)/5.);
  // r += circle(st, vec2(0.5 + sin(u_time) * dist_range/4.), radius/2., (sin(u_time) + 1.1)/5.);
  
  // float r = circle(st, vec2(0.5), radius, 0.25);
  float r = gradient(st, vec2(0.5 + sin(u_time * speed) * dist_range), 0.001, (sin(u_time) + 1.1)/5.);
  r += gradient(st, vec2(0.5 + sin(u_time) * dist_range/4.), radius/2., (sin(u_time) + 1.1)/5.);
  gl_FragColor = vec4(r, 0., 0., 1.);
}
