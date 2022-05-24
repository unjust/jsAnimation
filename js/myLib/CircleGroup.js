export const CircleGroup = {
  x: 0,
  y: 200,
  circleCount: 10,
  sk: null,
  counter: 0.0,
  size: 100,
  spacing: 20,
  bAlpha: 200,
  alpha: 255,
  speed: 30,
  ease: (x) => Math.sin((x * Math.PI) / 2), // (x) => x === 0 ? 0 : Math.pow(2, 10 * x - 10),
  reset: function() {
    this.alpha = this.bAlpha;
    this.counter = 0.0;
  },
  draw: function() {
    const color = this.sk.color(100, 0, 0);
    if (this.alpha > 0) {
      for (let i = 0, j = this.circleCount; i < this.circleCount; i++, j--) {
        // we want the lowest one to reduce is alpha the fastest
        this.alpha = this.bAlpha - (this.bAlpha * this.ease(this.counter) * j); // reduce alpha exponentially
        color.setAlpha(this.alpha);
        this.sk.fill(color);
        // y is greater as we go lower, so the first one we are drawing
        //  i = 0 is the lowest one, will have greatest y
        this.sk.circle(this.x, this.y - (this.spacing * i + (this.counter * this.speed)), this.size);
      }
    }
    this.counter < 1.0 ? this.counter += 0.005 : this.counter = 1.0;
  }
}
