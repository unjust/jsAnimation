import 'p5';

// in global mode 
// https://github.com/processing/p5.js/wiki/Global-and-instance-mode#when-is-global-mode-assumed

const Bird = function(color, x, y) {
    this.color = color || color('black');
    const pos = { x, y };

    this.counter = 0;
    this.tick = () => this.counter += 0.02;

    this.draw = function(x, y) {

        fill(this.color)
        stroke('black');

        this.tick();


        translate(this.counter*50, this.counter*10);
        ellipse(pos.x - 10, pos.y - 10, 72, 72); // head

        fill('red');
        ellipse(pos.x, pos.y, 120, 20); // body     //wing

        scale(sin(this.counter));
        ellipse(pos.x, pos.y, 72, 120); // body

    };
};

const bird = new Bird('blue', 120, 100);

window.setup = () => {
    createCanvas(800, 400);
    background(255);
};

window.draw = () => {
    clear();
    bird.draw();
};

// new p5((sketch) => {
   
//     const bird = new Bird(sketch, 'blue', 0, 0);

//     sketch.setup = () => {
//         createCanvas(800, 400);
//         background(255);
//     };
    
//     sketch.draw = () => {
//         bird.draw();
//     };

// }, document.getElementById("container"));