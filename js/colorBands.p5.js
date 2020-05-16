import p5 from 'p5';
import { StringKeyframeTrack } from 'three';

new p5((sk) => {

  const bands = [];
  let colors = [];
  let bandCount = 10;
  let canvasWidth, canvasHeight;
  let counter = 0;
  let aColor, bColor;

  sk.setup = () => {
    const cnv = sk.createCanvas(400, 400, sk.WEBGL);
    sk.windowResized();
    initBands();
    console.log('bands of color that breathe and change with mouse position');
    cnv.mouseOver(() => console.log('overrrr'));
    sk.colorMode(sk.HSB);
  };

  const getMainColor = () => Math.ceil(sk.random(10, 255));

  const getColorVariation = (mainHue) => `hsb(${mainHue}, ${Math.ceil(sk.random(10, 100))}%, ${Math.ceil(sk.random(10, 100))}%)`

  const initBands = () => {
    // hsb(160, 100%, 50%)
    const hue = getMainColor();
    colors = [...Array(bandCount + 1).keys()].map(() => {
      const hsb = getColorVariation(hue);
      console.log('hsb', hsb);
      return sk.color(hsb);
    });
  };

  const tweenColors = () => {
    if (counter >= 1) {
      counter = 0;
      colors.shift();
      colors.push(sk.color(getColorVariation(getMainColor())));
      return colors;
    } 

    return colors.map((c1, i, arr) => {
      // console.log('tween colors', counter);
      const c2 = arr[i + 1];
      if (!c2) {
        return;
      }
      console.log(c1, c2);
      return sk.lerpColor(c1, c2, counter);
    });
  }

  sk.windowResized = function() {
    sk.resizeCanvas(sk.windowWidth, 500);
    canvasHeight = sk.height;
    canvasWidth = sk.width;
  }

  sk.mousePressed = function() {
    console.log('pressed');
  }

  sk.mouseMoved = function() {
    console.log('mmmmover');
  }

  sk.draw = () => {
 
    const bandHeight = canvasHeight/bandCount;
    counter += .01;
    sk.noStroke();
    sk.push();
    sk.translate(-canvasWidth/2, -canvasHeight/2);
   
    const newColors = tweenColors();
    for (let b = 0; b < bandCount; b++) {
      sk.fill(newColors[b]);
      sk.rect(0, bandHeight * b, canvasWidth, bandHeight);
    }
    sk.pop();

    if (counter >= 1) {
      counter = 0;
    }
  };
});
