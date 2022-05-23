import p5 from 'p5';
import { init as initMidi } from 'Utils/MidiTR8';
import { ShadedEllipse } from 'Framework/ellipseShader';

// lines curve play only when SD sound tones
// one globe for RC - deep bass
// globes rise with LT, CC strings 
// leaves or transparent forms fir MT 
// HT lines high pitched
// hC clock line ticking sound

new p5((sk) => {

  // for line animation
  const len = 60;
  const lineBuffer = Array.from(Array(len), () => ({ x: 0, y: 0 }));
  let newest = 0;
  let drawLine = false;
  let toID = -1;

  // for gradient clouds
  let gradientShader, bgTexture;
  let bgTrigger = 0.0, counter = 0.0;
  let pointA, pointB, pointC, pointD;
  let colorA = [Math.random(), Math.random(), Math.random()], 
      colorB = [Math.random(), Math.random(), Math.random()];

  // for ellipses
  let sphereShader1, sphereShader2;
  const ellipses = [];

  const onSD = (type, velocity) => {
    if (type === "noteon") {
      drawLine = true;
      //console.log('clear', toID);
      clearTimeout(toID);
    } else if ("noteoff") {
      toID = setTimeout(() => {
        drawLine = false;
      }, 2000)
    }
  }

  const onRC = (type, velocity) => {
    if (type === "noteon") {
      // set trigger on shader color
      bgTrigger = incrementUntil(bgTrigger);
      pointA = p5.Vector.random2D();
      pointA.add([1, 1]);
      pointA.div(2);
      pointB = p5.Vector.random2D();
      pointB.add([1, 1]);
      pointB.div(2);
      pointC = p5.Vector.random2D();
      pointC.add([1, 1]);
      pointC.div(2);
      pointD = p5.Vector.random2D();
      pointD.add([1, 1]);
      pointD.div(2);
      // console.log(pointA, pointB, pointC, pointD);
      counter = 0.0;
    }
  }

  const onMT = (type) => {
    if (type === "noteon" && ellipses.length) {
      ellipses[0].emitShot();
    }
  }

  sk.preload = function () {
    initMidi({ instHandlers: { onSD, onRC, onMT } });
    gradientShader = sk.loadShader('shaders/standard.vert', 'shaders/colorClouds.frag');
    sphereShader1 = sk.loadShader('shaders/standard.vert', 'shaders/colorClouds.frag');
    sphereShader2 = sk.loadShader('shaders/standard.vert', 'shaders/colorClouds.frag');
  }

  sk.setup = function() {
    sk.createCanvas(sk.windowWidth, sk.windowHeight, sk.WEBGL);
    sk.pixelDensity(1);
    sk.noStroke();

    bgTexture = sk.createGraphics(sk.windowWidth, sk.windowHeight, sk.WEBGL);
    bgTexture.noStroke();

    setupEllipses();
  }

  const setupEllipses = () => {
    
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
  }

  const incrementUntil = (val, limit=Math.PI) => {
    if (val < limit) {
      val += 0.05;
    } else {
      return 0.0;
    }
    return val;
  }

  const drawBackgroundGradient = () => {
    if (bgTrigger === 0.0) {
      return;
    }
   
    bgTrigger = incrementUntil(bgTrigger);
    // (counter < 1.0) ? counter += 0.01 : counter = 1.0;
    counter = 1.0;
    const originA = p5.Vector.lerp(pointA, pointB, counter).array();
    const originB = p5.Vector.lerp(pointC, pointD, counter).array();

    gradientShader.setUniform('u_time', bgTrigger); // this isnt time exactly
    gradientShader.setUniform('u_resolution', [sk.width, sk.height]);
    gradientShader.setUniform('u_originA', [originA[0], originA[1]]);
    gradientShader.setUniform('u_originB', [originB[0], originB[1]]);
    gradientShader.setUniform('u_vector1', colorA);
    gradientShader.setUniform('u_vector2', colorB);

    // CRUCIAL STEP THAT I DONT UNDERSTAND
    bgTexture.shader(gradientShader);
    bgTexture.rect(0, 0, sk.width, sk.height);
    
     /* when you put a texture or shader on an ellipse it is rendered in 3d,
     so a fifth parameter that controls the # vertices in it becomes necessary,
     or else you'll have sharp corners. setting it to 100 is smooth. */
    // let ellipseFidelity = int(map(mouseX, 0, width, 8, 100));
    sk.push();
    sk.translate(-sk.width/2, -sk.height/2);
    sk.texture(bgTexture);

    sk.rect(0, 0, sk.width, sk.height);
    sk.pop();
  }

  const drawCurvedLine = function() {
    const t = sk.millis()/500;
    // const scale = 2 / (3 - Math.cos(2*t));

    // https://gamedev.stackexchange.com/questions/43691/how-can-i-move-an-object-in-an-infinity-or-figure-8-trajectory
    newest = sk.frameCount % len;
      
    if (drawLine) {
      lineBuffer[newest] = { x: 200 + 200 * Math.cos(t), y: 300 + 200 * Math.sin(2*t) / 2 };
    } else {
      lineBuffer[newest] = undefined;
    }

    sk.push();
    sk.translate(-sk.width/2, -sk.height/2);

    sk.fill(255, 153);
    sk.stroke(255, 153);
    for (let i = 0; i < lineBuffer.length; i++) {
      // which+1 is the smallest (the oldest in the array)
      let index = (newest + 1 + i) % lineBuffer.length;
      const xy = lineBuffer[index];
      // sk.ellipse(xy.x, xy.y, i, i);
      if (xy) {
        sk.line(xy.x, xy.y, xy.x + lineBuffer.length - 1, xy.y + lineBuffer.length - i);
      }
    }
    sk.pop();
  }

  const drawEllipses = () => {
    ellipses.forEach(e => e.draw());
  }

  sk.draw = function() {
    // sk.background(237, 34, 93);
    sk.background(0);
    sk.noStroke();
    drawBackgroundGradient();
    drawEllipses();
    drawCurvedLine();
  }
}, document.querySelector('#container'));
