#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_radius;
uniform float u_time; // angle
uniform float u_speed;
uniform vec2 u_xy_factor;
uniform vec2 u_mouse;
uniform int u_length;


float smoothedge(float v) {
    return smoothstep(0.0, 1.0 / u_resolution.x, v);
}

float liss(vec2 pos, float radius, float time, vec2 xy) {

  // calculate all the points of the liss
  // for every point, compare it to the current coord
  // if one point equals the current coord, return the color
    //vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y); // why min?
    float one_px = 1. / u_resolution.x; //not really one px
    
    float d = 0.0;
    float angle = time;
    for (int i = 0; i < 50; i++) {
      angle += 0.001; // delta distance
      // float angle = u_time + float(i) * 0.0075 + u_speed;
      vec2 point = radius * vec2(sin((PI * 0.5) * angle * xy.x), sin(angle * xy.y));
      float t = 0.01 / length(point - st); // greater the distance, less the v
      //color = smoothedge(d);
      // d += pow(t, 3.0);
      // if (d < 0.001) {
      //   color = 0.0;
      //   break;
      // }

      if (distance(point, st) < one_px) {
        d = 1.0;
        break;
      }
    }
    return d;
    // return smoothstep(0.5, 1.0, d);
}

float circle(vec2 p, float radius) {
  //vec2 coord = gl_FragCoord.xy;
  //vec2 p = pos - coord;
  return length(p) - radius; // + u_time/100.00;
}

// void main() {
//   // vec3 color = vec3(0.0, midiKey/100.0, 0.0);
//   vec2 st = gl_FragCoord.xy/u_resolution;

//   // float d = liss(st, u_radius, u_time, u_xy_factor);
//   // vec2 center = u_resolution * 2.0;
//   // float size = u_resolution.y * .5;

//   float d = circle(st - vec2(0.0), .1);
//   vec3 color = vec3(0.0, smoothedge(d), 0.0);

//   float d2 = liss(st - vec2(0.5), .25, u_time, u_xy_factor);
//   vec3 color2 = vec3(d2);

//   // gl_FragColor = vec4(0.0, 1.0, 0.0, color2);
//   gl_FragColor = vec4(color2, 1.0);
// }

// Lissajous curve in raymarching using GLSL by @cat_in_136
// https://cat-in-136.github.io/2017/06/lissajous-curve-in-raymarching-using-glsl-over-webgl.html


void main() {
  vec2 st = gl_FragCoord.xy/u_resolution;
  float d = circle(st - vec2(0.0), .1);
  vec3 color = vec3(0.0, smoothedge(d), 0.0);
  // gl_FragColor = vec4(color, 1.0);
  
  vec2 pos = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y); // why min?

  // float v = 0.0;
  // for (int i = 0; i < 100; i++) {
  //   float s = u_time + float(i) * 0.0075 + u_speed;
  //   vec2 mpos = 0.8 * vec2(sin(PI/2.0 * s * u_xy_factor.x), sin(s * u_xy_factor.y)); // 0.8 is radius?
  //   // radius * vec2(sin(angleTime * this.xFactor), - cos(angleTime * y.factor))
  //   // mpos position
  //   float t = 0.01 / length(mpos - pos); 
  //   // 0.01 /
  //   // some kind of relation of the pixel of the liss to 
  //   // our current coordinate
  //   // when mpos and pos are very close, t can be 10 or 100
  //   // v += pow(t, 2.0) * float(i + 1) / 100.0;
  //   v += pow(t, 2.0) * float(i + 1) / 1000.0;
  //   // increase v's brightness in an eponential way to cause a gradient
  // }

  float v = liss(pos, 0.5, u_time, u_mouse); // u_xy_factor
  gl_FragColor = 1.0 * vec4(0.0, v, 0.0, 1.0); // why do we multiply this by 1.0?
  
}


// const x = this.radius * Math.sin(Math.PI/2 + this.angle * this.xFactor);
//     const y = this.radius * Math.sin(this.angle * this.yFactor);
//     let z = this.radius * Math.cos(this.angle);
//     if (this.vertices.length > this.verticesTail) {
//       this.vertices.shift();
//     }
//     z = this.drawZ ? z : 1;

//     this.vertices.push({x, y, z});
