#ifdef GL_ES
precision mediump float;
#endif

uniform vec3      iResolution;  // viewport resolution (in pixels)
uniform float     iTime;        // shader playback time (in seconds)

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

const float count = 30.0;

void main()
{
	// vec2 p0 = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y); // why min?

  vec2 uv = (1.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;

  vec2 p0 = vec2(0);
  float r = 0.0;
  float g = 0.0;
	float b = smoothstep(1.0, 0.9, length(uv-p0)*25.);

  for (float i = 0.0; i < count; i++) {
    float s1 = sin(iTime*(1.0+i)/4.0);
    float c1 = cos(iTime*(1.0+i)/4.0);
    mat2 r1 = mat2(+c1, -s1, +s1, +c1);
    vec2 p1 = r1 * vec2(0., (count-i)/(count+1.0));
  
    r += segment(uv, p0, p1);
    float t = smoothstep(1.0, 0.9, length(uv-p1)*25.);
    g += t;
    b += mix(0.3, 1.0, i / count) * t;
  }
    
	gl_FragColor = vec4(r, g, b, 1.);
}
