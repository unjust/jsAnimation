#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  u_resolution;  // viewport resolution (in pixels)
uniform float u_time;        // shader playback time (in seconds)

float random (in float x) {
    return fract(sin(x)*43758.5453123);
}

float segment(vec2 p, vec2 a, vec2 b)
{
	vec2 ap = p - a;
	vec2 ab = b - a;
  float u = dot(ap, ab); // |ap|.|ab|.cos<pab>
  float v = dot(ab, ab); // |ab|^2
  float z = u / v;
	float h = clamp(z, 0., 1.);
	return smoothstep(.9, .7, 100.*length(ap - ab*h));
}

float count = 30.0;

void main()
{
	vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y); // why min?

  vec2 p0 = vec2(0);
  float r = 0.0;
  float g = 0.0;
	float b = smoothstep(1.0, 0.9, length(st-p0)*25.);

  for (float i = 0.0; i < count; i += 1.0 ) {
    float s1 = sin(u_time*(1.0+i)/4.0);
    float c1 = cos(u_time*(1.0+i)/4.0);
    mat2 r1 = mat2(+c1, -s1, +s1, +c1);
    vec2 p1 = r1 * vec2(0., (count-i)/(count+1.0));
  
    r += segment(st, p0, p1);
    float t = smoothstep(1.0, 0.9, length(st-p1)*25.);
    g += t;
    b += mix(0.3, 1.0, i / count) * t;
  }
    
	gl_FragColor = vec4(r, g, b, 1.);
  //gl_FragColor = vec4(sin(u_time), 0., 0, 1.);
}
