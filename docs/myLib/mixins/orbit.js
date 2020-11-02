"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _p = _interopRequireDefault(require("p5"));

var constants = _interopRequireWildcard(require("Framework/constants.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var OrbitMixin = {
  /**
   * @param {float} angle initial angle of orbit
   * @param {float} speed speed of orbiting
   * @param {Vector} position position of the thing thats going to orbit
   * @param {Vector} orbitPoint point to orbit around
   */
  initOrbit: function initOrbit(angle) {
    var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.random();
    var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _p["default"].Vector.random3D();
    var orbitPoint = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _p["default"].Vector(1, 1, 1);
    this.sk = this.sketch;
    this.orbitAngle = angle;
    this.orbitSpeed = speed;
    this.orbitPoint = orbitPoint; // how far the object is from the orbit

    this.distanceVector = _p["default"].Vector.sub(orbitPoint, position);
    this.rotateCounter = 0; // for rotation of shape individually

    this.rotateVector = _p["default"].Vector.random3D();
  },
  update: function update() {
    if (this.stopped) {
      return;
    }

    this.orbitAngle += this.orbitSpeed;
    this.rotateCounter += 0.01; // move the counter

    this.orbitPoint.add(.1, 0, 0);
  },
  // getShapePostion() {
  //   const sinAngle = Math.sin(this.orbitAngle);
  //   const cosAngle = Math.cos(this.orbitAngle);
  //   const x = this.distanceVector.x * cosAngle - this.distanceVector.y * sinAngle;
  //   const y = this.distanceVector.y * cosAngle  - this.distanceVector.x * sinAngle;
  //   return { x: x + this.orbitPoint.x, y: y + this.orbitPoint.y };ß
  // },
  drawDebug: function drawDebug() {
    this.sk.stroke('green');
    this.sk.sphere(5);
    this.sk.stroke('blue');
    this.sk.line(0, 0, 0, this.distanceVector.x, this.distanceVector.y, this.distanceVector.z);
  },
  drawOrbit: function drawOrbit() {
    // debugger
    this.update();
    this.sk.push();
    this.sk.translate(this.orbitPoint.x, this.orbitPoint.y, this.orbitPoint.z);
    this.sk.rotate(this.sk.degrees(this.orbitAngle), constants.at); // this.drawDebug();

    this.sk.translate(this.distanceVector.x, this.distanceVector.y, this.distanceVector.z);
    this.sk.rotate(this.sk.degrees(this.rotateCounter), this.rotateVector); // rotate shape individually?

    this.draw();
    this.sk.pop();
  }
};
var _default = OrbitMixin;
exports["default"] = _default;