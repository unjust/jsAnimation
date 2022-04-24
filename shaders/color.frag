#ifdef GL_ES
precision mediump float;
#endif

uniform float midiKey;

vec3 hsl2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}


void main() {
  // vec3 color = vec3(0.0, midiKey/100.0, 0.0);
  vec3 hsl = vec3(midiKey/100.0 * 360.0, midiKey/100.0 * 100.0, midiKey/100.0 * 100.0);
  vec3 color = hsl2rgb(hsl);
  gl_FragColor = vec4(color, 1.0);
}

// #ifdef GL_ES
// precision mediump float;
// #endif

// #define PI 3.14159265359

// uniform vec2 u_resolution;
// uniform vec2 u_mouse;
// uniform float u_time;

// vec3 colorA = vec3(0.149,0.141,0.912);
// vec3 colorB = vec3(1.000,0.833,0.224);
// vec3 colorC = vec3(1.000,0.0,0.0);
// float plot (vec2 st, float pct){
//   return  smoothstep( pct-0.01, pct, st.y) -
//           smoothstep( pct, pct+0.01, st.y);
// }

// void main() {
//     vec2 st = gl_FragCoord.xy/u_resolution.xy;
//     vec3 color = vec3(0.0);

//     vec3 pct = vec3(abs(st.y - 1.0));

//     //pct.r = smoothstep(0.0,1.0, st.x);
//     //pct.g = sin(st.x*PI);
//     //pct.b = pow(st.x,0.5);

//     color = mix(colorA, colorB, pct);
// 	color = mix(color, colorC, sin(u_time/5.0)-0.5);
//     // Plot transition lines for each channel
//     //color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
//     //color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
//     //color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));

//     gl_FragColor = vec4(color,1.0);
// }
