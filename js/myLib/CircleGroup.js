export const CircleGroup = {
  x: 400,
  y: 800,
  latestPosition: { x: 0, y: 200 },
  circleCount: 5,
  sk: null,
  counter: 0.0,
  alphaCounter: 0.0,
  getAlphaCounter: function() {
    return (this.alphaCounter < 1.0) ? this.alphaCounter += 0.01 : this.alphaCounter = 1.0;
  },
  size: 100,
  spacing: 20,
  startAlpha: 200,
  alpha: 255,
  speed: 30,
  ease: (x) => (x === 0) ? 0 : Math.pow(2, 10 * x - 10), // Math.sin((x * Math.PI) / 2), 
  setLatestPosition: function({ x, y }) {
    this.latestPosition = {x, y};
  },
  show: function({ x, y }) {
    // if shown and on screen
    if (this.alpha > 0 && this.tailendPosition.y > 0) {
      return;
    }

    if (this.tailendPosition.y < 0) {
      // if its travelled past the top
      // assign new positions
      this.x = x; 
      this.y = y;
    } else {
      // just start where we left off
      this.x = this.latestPosition.x;
      this.y = this.latestPosition.y;
      console.log(`starting where we left off lastPosition.y ${this.latestPosition.y}`)
    };

    this.alpha = this.startAlpha;
    this.alphaCounter = 0.0;
    console.log("RESET ***********");
    this.counter = 0.0; // reset motion counter
  },
  draw: function() {
    const sk = this.sk;
    const color = this.sk.color(100, 0, 0);
    sk.push();
    sk.translate(-sk.width/2, -sk.height/2);
    if (this.alpha > 2.0) { // while we can still see the circles
      const ac = this.getAlphaCounter();
      for (let i = 0; i < this.circleCount; i++) {
        // we want the lowest one to reduce is alpha the fastest
        const alphaDiff = this.startAlpha/(i + 1) * this.ease(ac * (i + 1)) ;
        console.log(`alphaDiff for ${i} is ${alphaDiff}`);
        const alpha = this.startAlpha/(i + 1) - alphaDiff; // reduce alpha exponentially
        color.setAlpha(alpha);
        this.sk.fill(color);
        
        const x = this.x;
        // y is greater as we go lower, so the first one we are drawing
        // i = 0 will have the least y (this.circleCount - i)
        const y = this.y - (this.spacing * (this.circleCount - i) + (this.counter * this.speed));
        this.sk.circle(x, y, this.size);
    
        if (i === 0) {
          this.setLatestPosition({ x, y });
          this.alpha = alpha;
        } else if (i === this.circleCount - 1) {
          this.tailendPosition = { x, y: y + this.size/2 };
        }
      }
      // once alpha is 0, counter should freeze
      // console.log('update counter ' + this.counter);
      this.counter += 0.008;
    } else {
      this.alpha = 0;
    }
    sk.pop();
  }
}
