import { accessMIDI } from "Utils/Midi.js"
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';

// 137, 153 ch 10 note on/off 
// https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes
const TR8s = {
 36: 'BD',
 38: 'SD',
 43: 'LT',
 47: 'MT',
 50: 'HT',
 37: 'RS',
 39: 'HC',
 42: 'CH',
 46: 'OH',
 49: 'CC',
 51: 'RC',
}

const colors = {
  36: 'red',
  38: 'yellow',
  43: 'navy',
  47: 'blue',
  50: 'cyan',
  37: 'orange',
  39: 'pink',
  42: 'white',
  46: 'grey',
  49: 'black',
  51: 'purple',
 }

// 185 is control change channel 10

new p5((sk) => {

  const cellWidth = 40, cellHeight = 40;
  let gridLength = 0, replaceIndex = 0;
  const shapeQueue = [], noteQueue = [];

  sk.preload = () => {}

  sk.setup = () => {
    sk.createCanvas(800, 400, sk.WEBGL);
    console.log('hey sound defined?', sk.midiToFreq);
    accessMIDI(onMidi);
    gridLength = sk.width/cellWidth * sk.height/cellHeight;
    //const cells = Array.from(Array(queueLength), x => 0);
    //shapeQueue.push(...cells);
    // Array.prototype.eventPush = function(item, cb) {
    //   this.push(item);
    //   cb(this);
    // }
  };

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
    if (type !== 185) {
      // console.log(type, key, velocity);
    }

    switch(type) {
      case 137:
        // ch 10 note on
        noteQueue.push(key);
        addShapes();
        break;
      case 153:
        // ch 10 note off
      default:
        break;
    }
    const freq = sk.midiToFreq(key);
  }

  const incIndex = (array) => {

  }

  const addShapes = () => {
    if (shapeQueue.length < gridLength) {
      // while there are spaces to fill, fill up our shapes
      while (noteQueue.length > shapeQueue.length) {
        // determine shape
        // console.log('while');
        const value = colors[noteQueue[shapeQueue.length]];
        shapeQueue.push(value)
      }
    } else {
      const value = colors[noteQueue[noteQueue.length - 1]];
      // console.log('shift')
      // shapeQueue.unshift(value);
      shapeQueue[replaceIndex] = value;
      replaceIndex = replaceIndex < gridLength ? replaceIndex + 1 : 0;
    }
  }

  sk.draw = () => {
    
    const cellsX = (sk.width/cellWidth);
    const cellsY = (sk.height/cellHeight);
    // divide the canvas into a grid
    // with every new note, select a shape and put it in the next spot on the grid
    // when done with last row and last column, restart
    sk.push();
    sk.translate(-sk.width/2, -sk.height/2);
    shapeQueue.forEach((el, i, arr) => {
      sk.fill(el);
      sk.circle((i % cellsX) * cellWidth, Math.floor(i/cellsX) * cellHeight, cellWidth / 2)
    });
    sk.pop();
  };

  
}, document.querySelector('#container'));


