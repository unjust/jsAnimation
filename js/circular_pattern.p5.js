import p5 from 'p5';
import Liss from 'Framework/Lissajous';

window.$p5 = new p5((sk) => {
  let dim = 60;
  let cols, rows;
  let lissArray = [];
  let speed = 1;

  sk.setup = () => {
    sk.createCanvas(dim*16, dim*9, sk.WEBGL);
    cols = Math.floor(sk.width / dim),
    rows = Math.floor(sk.height / dim);

    for (let i = 0; i < cols * rows; i++){
      const liss = new Liss();
      liss.id = i;
      liss.verticesTail = 20;
      liss.xFactor = 1;
      liss.yFactor = 1;
      liss.zFactor = 1;
      liss.radius = dim/2;
      lissArray.push(liss);
      liss.setSpeed((speed + 1 * i)/1000);
    }

    console.log('circular pattern based on lissajous');
    console.log('press f for faster and s for slower pattern speed');
  }


  sk.update = () => {
    // liss.update();
  }

  sk.keyPressed = () => {
    if (!(sk.key == 'f' || sk.key == 's')) {
      return;
    }
    if (sk.key == 'f') {
      speed += 10;
    }
    else if (sk.key == 's') {
      speed -= 10;
    }
    lissArray.forEach((l) => {
      const newSpeed = (speed + (1 * l.id))/1000;
      //console.log(newSpeed);
      l.setSpeed(newSpeed)
    });
  }

  sk.draw = () => {
    sk.background('black');
    sk.translate(-sk.width/2, -sk.height/2)
    sk.update();
    for (let i = 0,
      x = 0,
      y = 0; 
      i < cols * rows;
      x += dim,
      i++) 
    {
      if (i > 0 && i % cols == 0) {
        x = 0;
        y += dim;
      }
      sk.push();
      sk.translate(x + dim/2, y + dim/2);
      lissArray[i].draw();
      sk.pop();
    }
  }
});


