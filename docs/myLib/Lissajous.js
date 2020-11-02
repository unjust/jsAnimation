"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Liss = /*#__PURE__*/function () {
  function Liss() {
    _classCallCheck(this, Liss);

    _defineProperty(this, "data", null);

    _defineProperty(this, "color", 'black');

    _defineProperty(this, "rad", 10);

    _defineProperty(this, "speed", {
      x: .01,
      y: .01,
      z: .01
    });

    _defineProperty(this, "vertices", []);

    _defineProperty(this, "verticeTail", 100);

    _defineProperty(this, "pos", {
      x: 0,
      y: 0,
      z: 0
    });

    _defineProperty(this, "currentPos", {
      x: 0,
      y: 0,
      z: 0
    });

    _defineProperty(this, "pct", 0);

    _defineProperty(this, "xFactor", 1);

    _defineProperty(this, "yFactor", 1);

    _defineProperty(this, "zFactor", 1);

    _defineProperty(this, "angle", 0.);
  }

  _createClass(Liss, [{
    key: "setColor",
    value: function setColor(colorString) {
      this.color = colorString;
    }
  }, {
    key: "setSpeed",
    value: function setSpeed() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      this.speed = {
        x: x,
        y: y,
        z: z
      };
    }
  }, {
    key: "setPos",
    value: function setPos(_ref) {
      var x = _ref.x,
          y = _ref.y,
          z = _ref.z;
      this.pos.x = x ? x : this.pos.x;
      this.pos.y = y ? y : this.pos.y;
      this.pos.z = z ? z : this.pos.z;
    }
  }, {
    key: "update",
    value: function update(sk) {
      this.angle += this.speed.x / 100;
      this.rad = sk.lerp(this.data, this.data * (this.data / 100), Math.sin(sk.millis())); // console.log(this.data/100, this.rad);

      this.addVertice(); // if (this.currentPos != this.pos) {
      //   this.currentPos = (this.pct * this.currentPos) + (1. - this.pct) * this.pos;
      // }
    } // set some data source

  }, {
    key: "setData",
    value: function setData(data) {
      // console.log("set data", data);
      this.data = data; // set data
      // then vertice data needs to be interpolated with addVertice
    }
  }, {
    key: "addVertice",
    value: function addVertice() {
      var x = this.rad * Math.cos(this.angle * this.xFactor);
      var y = this.rad * Math.sin(this.angle * this.yFactor);
      var z = this.rad * Math.sin(this.angle * this.zFactor);

      if (this.vertices.length > this.verticeTail) {
        this.vertices.shift();
      }

      this.vertices.push({
        x: x,
        y: y,
        z: z
      });
    }
  }, {
    key: "draw",
    value: function draw(sk) {
      this.update(sk);
      sk.noFill();
      sk.stroke(this.color);
      sk.beginShape(); // console.log(data);
      // this.xFactor = data[1];
      // this.yFactor = data[15];
      // this.zFactor = data[100];

      this.vertices.forEach(function (v) {
        // $p5.ellipse(v.x, v.y, 1);
        sk.vertex(v.x, v.y, v.z);
      });
      sk.endShape();
    }
  }]);

  return Liss;
}();

exports["default"] = Liss;
;