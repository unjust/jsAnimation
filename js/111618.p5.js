import p5 from 'p5';

// in global mode 
// https://github.com/processing/p5.js/wiki/Global-and-instance-mode#when-is-global-mode-assumed


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

const Object = function(shapeFn, w, h, x, y, z, rate=0.01) {
    this.pos = createVector(x, y, z);
    this.posEnd = createVector(x, y, -10000.); 

    
    this.counter = 0.0;
    console.log("init counter", this.counter);

    this.tick = (x = 0.1) => this.counter += x;

    this.move = () => {
        console.log('my counter ', this.counter);
        const pct = this.counter/100;
        // (A * (1-pct)) + (B * pct)
        this.pos = (this.pos.mult(1-pct)).add(this.posEnd.mult(pct));
    }

    this.draw = () => {
        this.move();
        // console.log(this.pos.z);
        stroke('black');
        fill('white');
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        rotate(this.tick(rate), [1, 1, 1]);
        shapeFn(w, h);
        pop();
    }
};

const Shapes = [];
const NUM_SHAPES = 12;
let canvas;

let shapeTypes;

const createShape = function() {
    console.log("i am god");
    const type = random(shapeTypes);
    // const x = random(-1 * width/2, width/2);
    // const y = random(-1 * height/2, height/2);
    const v = p5.Vector.random3D();
    const x = v.x * width;
    const y = v.y * height;
    const z = v.z * 100; // hard coding z forward
    
    Shapes.push(new Object(type, 30, 30, x, y, z));
};

window.setup = () => {
    
    shapeTypes = [
        sphere,
        box,
        cone,
        cylinder,
        ellipsoid,
        // torus
    ];
    
    canvas = createCanvas(710, 400, WEBGL);
    canvas.mouseClicked(createShape);
    let fov = PI/3;
    let cameraZ = (height/2.0) / tan(fov/2.0);
    perspective(fov, float(width*2)/float(height*2), cameraZ/10.0, cameraZ*10000.0);	
    
    console.log(NUM_SHAPES, '!');

};

const timeBtwn = [];

window.draw = () => {
    
    clear();
    background(0);
    //camera(0, 0, (height/2) / tan(PI/6), width/2, height/2, 0, 0, 1, 0);

    // camera(0, 0, frameCount * -0.5, 0, 0, 0, 0, 1, 0);
  
    // choose 1 thats not active
    // after a certain amount of time lapse (random) choose another
    // lastSelectedShape()

    Shapes.forEach((shape) => {
        shape.draw();
    });
};

