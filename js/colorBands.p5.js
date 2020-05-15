import p5 from 'p5';
import { StringKeyframeTrack } from 'three';

new p5((sk) => {

  const bands = [];
  let colors = [];
  let bandCount = 10;
  let canvasWidth, canvasHeight;
  let counter = 0;

  sk.setup = () => {
    sk.createCanvas(400, 400, sk.WEBGL);
    sk.windowResized();
    initBands();
    console.log('bands of color that breathe and change with mouse position');
  };

  const initBands = () => {
    colors = [...Array(bandCount + 1).keys()].map(() => {
      return sk.color(sk.random(255), sk.random(255), sk.random(255), 255);
    });
  };

  const tweenColors = () => {
    if (counter >= 1) {
      counter = 0;
      initBands();
      return;
    } 
    colors.forEach((c, i, arr) => {
      const c2 = arr[i + 1];
      if (!c2) {
        return;
      }
      return sk.lerpColor(c, c2, counter);
    });

  }

  sk.windowResized = function() {
    sk.resizeCanvas(sk.windowWidth, 500);
    canvasHeight = sk.height;
    canvasWidth = sk.width;
  }

  sk.draw = () => {
    sk.push();
    sk.translate(-canvasWidth/2, -canvasHeight/2);
    const bandHeight = canvasHeight/bandCount;
    counter += .01;
    tweenColors();
    for (let b = 0; b < bandCount; b++) {
      sk.fill(colors[b]);
      sk.rect(0, bandHeight * b, canvasWidth, bandHeight);
    }
    sk.pop();
  };
});
