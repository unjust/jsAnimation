import p5 from 'p5';

new p5((sk) => {
    let start = sk.createVector(100, 100), 
        end = sk.createVector(0, 0),
        augment = sk.createVector(1, 1);

    const canvas_w = 1000, 
        canvas_h = 800;

    const update = () => {
        start.add(augment);
    };

    sk.setup = () => {
        sk.createCanvas(canvas_w, canvas_h, p5.WEBGL).parent('container');
        
        sk.fill('white');
    };

    sk.draw = () => {
        //sketch.clear();
        update();
        sk.line(start.x, start.y, end.x, end.y);
    };
});