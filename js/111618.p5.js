import p5 from 'p5';
import { defaultCipherList } from 'constants';

// in global mode 
// https://github.com/processing/p5.js/wiki/Global-and-instance-mode#when-is-global-mode-assumed


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

const Object = function(shapeFn, w, h, x, y, z, rate=0.01) {
    this.pos = createVector(x, y, z);
    this.posEnd = createVector(x, y, -1 * 10000.); 

    this.counter = 0.0;
    
    this.tick = (x = 0.1) => this.counter += x;

    this.move = () => {
        if (this.counter > 100) {
            return;
        }
        const pct = this.counter/100;
        
        // TODO: check this math
        // (A * (1-pct)) + (B * pct)
        // this.pos = (this.pos.mult(1-pct)).add(this.posEnd.mult(pct));

        const A = this.pos.mult(1-pct);
        const B = this.posEnd.mult(pct);
        // this.pos.z = (this.pos.z * (1 - pct)) + (this.posEnd.z * pct);
        this.pos = A.add(B);
        console.log(this.pos.z);
        return this.pos;
    }

    this.draw = () => {
        // console.log(this.pos.z);  
        stroke('black');
        fill('white');
        this.move();

        push();
        translate(this.pos);
        rotate(this.tick(rate), [1, 1, 1]);
        shapeFn(w, h);
        pop();
    }
};

const Shapes = [];
const NUM_SHAPES = 12;
let canvas;

const shapeTypes = [
    "sphere",
    "box",
    "cone",
    "cylinder",
    "ellipsoid"
];

const depth = 5000.0;

const createShape = function() {
   

    const type = window[random(shapeTypes)];
    // const x = random(-1 * width/2, width/2);
    // const y = random(-1 * height/2, height/2);
    const v = p5.Vector.random3D();
    const x = v.x * width;
    const y = v.y * height;
    const z = v.z * depth; // hard coding z forward
    
    console.log("i am god", x, y, z);
    Shapes.push(new Object(type, 30, 30, x, y, z));
};

window.setup = () => {
    
    canvas = createCanvas(710, 400, WEBGL);
    // https://p5js.org/es/reference/#/p5/perspective
    perspective(PI/3, width/height, 70, depth);	
   
    canvas.mouseClicked(createShape);
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

