"use strict";

require("p5");

var canvas,
    zVal = 1000;

window.setup = function () {
  canvas = createCanvas(600, 400, WEBGL);
  background('blue');
  stroke(255);
  perspective();
};

window.draw = function () {
  clear();
  stroke('white');
  line(-width / 2, 0, 0, 0);
  stroke('orange');
  line(-width / 2, -height / 2, 0, 0);
  stroke('red');
  line(width / 2, height / 2, 0, 0);
  stroke('yellow');
  line(-width / 2, height / 2, 0, 0);
  stroke('green');
  line(width / 2, -height / 2, 0, 0);
  fill(200, 200, 200, 200);
  stroke(0); // quad(-width/2, -height/2, 
  //     width/2, -height/2,
  //     width/2, height/2,
  //     -width/2, height/2,
  //     zVal, zVal, zVal, zVal);
  // quad(-100, -100,
  //     100, -100,
  //     100, 100,
  //     -100, 100);

  stroke('green');
  line(-100, -100, 100, -100);
  line(100, -100, 100, 100);
  line(100, 100, -100, 100);
  line(-100, 100, -100, -100);
  stroke('black');
  push();
  translate(0, 0, zVal);
  quad(-100, -100, 100, -100, 100, 100, -100, 100);
  pop();
  console.log(zVal);
};

window.mouseMoved = function () {
  zVal = (mouseX - width / 2) * -10;
};