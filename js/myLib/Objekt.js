export const shapeTypes = [
    "box",
    "cone",
    "sphere"
];

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
        this.setShapeType(shapeType);
        this.dim = { w, h };

        this.fillColor = $p5.color(colors.fill);
        this.strokeColor = $p5.color(colors.stroke);

        this.pos = $p5.createVector(x, y, z);
        this.posEnd = this.pos;

        this.counter = 0.0;
        
        this.stopped = false;
    }

    setShapeType(shapeType) {
        this.shapeFn = $p5[shapeType].bind($p5);
    }

    toInfinity() {
        this.posEnd = $p5.createVector(x, y, -1 * depth); 
    }

    update() {
        if (this.stopped) {
            return;
        }

        this.counter += 0.001;

        if (this.pos - this.posEnd > 100) {
            return;
        }
        this.position();
    }

    position() {
        const pct = this.counter/100;
        this.pos.x = (this.pos.x * (1 - pct)) + (this.posEnd.x * pct);
        this.pos.y = (this.pos.y * (1 - pct)) + (this.posEnd.y * pct);
        this.pos.z = (this.pos.z * (1 - pct)) + (this.posEnd.z * pct);
    
        return this.pos;
    }

    drawStroke() {}

    setCounter(c) {
        this.counter = c;
    }

    draw(options={ warp: false, rotate: false}) {
        if (options.warp) {
            this.fillColor.setAlpha(190);
        } else {
            this.fillColor.setAlpha(255);
            this.update();
        }
        if (options.texture) {
            $p5.texture(options.texture);
        } else {
            $p5.fill(this.fillColor);
            $p5.stroke(this.strokeColor);
        }
        $p5.push();
        $p5.translate(this.pos);
        if (options.rotate) {
            $p5.rotate(this.counter, $p5.createVector(0, 1, 0));
        };
        this.shapeFn(this.dim.w, this.dim.h);
        $p5.pop();
    }
};

