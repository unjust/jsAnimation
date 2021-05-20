import p5 from 'p5';
// import Glitch from 'p5.glitch';
// import { Glitch } from "Libraries/p5.glitch.js";
import 'Libraries/p5.glitch.js';

new p5((sk) => {

  let imgs = [];
  const dim = 400;
  let myGlitch;
  const cb = (im) => myGlitch.loadImage(im);

  sk.setup = () => {
    myGlitch = new Glitch(sk);
    console.log(myGlitch);
    sk.createCanvas(sk.windowWidth, sk.windowHeight); //  /*sk.WEBGL*/
    imgs = [
      sk.loadImage('img/100kb/2.jpg', cb),
      sk.loadImage('img/100kb/3.jpg', cb),
      sk.loadImage('img/100kb/n3t4.jpg', cb),
      sk.loadImage('img/100kb/n3t4_2.jpg', cb),
      sk.loadImage('img/100kb/n3t4_3.jpg', cb),
      sk.loadImage('img/100kb/n3t4_4.jpg', cb)
    ]
  };

  sk.draw = () => {
    myGlitch.resetBytes();

    myGlitch.replaceBytes(10, 104); // swap all decimal byte 100 for 104
    myGlitch.randomBytes(1); // add one random byte for movement

    myGlitch.buildImage();
    

    imgs.forEach((img, i) => sk.image(myGlitch.image, i * dim, 0));
  };
});
