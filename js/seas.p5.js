// https://www.youtube.com/watch?v=5lIl5F1hpTE&ab_channel=TheCodingTrain

import p5 from 'p5';

new p5((sk) => {

  let rippleShader;
  let img0, img1;

  sk.preload = () => {
    rippleShader = sk.loadShader('shaders/seas.vert', 'shaders/seas.frag');
  }

  sk.setup = () => {
    sk.createCanvas(400, 400, sk.WEBGL);
    img0 = sk.createImage(400, 400);
    img0.loadPixels();
    for (let i = 0; i < img0.pixels.length; i+=4) {
      img0.pixels[i] = 0;
      img0.pixels[i+1] = 0;
      img0.pixels[i+2] = sk.random(255);
      img0.pixels[i+3] = 255;
    }
    img0.updatePixels();
    sk.pixelDensity(1);
  };

  sk.draw = () => {
    // console.log("reso, ", [sk.width, sk.height])
    rippleShader.setUniform('u_resolution', [sk.width, sk.height]);
    rippleShader.setUniform('u_tex0', img0);
    sk.shader(rippleShader);
    //sk.image(img0, 0, 0);
    //sk.fill(255, 0, 0);
    sk.rect(0,0, sk.width, sk.height);
  };
}, document.querySelector('#container'));


