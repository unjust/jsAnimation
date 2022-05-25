#ifdef GL_ES
precision mediump float;
#endif

// varying vec2 v_texcoord;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_value;
uniform vec3 u_colorVector;


float rand2D(in vec2 co, float seed){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 + seed);
}

float noise2D(vec2 norm_fragCoord, int resolution, int iterations, float amplitude, float smoothness, float blur, float seed) {
    float level = 0.5;
    float variation_amplitude = 0.5;
    float grid_resolution = float(resolution);
    
    vec2 p0;
    vec2 p1;
    vec2 p2;
    vec2 p3;
    
    float d0;
    float d1;
    float d2;
    float d3;
    
    float c0 = level;
    float c1 = level;
    float c2 = level;
    float c3 = level;
    
    for(int i = 0; i < 3; i++) { 
        grid_resolution = grid_resolution * pow(2.0, float(i));
        float grid_cell_size = 1.0 / grid_resolution;
        
        variation_amplitude = variation_amplitude / (smoothness * float(i + 1));
        p0 = vec2(floor(grid_resolution * norm_fragCoord) / grid_resolution);
        p3 = floor(grid_resolution * (norm_fragCoord + grid_cell_size)) / grid_resolution;
        p1 = vec2(p3.x, p0.y);
        p2 = vec2(p0.x, p3.y);

        
        d0 = 1.0 / pow(distance(norm_fragCoord, p0), blur);
        d1 = 1.0 / pow(distance(norm_fragCoord, p1), blur);
        d2 = 1.0 / pow(distance(norm_fragCoord, p2), blur);
        d3 = 1.0 / pow(distance(norm_fragCoord, p3), blur);

        c0 = level + variation_amplitude * (rand2D(p0, seed) - 0.5);
        c1 = level + variation_amplitude * (rand2D(p1, seed) - 0.5);
        c2 = level + variation_amplitude * (rand2D(p2, seed) - 0.5);
        c3 = level + variation_amplitude * (rand2D(p3, seed) - 0.5);
       
        level = (
                    c0 * d0 + 
                    c1 * d1 + 
                    c2 * d2 +
                    c3 * d3
                ) / (d0 + d1 + d2 + d3);
    }
        
    return pow(level, amplitude);
}

vec2 brownian_motion2D (vec2 norm_fragCoord, float time) {
    float frequency = 1.0;
    float amplitude = 0.2;
    
    norm_fragCoord.x = norm_fragCoord.x * (1.0 + 0.2 * amplitude * cos(0.22 * time + 0.5 * norm_fragCoord.x * frequency));
    norm_fragCoord.x = norm_fragCoord.x * (1.0 + 0.2 * amplitude * cos(0.35 * time + 0.8 * norm_fragCoord.x * frequency));
    norm_fragCoord.x = norm_fragCoord.x * (1.0 + 0.2 * amplitude * cos(0.18 * time + 0.32 * norm_fragCoord.x * frequency));
    
    norm_fragCoord.y = norm_fragCoord.y * (1.0 + 0.7 * amplitude * cos(0.22 * time + 0.25 * norm_fragCoord.y * frequency));
    norm_fragCoord.y = norm_fragCoord.y * (1.0 + 0.4 * amplitude * cos(0.35 * time + 0.44 * norm_fragCoord.y * frequency));
    norm_fragCoord.y = norm_fragCoord.y * (1.0 + 0.3 * amplitude * cos(0.18 * time + 0.54 * norm_fragCoord.y * frequency));
    

    return norm_fragCoord;
}

vec4 fog(vec2 norm_fragCoord, vec3 color, float intensity, float speed, float time, float seed) { 
    norm_fragCoord = brownian_motion2D(norm_fragCoord, time);
    
    float level1 = noise2D(norm_fragCoord, 8, 3, 2.0, 1.5, 3.0, seed);
    float level2 = noise2D(norm_fragCoord, 6, 3, 2.0, 1.5, 3.0, seed + 0.5);
    float level = pow(sin(speed * time), 2.0) * level1 + pow(cos(speed * time), 2.0) * level2;
    
    return vec4(color * pow(level, 1.0/intensity), pow(level, 0.25));
}

void main()
{   
    vec3 image_color = u_colorVector;
    vec2 norm_fragCoord = gl_FragCoord.xy / u_resolution.xx;
    
    vec4 c = fog(norm_fragCoord, image_color, 2.0, 0.5, u_time/1000.0, 0.0);
    
    //if (c.a > 0.8) {
      gl_FragColor = vec4(c.r, c.g, c.b, c.a);
    //} else {
     // discard;
    //}
}
