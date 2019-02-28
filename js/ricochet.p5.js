import p5 from 'p5';

new p5((sketch) => {
  const canvas_w = 800,
      	canvas_h = 600;
  const vel = 10;
  const directions = [
		sketch.createVector(1 * vel, 1 * vel),
		sketch.createVector(-1 * vel, 1 * vel),
		sketch.createVector(1 * vel, -1 * vel),
		sketch.createVector(-1 * vel, -1 * vel)];
  /**
   * @function hit
   * @param {Vector} v 
   * @returns {Boolean} whether or not vector has hit the wall
   */

  const hit = (v) => v.x >= canvas_w || v.x <= 0 || v.y >= canvas_h || v.y <= 0;
  // trying to prevent changing directions too much if we are out of bounds


  const isInBounds = (v) => !hit(v);

  const getNewDirection = function(direction) {
    const d = Math.floor(Math.random() * Math.floor(directions.length));
    return d != direction ? d : getNewDirection(d);
  };
  /**
   *  @returns percentage RGBA notation stroke('rgba(100%,0%,100%,0.5)');
   */


	const randomColor = function randomColor(opacity=1.0) {
    return new Array(3).fill(0).map(function () {
      return Math.ceil(Math.random() * 100);
    });
  };

  const Vector = function(x1=100, y1=100, vel=10, mag=100) {
  	this.velocity = vel;
    this.magnitude = mag; // magnitude ??

    this.buffer = [];
    this.currentDirectionIndex = 0;
    this.currentColor = randomColor();
    this.headPoint = sketch.createVector(x1, y1);
    this.endPoint = null;


    this.restart = function () {};

    this.bufferIsFull = function() {
      return this.buffer.length === this.magnitude;
    }; // https://processing.org/examples/accelerationwithvectors.html


    this.update = function() {
      if (this.bufferIsFull()) {
        this.buffer.shift();

        this.endPoint = this.buffer[0]; // the oldest are at the front of the buffer
      }

      this.headPoint.add(directions[this.currentDirectionIndex]);

      this.buffer.push(this.headPoint.copy()); // console.log(`start = ${start}, 0 = ${buffer[0]}, end = ${end}`);


      if (hit(this.headPoint)) {
        // if (isInBounds(start)) {
        // get nearest edge
        this.currentColor = randomColor();
        this.currentDirectionIndex = getNewDirection(this.currentDirectionIndex);
        console.log("now the direction is", this.currentDirectionIndex); // }
        // else {
        // 	this.restart();
        // }
      }
    };

    this.draw = function () {
      const bufferLength = this.buffer.length;

      for (var v = 0; v < bufferLength; v++) {
        let percentageLeft = 1 - v / bufferLength; // 0 opacity on the first one since its the last pixel really
        let opacity = bufferLength - percentageLeft * bufferLength;

        if (v == bufferLength - 1) {
          sketch.stroke('black');
        } else {
          let str = `rgba(${this.currentColor[0]}%, ${this.currentColor[1]}%, ${this.currentColor[2]}%, ${opacity / 100})`;
					sketch.stroke(str);
        }
        if (bufferLength > v + 1) {
          sketch.line(this.buffer[v].x, this.buffer[v].y, this.buffer[v + 1].x, this.buffer[v + 1].y);
        } else {
          sketch.point(this.buffer[v].x, this.buffer[v].y);
        }
      }
    };
	}; 
	
	// const nearestEdge = (v) => {
  // 	let nearestEdge = sketch.createVector(0, 0);
  // 	if (v.x > canvas_w) {
  // 		nearestEdge.x = canvas_w;
  // 		// recalc
  // 	}
  // 	if (v.y > canvas_h) {
  // 		nearestEdge.x = canvas_h;
  // 		//recalc
  // 	}
  // 	if (v.x < 0) {
  // 		// recalc
  // 	}
  // 	if (v.y < 0) {
  // 		//recalc
  // 		const a = sketch.createVector(v.x, -1 * v.y);
  // 		v.add(a);
  // 	}
  // }


  var line;

  sketch.setup = () => {
    var c = sketch.createCanvas(canvas_w, canvas_h, p5__WEBPACK_IMPORTED_MODULE_0___default.a.WEBGL);
    c.parent('container');
    sketch.fill('white');
    sketch.strokeWeight(4);
    line = new Vector();
  };

  sketch.draw = () => {
    sketch.clear();
    line.update();
    line.draw();
  };
});
