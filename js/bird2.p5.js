import 'p5';

// in global mode 
// https://github.com/processing/p5.js/wiki/Global-and-instance-mode#when-is-global-mode-assumed

console.log("hello world");

const Bird = function(color, x, y) {
    this.color = color || color('black');
    const pos = { x, y };

    this.counter = 0;
    this.tick = () => this.counter += 0.02;

    this.head = () => {
        const head_pos = {
            x: pos.x - 30,
            y: pos.y - 50
        }
        const size = 50;
        ellipse(head_pos.x, head_pos.y, size, size); // head
        
        noStroke();
        fill('orange');
        triangle(head_pos.x - size/2, head_pos.y, 
            head_pos.x - (size/2 + 10), head_pos.y + 8, 
            head_pos.x - size/2 + 2, head_pos.y + 10);

        fill(this.color)
    };

    this.body = () => {
        const body_pos = {
            x: pos.x - 25,
            y: pos.y - 25
        }

        beginShape();
        vertex(body_pos.x, body_pos.y);
        // neck
        bezierVertex(body_pos.x + 4, body_pos.y + 3,
            body_pos.x + 20, body_pos.y - 10,
            body_pos.x + 22, body_pos.y - 25)
        // back
        .bezierVertex(body_pos.x + 20, body_pos.y - 5,
            body_pos.x + 120, body_pos.y - 5,
            body_pos.x + 140, body_pos.y - 20)
        // tail
        .bezierVertex(body_pos.x + 138, body_pos.y - 18,
            body_pos.x + 132, body_pos.y - 15,
            body_pos.x + 130, body_pos.y - 5)
        // body
        .bezierVertex(body_pos.x + 115, body_pos.y + 30,
            body_pos.x + 100, body_pos.y + 40,
            body_pos.x + 65, body_pos.y + 45)
        // chest
        .bezierVertex(body_pos.x + 50, body_pos.y + 45,
            body_pos.x + 15, body_pos.y + 50,
            body_pos.x, body_pos.y);
        endShape();
    };

    this.wing = () => {
        // var wingColor = this.color.levels.slice();
        // wingColor[3] = 100.0;
        // fill(wingColor);
        const wing_pos = {
            x: pos.x - 5,
            y: pos.y - 45
        }
        const wingspan = 100;

        beginShape();
        vertex(wing_pos.x, wing_pos.y);
        vertex(wing_pos.x + wingspan, wing_pos.y);
        quadraticVertex(wing_pos.x + 40, wing_pos.y + 80, wing_pos.x, wing_pos.y);
        endShape();
    };

    this.draw = function(x, y) {

        fill(this.color)
        // stroke('black');

        this.tick();

        fill(this.color)

        this.body();
        this.head();
        
        // console.log(this.color, '!');
        
        this.wing();
    };
};

const NUM_BIRDS = 5;
let birds = [];

window.setup = () => {
    createCanvas(800, 400);
    background(255);

    while (birds.length < NUM_BIRDS) {
        birds.push(new Bird(color(0, 0, 255, 100), 100*birds.length, 200));
    }
};

window.draw = () => {
    clear();
    birds.forEach((b) => b.draw());
};
