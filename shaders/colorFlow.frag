#ifdef GL_ES
precision mediump float;
#endif
//https://www.shadertoy.com/view/tdcXRr

// const float PI = 3.14159;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  // vec2 p = gl_FragCoord.xy/u_resolution.xy;
  vec2 p = (3.0* gl_FragCoord.xy-u_resolution.xy)/max(u_resolution.x,u_resolution.y);
  float time = u_time/2.0;
  for (int i = 1; i < 10; i++) {
    vec2 new_p = p;
    float fi = float(i);
    new_p.x += (0.5/(1.8*fi))*cos(fi*p.y+time*11.0/37.0+0.03*fi)+1.3;		
    new_p.y += (0.5/(1.8*fi))*cos(fi*p.x+time*17.0/41.0+0.03*(fi+10.0))+1.9;
    p = new_p;
  }
  // vec3 col = vec3(1.5*fract(1.5*p.x)-0.5,sin(time)*1.3,cos(time)*0.5);
 	vec3 col=vec3(1.5*fract(1.5*p.x)*sin(time)+1.0-0.5,1.5*fract(1.0)*cos(time)+0.9-0.5,1.5*fract(0.6*p.x)*cos(time)+1.0-0.5);
	
  gl_FragColor = vec4(col, 1.0);
}
