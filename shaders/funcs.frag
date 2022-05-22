vec3 rect(vec2 st, vec2 wh, vec2 origin) {
    vec3 color = vec3(0.0);
    
    // bottom-left
    vec2 bl = floor((origin - st));
    float pct = bl.x * bl.y;

    // top-right
    vec2 tr = floor((st - origin) - wh);
    pct *= tr.x * tr.y;

    color = vec3(pct);
    
    return color;
}

float circle(vec2 st, vec2 origin, float r) {
    float pct = 0.0;

    // a. The DISTANCE from the pixel to the center
    // pct = distance(st,vec2(0.5));

    // b. The LENGTH of the vector
    //    from the pixel to the center
    // vec2 toCenter = vec2(r) - st;
    vec2 toCenter = vec2(r) - st - (0.5 - origin);
    pct = smoothstep(r + 0.014, r + 0.0008, length(toCenter));
	return pct;
    
    // c. The SQUARE ROOT of the vector
    //    from the pixel to the center
    // vec2 tC = vec2(0.5)-st;
    // pct = sqrt(tC.x*tC.x+tC.y*tC.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
	  vec3 color = rect(st, vec2(0.2), vec2(0.5));
    
    gl_FragColor = vec4(color,1.0);
}
