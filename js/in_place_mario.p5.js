import p5 from "p5";
import Objekt from "./myLib/Objekt";
import Cube from "./myLib/Cube";
import Cone from "./myLib/Cone";
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";

window.$p5 = new p5((sk) => {
  let shapeNum = 0;
  let counter = 0;
  const objectTypes = 3;
  let marioBox;

  let rotate = false, warp = false;

  let marioImage;

  sk.preload = () => {
    marioImage = sk.loadImage('img/mariobw.png');
  };

  sk.setup = () => {
    marioBox = new Cube(sk, { side: 40 });
    sk.createCanvas(1280, 720, sk.WEBGL);
    sk.changeShape();
    createEasyCam.bind(sk)();
  };

  sk.keyPressed = () => {
    sk.changeShape();
    rotate = !rotate;
    warp = !warp;
  };

  sk.changeShape = () => {
    if (shapeNum == objectTypes - 1) {
      shapeNum = 0;
    } else {
      shapeNum++;
    }
  };

  sk.update = () => {
    counter += 0.05;
    marioBox.setCounter(counter);
  };

  sk.draw = () => {

    sk.clear();
    sk.translate(-sk.width/2, sk.height/2);
    sk.noStroke();
    sk.rotate(10, sk.createVector(1, 0, 0));
   
    sk.update();

    const DIM = 80;
    for (
      let i = 0, 
          x = 0, 
          y = 0, 
          colCount = sk.width / DIM;
      i < (sk.width * sk.height) / (DIM * DIM); 
      x += DIM, i++) {
      
      if (i > 0 && i % colCount == 0) {
        y += DIM;
        x = 0;
      }
      // console.log(x, y);
      sk.push();
      sk.translate(x, y);
      // sk.rotate(counter, sk.createVector(0, 1, 0));
      
      marioBox.draw({ rotate, warp, texture: marioImage });
      // console.log(x, y);
      sk.pop();
    }
    // console.log('----------------------------');
  };
});
