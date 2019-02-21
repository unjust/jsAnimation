import p5 from 'p5';

new p5((sketch) => {
    let start = sketch.createVector(100, 100), 
        end = sketch.createVector(0, 0);

    let currentAugmentKey;

    const buffer = [];
    const s = 1;
    const augment = {
        0: sketch.createVector(1 * s, 1  * s),
        1: sketch.createVector(-1 * s, 1 * s),
        2: sketch.createVector(1 * s, -1 * s),
        3: sketch.createVector(-1 * s, -1 * s)
    };

    const distance = 200;
    const canvas_w = 800, 
        canvas_h = 600;

    const hit = (v) => (v.x > canvas_w || v.x < 0 || v.y > canvas_h || v.y < 0);

    const getNextDirection = (curr) => {
        let r = Math.floor(Math.random() * Math.floor(4));
        return (r != curr) ? r : getNextDirection(r);
    };

    const update = () => {
        if (buffer.length == distance) {
            buffer.shift();
            end = buffer[0];
        } else {
            let delta = sketch.createVector(distance, distance);
            p5.Vector.sub(start, delta, end);
        }
        start.add(augment[currentAugmentKey]);
        buffer.push(start.copy());

        // console.log(`start = ${start}, 0 = ${buffer[0]}, end = ${end}`);
       
        if (hit(start)) {
            currentAugmentKey = getNextDirection(currentAugmentKey);
        }
    };

    sketch.setup = () => {
        const c = sketch.createCanvas(canvas_w, canvas_h, p5.WEBGL);
        c.parent('container');
        sketch.fill('white');
        currentAugmentKey = 0;
    };

    sketch.draw = () => {
        sketch.clear();
        update();

        for (let v = 0; v < buffer.length; v++) {
            sketch.point(buffer[v].x, buffer[v].y);
        }
    };
});