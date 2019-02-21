import p5 from 'p5';

new p5((sketch) => {
    let start = sketch.createVector(100, 100), 
        end = sketch.createVector(0, 0),
        augment = sketch.createVector(1, 1);

    const distance = sketch.createVector(10, 10);
    const canvas_w = 800, 
        canvas_h = 600;

    const hit = (v) => (v.x > canvas_w || v.x < 0 || v.y > canvas_h || v.y < 0);

    const update = () => {
        start.add(augment);
        end.add(start - distance);
        if (hit(start)) {
            start.add(augment.mult(-1));
        }
    };

    sketch.setup = () => {
        const c = sketch.createCanvas(canvas_w, canvas_h, p5.WEBGL);
        sketch._pixelDensity = 1;
        c.parent('container');
        sketch.fill('white');
    };

    sketch.draw = () => {
        sketch.clear();
        update();
        sketch.line(start.x, start.y, end.x, end.y);
    };
});