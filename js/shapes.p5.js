import p5 from 'p5';

// in global mode 
// https://github.com/processing/p5.js/wiki/Global-and-instance-mode#when-is-global-mode-assumed

// TODO: get shapes to generate on a cycle
// TODO: get more dynamic speeds, some random of this, some fast some slow
// TODO: more dynamic sizes
// TODO: draw shapes with better texture

const shapeTypes = [
    "sphere",
    "box",
    "cone",
    "cylinder",
    "ellipsoid"
];


const Shapes = [];
const NUM_SHAPES = 12;
const depth = 5000.0; // TODO: play around with adjusting this for black hole effect

let canvas;

const Objekt = function(shapeType, w, h, x, y, z, rate=0.01) {
    this.shapeType = shapeType;
    this.shapeFn = window[shapeType]; // p5 is in global mode, shape fn on window
    this.dim = { w }
    this.dim.h = (shapeType === "box") ? w : h;

    this.pos = createVector(x, y, z);
    this.posEnd = createVector(x, y, -1 * depth); 
    this.counter = 0.0;
}

Object.assign(Objekt.prototype, {
    stroke() {
        switch(this.shapeType) {
            case("box"): 
                stroke("black");
                break;
            case("sphere"):
                noStroke();
                break;
            case("cone"):
                stroke("black")
                ellipse(0, this.dim.h, this.dim.w);
                stroke("white");
                break;
            case("ellipsoid"): 
                noStroke();
                break;
            default:
                noStroke();
        }
    },
    move() {
        if (this.pos - this.posEnd > 100) {
            return;
        }

        const pct = this.counter/100;
        this.pos.x = (this.pos.x * (1 - pct)) + (this.posEnd.x * pct);
        this.pos.y = (this.pos.y * (1 - pct)) + (this.posEnd.y * pct);
        this.pos.z = (this.pos.z * (1 - pct)) + (this.posEnd.z * pct);
        
        // console.log(this.pos);
        return this.pos;
    },
    draw() {}
});


const Cone = function(w, h, x, y, z, rate=0.01) {
    this.shapeFn = window["cone"]; // p5 is in global mode, shape fn on window
    this.dim = { w, h };

    this.pos = createVector(x, y, z);
    this.posEnd = createVector(x, y, -1 * depth); 
    this.counter = 0.0;
}


Object.assign(Cone.prototype, Objekt.prototype, {
    shapeType: "cone",
    counter: 0,
    stroke() {
        
    },
    draw() {
        // stroke('black');
        fill('blue');
        
        // push();
        
        // pop();

        push();
        this.shapeFn(this.dim.w, this.dim.h);
        rotateY(this.counter++);
        //rotateY(180);
        beginShape(LINES);
        for (let i = 0; i < TWO_PI; i+=1/360) {
            let px = (cos(i) * this.dim.w);
            let py = (sin(i) * this.dim.w);
            vertex(px, py, this.pos.z);
        }
        endShape();
        pop();
    }
});

const createShape = function() {

    const shapeType = random(shapeTypes);
    const v = p5.Vector.random3D();

    const x = v.x * width/2; // trying to constrain the cone
    const y = v.y * height/2;
    const z = -200; // hard coding z forward

    const w = random(5, 10) * 5;
    const h = random(5, 10) * 5;
    const rate = random(0.0001, 0.0008);

    console.log("i am god", x, y, z, w, h, rate);

    Shapes.push(
        new Cone(w, h, 0, 0, z, 0.0)
    );
};

window.setup = () => {
    
    canvas = createCanvas(710, 400, WEBGL);
    // https://p5js.org/es/reference/#/p5/perspective
    perspective(PI/3, width/height, 70, depth);	
   
    canvas.mouseClicked(createShape);
};

window.draw = () => {
    
    clear();
    background(0);
    orbitControl();
    
    push();
    translate(200, 200, -500);
    cone(200, 300);
    pop();

    Shapes.forEach((shape) => {
        console.log("drawww");
        shape.draw();
    });
};

