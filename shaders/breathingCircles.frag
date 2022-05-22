#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// https://www.shadertoy.com/view/tddfWS

void main() {
  vec2 circlePos1 = vec2(0.3,0.5);
  vec2 circlePos2 = vec2(0.5,0.5);
  vec2 circlePos3 = vec2(0.6,0.3);
  float radius1 = 0.15;
  float radius2 = 0.15;
  float radius3 = 0.05;
  vec4 foreground1 = vec4(0., 0., 1.0,1.0);
  vec4 foreground2 = vec4(0.129, 0.588, 0.952,1.0);
  vec4 foreground3 = vec4(0.090, 0.411, 0.6,1.0);
  vec4 bg = vec4(0.,0.,0.2, 1.0);

  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspectRatio = u_resolution.y / u_resolution.x;
  uv.y = uv.y * aspectRatio;

  circlePos1.y = circlePos1.y * aspectRatio;
  circlePos2.y = circlePos2.y * aspectRatio;
  circlePos3.y = circlePos3.y * aspectRatio;

  // ändrar radien över tid för circle 1+2+3
  radius1 -= sin(u_time) * 0.02;
  radius2 += sin(u_time) * 0.05;
  radius3 += sin(u_time - 1.) * 0.025;
    
  // changes the colors of circle 1 + 2-3
  foreground1 -= foreground2.g * sin(u_time);
  foreground2 += foreground1.b * sin(u_time);
  foreground3.r += sin(u_time - 1.) - foreground1.r;
  foreground1 *= uv.y;
  foreground2 *= uv.y;
  foreground3 *= uv.y * 2.;

  // change the position over time for circle 1 + 2 + 3
  circlePos1 += sin(u_time/2.) * 0.1; 
  circlePos2 -= sin(u_time*0.5) * 0.1;
  circlePos3 -= sin(u_time*5.) * 0.02;

  // colors will be mixed between foreground and background depending on the circles position from the uv
  vec4 fragColor = mix(foreground2, bg, smoothstep(radius2 - 2e-3, radius2, length(circlePos2 - uv)));
  fragColor = mix( foreground1, fragColor, smoothstep(radius1 - 2e-3, radius1, length(circlePos1 - uv)));
  fragColor = mix( foreground3, fragColor, smoothstep(radius3 - 2e-3, radius3, length(circlePos3 - uv)));

  vec2 q = uv - vec2(0.5, 0.5);
  float r = 0.21;
  
  // This one applies
  // fragColor *= 1.0 - (1.0-smoothstep(r,r+0.002, abs(q.x)))*(2.0-smoothstep(0.0,1.0,q.y));
  fragColor += fragColor * foreground3;

  // Activate this below to get another clipping mask type
  //fragColor *= 1.0 - (1.0-smoothstep(r,r+0.002, abs(q.x)))*(2.0-smoothstep(0.0,1.0,q.y));
  //fragColor += fragColor + foreground1 * foreground3;
  gl_FragColor = fragColor;
}
