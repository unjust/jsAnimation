import p5 from "p5";
import Objekt from "./myLib/Objekt";
import Cube from "./myLib/Cube";
import Cone from "./myLib/Cone";
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";

window.$p5 = new p5((sk) => {
  let shapeNum = 0;
  let objects = [];
  let counter = 0;
  const objectTypes = 3;
  let objekt;

  let rotate = false, warp = false;

  const instanceNum = 300;
  let marioBox;

  sk.preload = () => {
    marioBox = sk.loadImage('img/mariobw.png');
  };

  sk.setup = () => {
    objekt = new Cube(40, 0, 0, 0);
    sk.createCanvas(1280, 720, sk.WEBGL);
   
    for (let i = 0; i < instanceNum; i++) {
      objects.push(new Cube(40, 0, 0, 0));
      objects.push(new Cone(20, 40, 0, 0, 0));
      objects.push(new Objekt("sphere", 20, 20, 0, 0, 0, { stroke: 'white', fill: 'white' }));
    }
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
    objekt.setCounter(counter);
  };

  sk.draw = () => {

    sk.clear();
    sk.translate(-sk.width/2, sk.height/2);
    sk.noStroke();
    sk.rotate(10, sk.createVector(1, 0, 0));
   
    sk.update();

    const DIM = 80;

    // for (
    //   let i = shapeNum, rowCount = 0;
    //   i < objects.length; 
    //   i+=3, rowCount++) {
    //   let x = DIM * rowCount;
      
    //   if (x > sk.width) {
    //     y += DIM;
    //     rowCount = 0;
    //   }
    //   // console.log(x, y);
    //   sk.push();
    //   sk.translate(x, y);
    //   sk.rotate(counter, sk.createVector(0, 1, 0));
      
    //   objects[i].draw();
      
    //   sk.pop();
    // }
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
      
      objekt.draw({ rotate, warp, texture: marioBox });
      // console.log(x, y);
      sk.pop();
    }
    // console.log('----------------------------');
  };
});
