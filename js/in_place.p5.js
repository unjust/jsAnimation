import p5 from "p5";
import Objekt, { shapeTypes } from "./myLib/Objekt";
import { getTiledCoordinates } from "./myLib/position";

window.$p5 = new p5((sk) => {
  let counter = 0;
  let shapeNum = 0;
  let objects = [];
  const instanceNum = 200;
  const DIM = 30, PAD = 40;

  sk.preload = () => {
    // preload images here
  };

  sk.setup = () => {
    sk.createCanvas(1020, 720, sk.WEBGL);
    for (let i = 0; i < instanceNum; i++) {
      objects.push(
        new Objekt( shapeTypes[0], DIM, DIM, 0, 0, 0, { stroke: 'black', fill: 'white' })
      );
    }
    console.log("objekt drawing demo. press any key to change shapes")
  };

  sk.keyPressed = () => {
    sk.changeShape();
  };

  sk.changeShape = () => {
    shapeNum = (shapeNum == shapeTypes.length - 1) ? 0 : ++shapeNum;
    objects.forEach((obj) => obj.setShapeType(shapeTypes[shapeNum]));
  };

  sk.update = () => {
    counter += 0.1;
  };

  sk.draw = () => {
    sk.clear();
    sk.translate(-sk.width/2, -sk.height/2);
    sk.noStroke();
    sk.update();
    for (let i = 0; i < objects.length; i++) {
      const { x, y } = getTiledCoordinates(i, DIM + PAD, DIM + PAD, sk.width, sk.height);
      sk.push();
      sk.translate(x, y);
      sk.rotate(counter, sk.createVector(0, 1, 0));
      objects[i].draw();    
      sk.pop();
    }
  };
});
