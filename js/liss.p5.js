// https://www.youtube.com/watch?v=5lIl5F1hpTE&ab_channel=TheCodingTrain

import p5 from 'p5';

new p5((sk) => {

  let theShader, xFactor = 2.0, yFactor = 2.0;

  sk.preload = () => {
    theShader = sk.loadShader('shaders/liss.vert', 'shaders/liss.frag');
  }

  sk.setup = () => {
    sk.createCanvas(400, 400, sk.WEBGL);
    sk.pixelDensity(1);
  };

  sk.keyTyped = () => {
    switch(sk.key) {
      case('x'):
        xFactor -= 1.0;
        break;
      case('X'):
        xFactor += 1.0;
        break;
      case('y'):
        xFactor -= 1.0;
        break;
      case('Y'):
        xFactor += 1.0;
        break;
    }
  }

  sk.draw = () => {
    // console.log("reso, ", [sk.width, sk.height])
    theShader.setUniform('u_resolution', [sk.width, sk.height]);
    theShader.setUniform('u_radius', 0.5);
    theShader.setUniform('u_time', sk.frameCount * 0.01);
    theShader.setUniform('u_xy_factor', [xFactor, yFactor]);
    sk.shader(theShader);
    sk.rect(0,0, sk.width, sk.height);
  };
}, document.querySelector('#container'));


