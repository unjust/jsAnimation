export const shapeTypes = [
    "box",
    "cone",
    "sphere"
];

export default class Objekt {
    constructor(
        sketch,
        shapeType,
        { w, h, x=0, y=0, z=0 },
        colors={ stroke: 'black', fill: 'white' }) 
    {

        this.sk = this.sketch = sketch;

        this.setShapeType(shapeType);

        this.dim = { w, h };

        this.fillColor = this.sk.color(colors.fill);
        this.strokeColor = this.sk.color(colors.stroke);

        this.pos = this.sk.createVector(x, y, z);
        this.posEnd = this.pos;

        this.counter = 0.0;
        
        this.stopped = false;
    }

    setShapeType(shapeType) {
        this.shapeFn = this.sk[shapeType].bind(this.sk);
    }

    toInfinity() {
        this.posEnd = this.sk.createVector(x, y, -1 * depth); 
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
            this.sk.texture(options.texture);
        } else {
            this.sk.fill(this.fillColor);
            this.sk.stroke(this.strokeColor);
        }
        this.sk.push();
        this.sk.translate(this.pos);
        if (options.rotate) {
            this.sk.rotate(this.counter, this.sk.createVector(0, 1, 0));
        };
        this.shapeFn(this.dim.w, this.dim.h);
        this.sk.pop();
    }
};

