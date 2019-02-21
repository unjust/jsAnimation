import p5 from 'p5';

new p5((sketch) => {
    let start = p5.createVector(100, 100), 
        end = p5.createVector(0, 0),
        augment = p5.createVector(1, 1);

    const canvas_w = 1200, 
        canvas_h = 800;

    const update = () => {
        start.add(augment);
    };

    sketch.setup = () => {
        p5.createCanvas(canvas_w, canvas_h, p5.WEBGL);
        p5.fill('white');
    };

    sketch.draw = () => {
        //sketch.clear();
        update();
        p5.line(start.x, start.y, end.x, end.y);
    };
});