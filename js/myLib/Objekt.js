export const shapeTypes = [
    "box",
    "cone",
    "sphere"
];

/**
 * @description generic Objekt class for drawing cube, cone
 * @property dim { Object } width and height
 * @property pos { Vector } current position of the object
 * @property posEnd { Vector } end position of the object
 */
export default class Objekt {
    constructor(
        sketch,
        shapeType,
        { w=10, h=10, x=0, y=0, z=0 },
        colors={ stroke: 'black', fill: 'white' },
        noStroke=false,
        counter=0.0 ) 
    {

        this.sk = this.sketch = sketch;

        this.setShapeType(shapeType);

        this.dim = { w, h };
        this.fillColor = this.sk.color(colors.fill);
        this.strokeColor = this.sk.color(colors.stroke);
        this.noStroke = noStroke;
        this.pos = this.sk.createVector(x, y, z);
        this.posEnd = this.pos;
        this.counter = counter;
        
        this.stopped = false;
    }

    setShapeType(shapeType) {
        this.shapeFn = this.sk[shapeType].bind(this.sk);
    }

    /**
     * @description sets the posEnd to infinite depth of view
     */
    toInfinity() {
        this.posEnd = this.sk.createVector(x, y, -1 * depth); 
    }

    update() {
        if (this.stopped) {
            return;
        }
        this.counter += 0.5;
        if (this.pos - this.posEnd > 100) {
            return;
        }
        this._updatePosition();
    }

    setPosition({ x, y, z=0.0 }) {
      this.pos = this.sk.createVector(x, y, z); 
    }
  
    _updatePosition() {
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

    /**
     * 
     * @param { Object } options warp keeps redrawing to produce a feedback effect, rotate
     */
    draw(options={ warp: false, rotate: false, subDraw }) {
        const { warp, rotate, subDraw } = options;

        if (warp) {
            this.fillColor.setAlpha(190);
        } else {
            this.fillColor.setAlpha(255);
            this.update();
        }
        if (options.texture) {
            this.sk.texture(options.texture);
        } else {
            this.sk.fill(this.fillColor);

            (this.noStroke) ? this.sk.noStroke() : this.sk.stroke(this.strokeColor);
        }
        this.sk.push();
        this.sk.translate(this.pos);
        if (rotate) {
            this.sk.rotate(this.counter, [0, 1, 1]);
        };
        this.shapeFn(this.dim.w, this.dim.h);

        if (subDraw) {
          subDraw();
        }
        this.sk.pop();
    }
};

