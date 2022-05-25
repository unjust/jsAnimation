import p5 from 'p5';
import { init as initMidi } from 'Utils/MidiTR8';
import { ShadedEllipse } from 'Framework/ellipseShader';
import { CircleGroup } from 'Framework/CircleGroup';
import { CurvedLineGroup } from 'Framework/LineGroup';
import { BackgroundGradient } from './myLib/BackgroundGradient';
// lines curve play only when SD sound tones
// one globe for RC - deep bass
// globes rise with LT, CC strings 
// leaves or transparent forms fir MT 
// HT lines high pitched
// hC clock line ticking sound

new p5((sk) => {

  // for line animation
  let drawLine = false;
  let curvedLine;
  let toID = -1;

  // for gradient clouds
  let bgGradient;

  // for ellipses
  let sphereShader1, sphereShader2;
  const ellipses = [];

  // for rising circles
  let circles;
  let newestCircle = 0;
  const circlesCount = 3;

  const onSD = (type, velocity) => {
    if (type === "noteon") {
      drawLine = true;
      //console.log('clear', toID);
      clearTimeout(toID);
    } else if ("noteoff") {
      toID = setTimeout(() => {
        drawLine = false;
      }, 3000)
    }
  }

  const onRC = (type, velocity) => {
    if (type === "noteon") {
      // set trigger on shader color
      bgGradient.trigger();
    }
  }

  const onMT = (type) => {
    if (type === "noteon" && ellipses.length) {
      ellipses[0].emitShot();
    }
    if (type === "noteon") {
      let i = newestCircle % (circlesCount - 1);
      circles[i].show({ x: Math.random() * sk.width, y: sk.random(0.5, 1) * sk.height });
      newestCircle += 1;
    }
  }

  sk.preload = function () {
    initMidi({ instHandlers: { onSD, onRC, onMT } });
    bgGradient = new BackgroundGradient('shaders/standard.vert', 'shaders/colorClouds.frag', sk);
    //sphereShader1 = sk.loadShader('shaders/standard.vert', 'shaders/colorClouds.frag');
    //sphereShader2 = sk.loadShader('shaders/standard.vert', 'shaders/colorClouds.frag');
  }

  sk.setup = function() {
    sk.createCanvas(sk.windowWidth, sk.windowHeight, sk.WEBGL);
    sk.pixelDensity(1);
    sk.noStroke();

    setupCurvedLine();
    // setupEllipses();
    setupCircles();
  }

  const setupCurvedLine = () => {
    curvedLine = new CurvedLineGroup({ len: 100, sk, centerX: sk.width/2, centerY: sk.height/2, xRadius: 200, yRadius: 300 });
  }

  const setupCircles = () =>  {
    circles = Array.from(Array(circlesCount), () => Object.assign({}, CircleGroup, { sk }));
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
    bgGradient.draw();
  }

  const drawCurvedLine = () => {
    curvedLine.draw(drawLine);
  }

  const drawEllipses = () => {
    ellipses.forEach(e => e.draw());
  }

  const drawCirclesRising = () => {
    circles.forEach((c) => c.draw());
  }

  sk.draw = function() {
    // sk.background(237, 34, 93);
    sk.background(0);
    sk.noStroke();

    sk.fill(0, 255, 0);
    drawBackgroundGradient();

    // drawEllipses();
    drawCurvedLine();
    drawCirclesRising();
  }

  sk.keyTyped = function() {
    if (sk.key === 'm') {
      let i = newestCircle % (circlesCount - 1);
      circles[i].x = ((Math.random() * 2) - 1) * sk.width/2;
      circles[i].y = ((Math.random() * 2) - 1) * sk.height/2;
      circles[i].show();
      newestCircle += 1;
    }
  }
}, document.querySelector('#container'));


