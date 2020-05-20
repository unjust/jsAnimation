import p5 from 'p5';


class Band {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  setColor(c) {
    this.color = c;
  }

  isMouseOver(mx, my) {
    if ((mx  > this.x || mx < this.x + this.width) &&
      (my > this.y || my < this.y + this.height)) {
        //console.log('me', this.y);
        return true;
    }
    return false;
  }

  draw(sk) {
    // sk.fill(sk.color(255,20,10));
    //console.log('mycolor is', this.color);
    sk.rect(this.x, this.y, this.width, this.height);
  }
}
new p5((sk) => {

  const bands = [];
  let colors = [];
  let bandCount = 10;
  let canvasWidth, canvasHeight;
  let counter = 0;

  sk.setup = () => {
    const cnv = sk.createCanvas(400, 400, sk.WEBGL);
    sk.windowResized();
    initBands();
    initColors();
    console.log('bands of color that breathe and change with mouse position');
    cnv.mouseOver(() => console.log('overrrr'));
    sk.colorMode(sk.HSB);
  };

  const getMainColor = () => Math.ceil(sk.random(10, 255));

  const getColorVariation = (mainHue) => `hsb(${mainHue}, ${Math.ceil(sk.random(10, 100))}%, ${Math.ceil(sk.random(10, 100))}%)`

  const initColors = () => {
    // hsb(160, 100%, 50%)
    const hue = getMainColor();
    colors = [...Array(bandCount + 1).keys()].map(() => {
      const hsb = getColorVariation(hue);
      // console.log('hsb', hsb);
      return sk.color(hsb);
    });
  };

  const initBands = () => {

    const bandHeight = canvasHeight/bandCount;
    ([...Array(bandCount).keys()]).forEach(function(i) {
      bands.push(new Band(0, bandHeight * i, canvasWidth, bandHeight));
    });
  }

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
      // console.log(c1, c2);
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
    bands.forEach((b) => b.isMouseOver(sk.mouseX, sk.mouseY));
  }

  sk.draw = () => {
    counter += .01;
    sk.noStroke();
    sk.push();
    sk.translate(-canvasWidth/2, -canvasHeight/2);
   
    const newColors = tweenColors();
    bands.forEach((band, i) => {
      sk.fill(newColors[i]);
      band.draw(sk);
    });
    sk.pop();

    if (counter >= 1) {
      counter = 0;
    }
  };
});
