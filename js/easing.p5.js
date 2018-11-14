import p5 from 'p5';

new p5((sk) => {
    const easings = [
        (posNow=0, posEnd=0, i) => posNow + ((posEnd - posNow) * ( 1 / ( i * 2 ) )),
        (posNow=0, posEnd=0, i) => posNow + ((posEnd - posNow) * ( 1 / ( i * 3 ) )),
        (posNow=0, posEnd=0, i) => posNow + ((posEnd - posNow) * ( 1 / ( i * 5 ) )),
        (posNow=0, posEnd=0, i) => posNow + ((posEnd - posNow) * ( 1 / ( i * 7 ))),
        (posNow=0, posEnd=0, i) => posNow + ((posEnd - posNow) * ( 1 / ( i*i * 2 ) )),
        (posNow=0, posEnd=0, i) => posNow + ((posEnd - posNow) * ( 1 / ( 1+i*i * 3 ) )),
        (posNow=0, posEnd=0, i) => posNow + ((posEnd - posNow) * ( 1 / ( i*i * 4 ) )),
        (posNow=0, posEnd=0, i) => posNow + ((posEnd - posNow) * ( 1 / ( i*i * 5 ))),
        (posNow=0, posEnd=0, i) => posNow + ((posEnd - posNow) * 2 ),
        (posNow=0, posEnd=0, i) => posNow + ((posEnd - posNow) * 2 ),
        (posNow=0, posEnd=0, i) => posNow + ((posEnd - posNow) * 2 ),
        (posNow=0, posEnd=0, i) => posNow + ((posEnd - posNow) * 2 ),
    ]

    const dim = 30;
    const radius = dim/2;
    const x_positions = easings.map(() => radius);

    let side = 0;

    sk.setup = () => {
        sk.createCanvas(800, 400);
        sk.background(0);
    };

    sk.draw = () => {
        // sk.background(0);

        const dest = side === 0 ? radius : sk.width - radius;
        easings.forEach((easingFn, i) => {
            sk.fill(255 - i * 10); 
            let new_pos_x = easingFn(x_positions[i], dest, i+1);
            sk.ellipse(new_pos_x, dim/2 + (i * dim), dim, dim);
            x_positions[i] = new_pos_x;
        });
    }

    sk.mousePressed = () => {
        // switchSide
        side = (side === 0) ? 1 : 0;
    }

    console.log(((d = new Date()) => `${d.getHours()}:${d.getMinutes()}`)());

}, document.getElementById("container"));