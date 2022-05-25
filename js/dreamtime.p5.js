import p5 from 'p5';
import { init as initMidi } from 'Utils/MidiTR8';
import { ShadedEllipse } from 'Framework/ellipseShader';
import { CircleGroup } from 'Framework/CircleGroup';
import { CurvedLineGroup } from 'Framework/LineGroup';
import { BackgroundGradient } from './myLib/BackgroundGradient';
import { FogShader } from 'Framework/FogShader';
import { Droplets } from 'Framework/Droplets';

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
  let bgGradient, fogGradient;

  // for ellipses
  let sphereShader1, sphereShader2;
  const ellipses = [];

  // for rising circles
  const circles = [];
  let newestCircle = 0;
  const circlesCount = 3;

  // for droplets
  const droplets = [];
  const dropletsCount = 2;

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

  const onControlChange = (type, key, velocity) => {
    console.log(key, type, velocity);
    if (key === 19) {
      fogGradient.setColor([velocity/127, velocity/127, velocity/127]);
    }
  }

  sk.preload = function () {
    initMidi({ onControlChange, instHandlers: { onSD, onRC, onMT } });
    bgGradient = new BackgroundGradient('shaders/standard.vert', 'shaders/colorClouds.frag', sk);
    fogGradient = new FogShader(sk);
    //sphereShader1 = sk.loadShader('shaders/standard.vert', 'shaders/colorClouds.frag');
    //sphereShader2 = sk.loadShader('shaders/standard.vert', 'shaders/colorClouds.frag');
  }

  sk.setup = function() {
    sk.createCanvas(sk.windowWidth, sk.windowHeight, sk.WEBGL);
    sk.pixelDensity(1);
    sk.noStroke();
    //sk._renderer.drawingContext.disable(sk._renderer.drawingContext.DEPTH_TEST);

    setupCurvedLine();
    // setupEllipses();
    setupCircles();

    setupDroplets();
  }

  const setupCurvedLine = () => {
    curvedLine = new CurvedLineGroup({ len: 100, sk, centerX: sk.width/2, centerY: sk.height/2, xRadius: 200, yRadius: 300 });
  }

  const setupCircles = () =>  {
    circles.push(...Array.from(Array(circlesCount), () => Object.assign({}, CircleGroup, { sk })));
  }

  const setupDroplets = () => {
    droplets.push(...Array.from(Array(dropletsCount), () => new Droplets(sk)));
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

  const drawDroplets = () => {
    droplets.forEach((d) => d.draw());
  }

  sk.draw = function() {
    // sk.background(237, 34, 93);
    sk.background(0);
    sk.noStroke();

    sk.fill(0, 255, 0);

    sk.blendMode(sk.BLEND);    
    drawBackgroundGradient();

    // drawEllipses();
    drawCurvedLine();
    drawCirclesRising();
    drawDroplets();
    fogGradient.draw();
    
  }

  sk.keyPressed = () => {
    switch(sk.key) {
      case 'r':
        fogGradient.setColor([1.0, 0., 0.]);
        break;
      case 'R':
        fogGradient.setColor([-1.0, 0., 0.]);
        break;
      case 'g':
        fogGradient.setColor([0.0, 1., 0.]);
        break;
      case 'G':
        fogGradient.setColor([0.0, -1., 0.]);
        break;
      case 'b':
        fogGradient.setColor([0.0, 0., 1.]);
        break;
      case 'B':
        fogGradient.setColor(0.0, 0., -1.);
        break;
      case 'v':
        v -= 1;
        break;
      case 'V':
        v += 1;
        break;
    }
  }
}, document.querySelector('#container'));


