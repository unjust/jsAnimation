import Objekt from "./Objekt.js";

export default class Cone extends Objekt {
     
    constructor(
        sketch,
        { 
            w, 
            h,
            x,
            y,
            z
        },
        initialRotation=180.0,
        colors) {
        super(sketch, "cone", { w, h, x, y, z }, colors);
        this.rotateCounter = initialRotation; // start pointed up
    }

    // drawing a circle base
    // for a cartoon effect

    // TODO improve performance
    drawStroke() {
        this.sk.translate(0, -1 * this.dim.h/2, 0);
        this.sk.rotateX(90);
        this.sk.stroke(this.strokeColor);

        this.sk.angleMode(this.sk.DEGREES);
        // this.sk.beginShape(this.sk.LINES);

        // for (let i = 0; i < 360; i++) {
        //     let px = (Math.cos(i) * this.dim.w);
        //     let py = (Math.sin(i) * this.dim.w);
        //     this.sk.vertex(px, py);
        // }
        // this.sk.endShape();
        this.sk.circle(0, 0, this.dim.w * 2)
    }

    draw(warp) {
        if (warp) {
            this.fillColor.setAlpha(190);
        } else {
            this.fillColor.setAlpha(255);
        }

        this.sk.fill(this.fillColor);
        this.sk.noStroke();
        
        if (!warp) {
            this.update();
        }

        this.sk.push();
        
        this.sk.rotate(this.rotateCounter, [0, 0, 1]);
        
        this.shapeFn(this.dim.w, this.dim.h);
        this.drawStroke();
        this.sk.pop();
    }
};
