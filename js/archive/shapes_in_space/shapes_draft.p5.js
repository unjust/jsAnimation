import p5 from 'p5';

// in global mode 
// https://github.com/processing/p5.js/wiki/Global-and-instance-mode#when-is-global-mode-assumed

// TODO: get shapes to generate on a cycle
// TODO: get more dynamic speeds, some random of this, some fast some slow
// TODO: more dynamic sizes
// TODO: draw shapes with better texture

const shapeTypes = [
    // "sphere",
    "box",
    "cone",
    "cylinder",
    // "ellipsoid"
];


const depth = 5000.0; // TODO: play around with adjusting this for black hole effect

const Object = function(shapeType, w, h, x, y, z, rate=0.01) {
    this.shapeType = shapeType;
    this.shapeFn = window[shapeType]; // p5 is in global mode, shape fn on window

    this.dim = { w }
    this.dim.h = (shapeType === "box") ? w : h;

    this.pos = createVector(x, y, z);
    this.posEnd = createVector(x, y, -1 * depth); 
    
    this.counter = 0.0;
    this.rotateCounter = 0.0;
    // this.stroke = () => {
    //     switch(this.shapeType) {
    //         case("box"): 
    //             stroke("black");
    //             break;
    //         case("sphere"):
    //             noStroke();
    //             break;
    //         case("cone"):
    //             stroke("black")
    //             ellipse(0, this.dim.h, this.dim.w);
    //             stroke("white");
    //             break;
    //         case("ellipsoid"): 
    //             noStroke();
    //             break;
    //         default:
    //             noStroke();
    //     }
    // }

    this.move = () => {
        if (this.pos - this.posEnd > 100) {
            return;
        }

        const pct = this.counter/100;
        // const A = this.pos.mult(1-pct);
        // const B = this.posEnd.mult(pct);
        // this.pos = A.add(B);

        // TODO: check this math, put back vector operations
        // (A * (1-pct)) + (B * pct)
        // const test = (this.pos.mult(1-pct)).add(this.posEnd.mult(pct));

        this.pos.x = (this.pos.x * (1 - pct)) + (this.posEnd.x * pct);
        this.pos.y = (this.pos.y * (1 - pct)) + (this.posEnd.y * pct);
        this.pos.z = (this.pos.z * (1 - pct)) + (this.posEnd.z * pct);
        
        // console.log(this.pos);
        return this.pos;
    }

    this.draw = () => {
        // stroke('black');
        fill('white');

        this.counter += rate;
        // console.log(rate);

        this.move();

        push();
        translate(this.pos);
        rotate(this.rotateCounter+=.01, [1, 1, 1]); // TODO: try to make rotation dynamic
        
        this.shapeFn(this.dim.w, this.dim.h);
        pop();
    }
};

const Shapes = [];
const NUM_SHAPES = 12;
let canvas;



const createShape = function() {

    const shapeType = random(shapeTypes);
    const v = p5.Vector.random3D();

    // const x = v.x * width;
    // const y = v.y * height;
    // const z = (v.z * depth) * -1/50;

    const x = v.x * width/2; // trying to constrain the cone
    const y = v.y * height/2;
    const z = 200; // hard coding z forward

    const w = random(5, 10) * 5;
    const h = random(5, 10) * 5;
    const rate = random(0.0001, 0.0008);

    // console.log("i am god", x, y, z, w, h, rate);

    Shapes.push(
        new Object(shapeType, 
            w, h,
            x, y, z,
            rate)
    );
};

window.setup = () => {
    
    canvas = createCanvas(710, 400, WEBGL);
    canvas.parent('container');
    // https://p5js.org/es/reference/#/p5/perspective
    perspective(PI/3, width/height, 70, depth);	
   
    canvas.mouseClicked(createShape);

    console.info('click canvas to create a shape. move around with the camera');
};

const timeBtwn = [];

window.draw = () => {
    
    clear();
    background(0);
    orbitControl();
    
    // camera(0, 0, (height/2) / tan(PI/6), width/2, height/2, 0, 0, 1, 0);
    // camera(0, 0, frameCount * -0.5, 0, 0, 0, 0, 1, 0);
  
    // choose 1 thats not active
    // after a certain amount of time lapse (random) choose another
    // lastSelectedShape()

    Shapes.forEach((shape) => {
        shape.draw();
    });
};

