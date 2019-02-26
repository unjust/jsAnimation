__webpack_require__.r(__webpack_exports__);
/* harmony import */ var p5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! p5 */ "./node_modules/p5/lib/p5.js");
/* harmony import */ var p5__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(p5__WEBPACK_IMPORTED_MODULE_0__);

new p5__WEBPACK_IMPORTED_MODULE_0___default.a(function (sketch) {
  var canvas_w = 800,
      canvas_h = 600;
  var vel = 10;
  var directions = [sketch.createVector(1 * vel, 1 * vel), sketch.createVector(-1 * vel, 1 * vel), sketch.createVector(1 * vel, -1 * vel), sketch.createVector(-1 * vel, -1 * vel)];
  /**
   * @function hit
   * @param {Vector} v 
   * @returns {Boolean} whether or not vector has hit the wall
   */

  var hit = function hit(v) {
    return v.x >= canvas_w || v.x <= 0 || v.y >= canvas_h || v.y <= 0;
  }; // trying to prevent changing directions too much if we are out of bounds


  var isInBounds = function isInBounds(v) {
    return !hit(v);
  };

  var getNewDirection = function getNewDirection(direction) {
    var d = Math.floor(Math.random() * Math.floor(directions.length));
    return d != direction ? d : getNewDirection(d);
  };
  /**
   *  @returns percentage RGBA notation stroke('rgba(100%,0%,100%,0.5)');
   */


  var randomColor = function randomColor() {
    var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;
    return new Array(3).fill(0).map(function () {
      return Math.ceil(Math.random() * 100);
    });
  };

  var Vector = function Vector() {
    var _this = this;

    var x1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
    var y1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
    var vel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
    var mag = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
    this.velocity = vel;
    this.magnitude = mag; // magnitude ??

    this.buffer = [];
    this.currentDirectionIndex = 0;
    this.currentColor = randomColor();
    this.headPoint = sketch.createVector(x1, y1);
    this.endPoint = null;

    this.setColor = function (c) {
      _this.color = c;
    };

    this.restart = function () {};

    this.bufferIsFull = function () {
      return _this.buffer.length === _this.magnitude;
    }; // https://processing.org/examples/accelerationwithvectors.html


    this.update = function () {
      if (_this.bufferIsFull()) {
        _this.buffer.shift();

        _this.endPoint = _this.buffer[0]; // the oldest are at the front of the buffer
      }

      _this.headPoint.add(directions[_this.currentDirectionIndex]);

      _this.buffer.push(_this.headPoint.copy()); // console.log(`start = ${start}, 0 = ${buffer[0]}, end = ${end}`);


      if (hit(_this.headPoint)) {
        // if (isInBounds(start)) {
        // get nearest edge
        _this.currentColor = randomColor();
        _this.currentDirectionIndex = getNewDirection(_this.currentDirectionIndex);
        console.log("now the direction is", _this.currentDirectionIndex); // }
        // else {
        // 	this.restart();
        // }
      }
    };

    this.draw = function () {
      var bufferLength = _this.buffer.length;

      for (var v = 0; v < bufferLength; v++) {
        var percentageLeft = 1 - v / bufferLength; // 0 opacity on the first one since its the last pixel really

        var opacity = bufferLength - percentageLeft * bufferLength;

        if (v == bufferLength - 1) {
          sketch.stroke('black');
        } else {
          var str = "rgba(".concat(_this.currentColor[0], "%, ").concat(_this.currentColor[1], "%, ").concat(_this.currentColor[2], "%, ").concat(opacity / 100, ")");
          sketch.stroke(str);
        }

        if (bufferLength > v + 1) {
          sketch.line(_this.buffer[v].x, _this.buffer[v].y, _this.buffer[v + 1].x, _this.buffer[v + 1].y);
        } else {
          sketch.point(_this.buffer[v].x, _this.buffer[v].y);
        }
      }
    };
  }; // const nearestEdge = (v) => {
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

  sketch.setup = function () {
    var c = sketch.createCanvas(canvas_w, canvas_h, p5__WEBPACK_IMPORTED_MODULE_0___default.a.WEBGL);
    c.parent('container');
    sketch.fill('white');
    sketch.strokeWeight(4);
    line = new Vector();
  };

  sketch.draw = function () {
    sketch.clear();
    line.update();
    line.draw();
  };
});
