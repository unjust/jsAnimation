#ifdef GL_ES
precision mediump float;
#endif

// varying vec2 v_texcoord;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_value;
uniform vec3 u_colorVector;

float hash( float n ) {
  return fract(sin(n)*43758.5453);
}

// noise (or sometimes perlin noise or fractional brownian motion [fbm] ) is a way of making a smooth continuous random number
// there are many glsl noise functions to be found on the internet
// most of them contain a great deal of complex math. 
// the general idea is that you create a lot of random numbers and average them together
// it's not necessary to understand how they all work, as long as you can put them to use!
// one thing to keep in mind, noise functions can be slow. Be sure to pay attention to the performance of your shader!
// there's a nice collection of glsl noise functions here: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

// The noise function returns a value in the range -1.0f -> 1.0f
float noise( vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;

    return mix(mix(mix( hash(n+0.0), hash(n+1.0),f.x),
                    mix( hash(n+57.0), hash(n+58.0),f.x),f.y),
                mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                    mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z)-.5;
}

void main() {
  float speed = 40.0;
  vec3 t = (u_time/speed * vec3(1.0,2.0,3.0)/1.0) / 10.0; //+iMouse.xyz/1000.0;
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  uv = uv/4.0+.5;
  // uv -= u_mouse.xy/u_resolution.xy/4.0;
  vec3 col = vec3(0.0);

  // for (int i = 0; i < 16; i++) {
  //   float fi = 1.0;
  //   col.r = u_colorVector.r * (noise(uv.xyy*(12.0+fi)+col.rgb+t*sign(sin(fi/3.0))) + 2.0)/2.0; // noise returns -1. - 1.
  //   col.g = u_colorVector.g * (noise(uv.xyx*(12.0+fi)+col.rgb+t*sign(sin(fi/3.0))) + 2.0)/2.0;
  //   col.b = u_colorVector.b * (noise(uv.yyx*(12.0+fi)+col.rgb+t*sign(sin(fi/3.0))) + 2.0)/2.0;
  // // }
           
  for (int i = 0; i < 16; i++) {
    float i2 = float(i) * 1.0;
    col.r += u_colorVector.r * noise(uv.xyy*(32.0)+col.rgb+t*sign(sin(i2/3.0)));
    col.g += u_colorVector.g * noise(uv.xyx*(32.0)+col.rgb+t*sign(sin(i2/3.0)));
    col.b += u_colorVector.b * noise(uv.yyx*(32.0)+col.rgb+t*sign(sin(i2/3.0)));
  }
  
  float cc = noise(vec3(col));
  // col.rgb /= 32.0;
  // col.rgb = mix(col.rgb, normalize(col.rgb)*2.0, 1.0);
  // col.rgb += 0.3;
  gl_FragColor = vec4(cc, cc, cc, 1.0);
}
