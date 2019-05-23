export default class Objekt {
    constructor(
        shapeType, 
        w,
        h,
        x,
        y,
        z,
        colors={ stroke: 'black', fill: 'white' }) 
    {

        this.shapeType = shapeType;
        this.shapeFn = $p5[shapeType].bind($p5);
        
        this.dim = { w, h };

        this.fillColor = $p5.color(colors.fill);
        this.strokeColor = $p5.color(colors.stroke);

        this.pos = $p5.createVector(x, y, z);
        this.posEnd = this.pos;

        this.counter = 0.0;
        
        this.stopped = false;
    }

    toInfinity() {
        this.posEnd = $p5.createVector(x, y, -1 * depth); 
    }

    move() {
        if (this.stopped) {
            return;
        }

        this.counter += 0.001;
        if (this.pos - this.posEnd > 100) {
            return;
        }

        const pct = this.counter/100;
        this.pos.x = (this.pos.x * (1 - pct)) + (this.posEnd.x * pct);
        this.pos.y = (this.pos.y * (1 - pct)) + (this.posEnd.y * pct);
        this.pos.z = (this.pos.z * (1 - pct)) + (this.posEnd.z * pct);
        
        return this.pos;
    }

    drawStroke() {}

    draw(warp) {
        if (warp) {
            this.fillColor.setAlpha(190);
        } else {
            this.move();
        }

        $p5.fill(this.fillColor);
        $p5.stroke(this.strokeColor);

        $p5.push();
        $p5.translate(this.pos);
        this.shapeFn(this.dim.w, this.dim.h);
        $p5.pop();
    }
};

