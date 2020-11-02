"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.shapeTypes = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var shapeTypes = ["box", "cone", "sphere"];
exports.shapeTypes = shapeTypes;

var Objekt = /*#__PURE__*/function () {
  function Objekt(sketch, shapeType, _ref) {
    var w = _ref.w,
        h = _ref.h,
        _ref$x = _ref.x,
        x = _ref$x === void 0 ? 0 : _ref$x,
        _ref$y = _ref.y,
        y = _ref$y === void 0 ? 0 : _ref$y,
        _ref$z = _ref.z,
        z = _ref$z === void 0 ? 0 : _ref$z;
    var colors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
      stroke: 'black',
      fill: 'white'
    };

    _classCallCheck(this, Objekt);

    this.sk = this.sketch = sketch;
    this.setShapeType(shapeType);
    this.dim = {
      w: w,
      h: h
    };
    this.fillColor = this.sk.color(colors.fill);
    this.strokeColor = this.sk.color(colors.stroke);
    this.pos = this.sk.createVector(x, y, z);
    this.posEnd = this.pos;
    this.counter = 0.0;
    this.stopped = false;
  }

  _createClass(Objekt, [{
    key: "setShapeType",
    value: function setShapeType(shapeType) {
      this.shapeFn = this.sk[shapeType].bind(this.sk);
    }
  }, {
    key: "toInfinity",
    value: function toInfinity() {
      this.posEnd = this.sk.createVector(x, y, -1 * depth);
    }
  }, {
    key: "update",
    value: function update() {
      if (this.stopped) {
        return;
      }

      this.counter += 0.001;

      if (this.pos - this.posEnd > 100) {
        return;
      }

      this.position();
    }
  }, {
    key: "position",
    value: function position() {
      var pct = this.counter / 100;
      this.pos.x = this.pos.x * (1 - pct) + this.posEnd.x * pct;
      this.pos.y = this.pos.y * (1 - pct) + this.posEnd.y * pct;
      this.pos.z = this.pos.z * (1 - pct) + this.posEnd.z * pct;
      return this.pos;
    }
  }, {
    key: "drawStroke",
    value: function drawStroke() {}
  }, {
    key: "setCounter",
    value: function setCounter(c) {
      this.counter = c;
    }
  }, {
    key: "draw",
    value: function draw() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        warp: false,
        rotate: false
      };

      if (options.warp) {
        this.fillColor.setAlpha(190);
      } else {
        this.fillColor.setAlpha(255);
        this.update();
      }

      if (options.texture) {
        this.sk.texture(options.texture);
      } else {
        this.sk.fill(this.fillColor);
        this.sk.stroke(this.strokeColor);
      }

      this.sk.push();
      this.sk.translate(this.pos);

      if (options.rotate) {
        this.sk.rotate(this.counter, this.sk.createVector(0, 1, 0));
      }

      ;
      this.shapeFn(this.dim.w, this.dim.h);
      this.sk.pop();
    }
  }]);

  return Objekt;
}();

exports["default"] = Objekt;
;