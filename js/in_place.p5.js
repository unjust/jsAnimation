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

  const instanceNum = 300;
  let marioBox;

  sk.preload = () => {
    debugger
    marioBox = sk.loadImage('img/mariobw.png');
  };

  sk.setup = () => {

    sk.createCanvas(1280, 720, sk.WEBGL);
    //createEasyCam.bind(sk)();

    for (let i = 0; i < instanceNum; i++) {
      objects.push(new Cube(40, 0, 0, 0));
      objects.push(new Cone(20, 40, 0, 0, 0));
      objects.push(new Objekt("sphere", 20, 20, 0, 0, 0, { stroke: 'white', fill: 'white' }));
    }
    sk.changeShape();
  };

  sk.keyPressed = () => {
    sk.changeShape();
  };

  sk.changeShape = () => {
    if (shapeNum == objectTypes - 1) {
      shapeNum = 0;
    } else {
      shapeNum++;
    }
  };

  sk.update = () => {
    counter+=0.5;
  };

  sk.draw = () => {

    sk.clear();
    sk.translate(-sk.width/2, -sk.height/2);
    sk.noStroke();
    sk.rotate(10, sk.createVector(1, 0, 0));
   
    sk.update();

    const DIM = 80;

    let y = 0;
    for (
      let i = shapeNum, rowCount = 0;
      i < objects.length; 
      i+=3, rowCount++) {
      let x = DIM * rowCount;
      
      if (x > sk.width) {
        y += DIM;
        rowCount = 0;
      }
      // console.log(x, y);
      sk.push();
      sk.translate(x, y);
      sk.rotate(counter, sk.createVector(0, 1, 0));
      
      objects[i].draw();
      
      sk.pop();
    }
  };
});
