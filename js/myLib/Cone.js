import Objekt from "./Objekt.js";

export default class Cone extends Objekt {
     
    constructor(
        w, 
        h,
        x,
        y,
        z,
        initialRotation=180.0,
        colors) {
        super("cone", w, h, x, y, z, colors);
        this.rotateCounter = initialRotation; // start pointed up
    }

    // drawing a circle base
    // for a cartoon effect

    drawStroke() {
        $p5.translate(0, -1 * this.dim.h/2, 0);
        $p5.rotateX(90);
        $p5.stroke(this.strokeColor);

        $p5.angleMode($p5.DEGREES);
        $p5.beginShape($p5.LINES);
        for (let i = 0; i < 360; i++) {
            let px = (Math.cos(i) * this.dim.w);
            let py = (Math.sin(i) * this.dim.w);
            $p5.vertex(px, py);
        }
        $p5.endShape();
    }

    draw(warp) {
        if (warp) {
            this.fillColor.setAlpha(190);
        } else {
            this.fillColor.setAlpha(255);
        }

        $p5.fill(this.fillColor);
        $p5.noStroke();
        
        if (!warp) {
            this.update();
        }

        $p5.push();
        
        $p5.rotate(this.rotateCounter, [0, 0, 1]);
        
        this.shapeFn(this.dim.w, this.dim.h);
        this.drawStroke();
        $p5.pop();
    }
};
