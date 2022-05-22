import p5 from 'p5';
import Lissajous from 'Framework/Lissajous';
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";
import { accessMIDI } from "Utils/Midi.js"
import 'p5/lib/addons/p5.sound';

window.$p5 = new p5((sk) => {
  let liss, cam;

  // controls
  let xFactor = 0, 
      yFactor = 0,
      height,
      radius;

  const base = {
    id: 1,
    x: 1,
    y: 1,
    s: 0.1,
    r: 30
  }

  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight, sk.WEBGL);
    accessMIDI(onMidi);

    height = Math.min(sk.windowHeight/4, 400);
    radius = Math.min(sk.windowWidth/3, 200);

    liss = new Lissajous();
    liss.verticesTail = 600;
    liss.setColor('rgba(255, 0, 0, 0.25)');
    
    liss.xFactor = xFactor; // should go 1-16
    liss.yFactor = yFactor;
    liss.zFactor = 1;
    liss.radius = 200; // radius;
    liss.setSpeed(.2)

    console.log('centered lissajous form. use keys or touches to change it.');
    console.log('X x Y y H h to affect xFactor yFactor and height');
    console.log('f or s faster and slower');
  }

  sk.keyTyped = () => {
    if (sk.key == 'r') {
      cam.reset();
    }

    if (sk.key === 'l') {
      liss.setSpeed(base.s);
      liss.xFactor = (base.x);
      liss.yFactor = (base.y);

      base.id += 1;
      base.x = (base.x % 16) ? base.x + 1 : 1;
      base.y = (base.x % 16) ? base.y : base.y + 1;
      base.s = base.s + 0.1;
      printLiss(liss);
      return;
    }

    switch (sk.key) {
      case 'x':
        xFactor--;
        break;
      case 'X':
        xFactor++;
        break;
      case 'y':
        yFactor--;
        break;
      case 'Y':
        yFactor++;
        break;
      case 'h':
        height -= 10;
        break;
      case 'H':
        height += 10;
        break;
      case 'f':
        liss.setSpeed(liss.speed + 0.1);
        break;
      case 's':
        liss.setSpeed(liss.speed - 0.1);
        break;
      default:
        break;
    }

    liss.xFactor = xFactor;
    liss.yFactor = yFactor;
    liss.height = height;
    printLiss(liss);
  }

  sk.windowResized = () => {
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
  }

  const onMidi = function(msg) {
    const [ type, key, velocity ] = msg.data;
    
    if (!key) {
      return;
    }
    // const [ type, key, velocity ] = msg.data;
    // console.log(msg.data)
    // https://code.tutsplus.com/tutorials/introduction-to-web-midi--cms-25220
    // 144 is note on
    // 176 - 191 is control change https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes

    console.log('midi: ', type, key, velocity);
   
    // if (key % 3 === 0) {
    //   liss.xFactor = velocity/3;
    // } else if (key % 2 === 0) {
    //   liss.yFactor = velocity/2.0;
    // } else {
    //   liss.setSpeed(velocity/100);
    // }
    if (key % 3 === 0) {
      liss.xFactor = key/3;
    } else if (key % 2 === 0) {
      liss.yFactor = key/2.0;
    } else {
      liss.setSpeed(velocity/100);
    }
    printLiss(liss);
  }

  const printLiss = (liss) => {
    console.log(`xfactor ${liss.xFactor} yfactor ${liss.yFactor} s ${liss.speed} i ${base.id}`);
  }

  sk.draw = () => {
    sk.background('black');
  
    sk.push();
    liss.draw(sk.LINES);
    sk.pop();
  }
}, document.querySelector('#container'));


