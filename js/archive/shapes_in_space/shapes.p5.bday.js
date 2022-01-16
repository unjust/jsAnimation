import p5 from 'p5';

const initialText =  { letter: 'cx', x: -5000, y: -9800 };
let textString = [initialText];
const currentCursorPoint = { x: 0, y: 0 };
const TEXT_HEIGHT = 80;

let myFont;
let counter = 0;

window.preload = function() {
    myFont = loadFont('img/SFCompactRounded-Black.otf');
    console.log("preloading", myFont);
}

const setupText = function() {
    textFont(myFont);
    textSize(TEXT_HEIGHT);
    textAlign(CENTER, BOTTOM);
}

window.keyPressed = () => {
    if (keyCode === ALT) {
        textString = [initialText];
        currentCursorPoint.x = 0;
        currentCursorPoint.y = 0;
        counter = 0;
    }
    if ( keyCode === DELETE || keyCode === BACKSPACE) {
        console.log("DELETE");
        textString.pop();
        if (currentCursorPoint.x === 0) {
            currentCursorPoint.x = textString[textString.length -1].x;
            currentCursorPoint.y -= TEXT_HEIGHT;
        } else {
            currentCursorPoint.x -= TEXT_HEIGHT;
        }
        return false;
    }

    if (keyCode === ENTER) {
        console.log("ENTER");
        currentCursorPoint.x = 0;
        currentCursorPoint.y += TEXT_HEIGHT;
        return false;
    }
};

window.keyTyped = () => {
    if (key === '=') {
        return;
    }
    currentCursorPoint.x += TEXT_HEIGHT;
    addLetter(key, currentCursorPoint.x, currentCursorPoint.y );
    return false;
}



const addLetter = function(letter, x, y) {
    textString.push({ letter, x, y });
}
  
const drawLetters = function() {
    fill('red');
    stroke('white');
    strokeWeight(2);
    push();
    translate(-canvas.width/2 + 10, -canvas.height/2 + 200);
    
    counter += .1;

    textString.forEach((letterObj) => { 
        push();
        let { letter, x, y } = letterObj;
        const rect = myFont.textBounds(letter, x, y, TEXT_HEIGHT);
        
        translate(rect.x + (rect.w / 2), rect.y);
        rotateY(counter);
        text(letter, 0, rect.h);
        // console.log("draw", letter, cursorPoint, textString);
        pop();
    });
    pop();
}




const Shapes = [];
const NUM_SHAPES = 12;
const depth = 5000.0; // TODO: play around with adjusting this for black hole effect
let worldRotation = 0;

let canvas;

class Objekt {
    constructor(
        shapeType, 
        w, h,
        x, y, z, 
        rate=0.01, 
        colors={ stroke: 'black', fill: 'white' }) 
    {

        this.shapeType = shapeType;
        this.shapeFn = window[shapeType]; // p5 is in global mode, shape fn on window
        
        this.dim = { w, h };

        this.fillColor = color(colors.fill);
        this.strokeColor = color(colors.stroke);

        this.pos = createVector(x, y, z);
        this.posEnd = createVector(x, y, -1 * depth); 


        this.rate = rate;
        this.counter = 0.0;
    }

    move() {
        // console.log("move");
        this.counter += 0.001;
        if (this.pos - this.posEnd > 100) {
            return;
        }

        const pct = this.counter/100;
        this.pos.x = (this.pos.x * (1 - pct)) + (this.posEnd.x * pct);
        this.pos.y = (this.pos.y * (1 - pct)) + (this.posEnd.y * pct);
        this.pos.z = (this.pos.z * (1 - pct)) + (this.posEnd.z * pct);
        
        // console.log(this.pos);
        return this.pos;
    }

    drawStroke() {}

    draw(warp) {
        if (warp) {
            this.fillColor.setAlpha(190);
        } else {
            this.move();
        }

        fill(this.fillColor);
        stroke(this.strokeColor);

        push();
        translate(this.pos);
        this.shapeFn(this.dim.w, this.dim.h);
        pop();
    }
};


class Cone extends Objekt {
     
    constructor(w, h, x, y, z, rate, colors={ stroke: 'black', fill: 'red'}) {
        super("cone", w, h, x, y, z, rate, colors);
        this.rotateCounter = 0.0;
    }

    // drawing a circle base
    // for a cartoon effect

    drawStroke() {
        translate(0, -1 * this.dim.h/2, 0);
        rotateX(90);
        stroke(this.strokeColor);

        angleMode(DEGREES);
        beginShape(LINES);
        for (let i = 0; i < 360; i++) {
            let px = (cos(i) * this.dim.w);
            let py = (sin(i) * this.dim.w);
            vertex(px, py);
        }
        endShape();
    }

    draw(warp) {
        if (warp) {
            this.fillColor.setAlpha(190);
        } else {
            this.fillColor.setAlpha(255);
        }

        fill(this.fillColor);
        noStroke();
        
        this.rotateCounter += 0.1;

        if (!warp) {
            this.move();
        }

        push();
        translate(this.pos);
        rotate(this.rotateCounter, [0, 0, 1]);
        
        this.shapeFn(this.dim.w, this.dim.h);
        this.drawStroke();
        pop();
    }
};

class Cube extends Objekt {
    constructor(side, h, x, y, z, rate=0.1, colors={ stroke: 'red', fill: 'blue'}) {
        super("box", side, side, x, y, z, rate, colors );
    }
};

const shapeTypes = [
    //"sphere",
    Cube,
    Cone,
    //"cylinder",
    //"ellipsoid"
];

const createShape = function() {
    const Shape = random(shapeTypes);
    const v = p5.Vector.random3D();

    const x = v.x * width/2; // trying to constrain the cone
    const y = v.y * height/2;
    const z = 200; // hard coding z forward

    const w = random(5, 10) * 5;
    const h = random(5, 10) * 8;
    const rate = random(0.0001, 0.0008);

    // console.log("i am god", x, y, z, w, h, rate);

    Shapes.push(
        new Shape(w, h, x, y, z, 0.0)
    );
};

const spinTheWorld = () => {
    // spin the world
    rotateZ(worldRotation++);
}

window.setup = () => {
    canvas = createCanvas(1280, 720, WEBGL);
    canvas._pixelDensity = 1;
    
    // https://p5js.org/es/reference/#/p5/perspective
    perspective(PI/3, width/height, 70, depth);	  
    canvas.mouseClicked(createShape);
    setupText();
    background(0);

    console.info('click th ecanvas to create shapes. press = to spin the world. you can also type words')
};

window.draw = () => {

    // background(0);
    orbitControl();

    const warp = keyIsPressed && key == '=';

    if (warp) {
        spinTheWorld();
    } else {
        clear();
        background(0);
    } 
    
    drawLetters();
    Shapes.forEach((shape) => {
        shape.draw(warp);
    }); 

};

