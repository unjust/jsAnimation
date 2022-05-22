import p5 from 'p5';
import { ShadedEllipse } from './ellipseShader';

new p5((sk) => {
  let ellipses = [];
  let sphereShader1, sphereShader2;
  const len = 60,
        buffer = Array.from(Array(len), () => ({ x: 0, y: 0 }));

 
  sk.preload = () => {
    sphereShader1 = sk.loadShader('shaders/standard.vert', 'shaders/colorClouds.frag');
    sphereShader2 = sk.loadShader('shaders/standard.vert', 'shaders/colorClouds.frag');
  }

  sk.setup = () => {
     // disables scaling for retina screens which can create inconsistent scaling between displays
    sk.pixelDensity(1);
    sk.createCanvas(sk.windowWidth, sk.windowHeight, sk.WEBGL);
    

    const ellipse1 = new ShadedEllipse({
      size: [100, 100],
      position: [100, 100],
      sk
    });
    ellipse1.setResolution([sk.width, sk.height]);
    ellipse1.setShader(sphereShader1);
    ellipse1.setTexture(sk.createGraphics(400, 400, sk.WEBGL));
    
    const ellipse2 = new ShadedEllipse({
      size: [140, 140],
      position: [200, 200],
      sk
    })
    ellipse2.setResolution([sk.width, sk.height]);
    ellipse2.setShader(sphereShader2);
    ellipse2.setTexture(sk.createGraphics(400, 400, sk.WEBGL));

    ellipses.push(ellipse1, ellipse2);
    console.info('press s to generate a color at a random origin');
  };

  sk.draw = () => {
    sk.background(0);
    sk.noStroke();
    ellipses.forEach(e => e.draw());

    let newest = sk.frameCount % len;
    // buffer[newest] = { x: sk.mouseX, y : sk.mouseY };

    const t = sk.millis()/500;
    const scale = 2 / (3 - Math.cos(2*t));

    // https://gamedev.stackexchange.com/questions/43691/how-can-i-move-an-object-in-an-infinity-or-figure-8-trajectory
    buffer[newest] = { x: 200 + 200 * Math.cos(t), y: 300 + 200 * Math.sin(2*t) / 2 };
    
    sk.push();
    sk.translate(-sk.width/2, -sk.height/2);
    sk.fill(255, 153);
    sk.stroke(255, 153);
    // buffer[newest] = { x: 200 + 200 * Math.sin(sk.millis()/500), y: 300 + 200 * Math.cos(sk.millis()/500) };
    for (let i = 0; i < len; i++) {
      // which+1 is the smallest (the oldest in the array)
      let index = (newest + 1 + i) % len;
      console.log(index);
      const xy = buffer[index];
      // sk.ellipse(xy.x, xy.y, i, i);
      sk.line(xy.x, xy.y, xy.x + len - 1, xy.y + len - i)
    }
    sk.pop();
  };

  sk.keyTyped = function () {
    if (sk.key === 's') {
      ellipses[0].emitShot();
    }
    if (sk.key === 'y') {
      ellipses[1].emitShot();
    }
  }

}, document.querySelector('#container'));


