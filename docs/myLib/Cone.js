"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Objekt2 = _interopRequireDefault(require("./Objekt.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Cone = /*#__PURE__*/function (_Objekt) {
  _inherits(Cone, _Objekt);

  var _super = _createSuper(Cone);

  function Cone(sketch, _ref) {
    var _this;

    var w = _ref.w,
        h = _ref.h,
        x = _ref.x,
        y = _ref.y,
        z = _ref.z;
    var initialRotation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 180.0;
    var colors = arguments.length > 3 ? arguments[3] : undefined;

    _classCallCheck(this, Cone);

    _this = _super.call(this, sketch, "cone", {
      w: w,
      h: h,
      x: x,
      y: y,
      z: z
    }, colors);
    _this.rotateCounter = initialRotation; // start pointed up

    return _this;
  } // drawing a circle base
  // for a cartoon effect
  // TODO improve performance


  _createClass(Cone, [{
    key: "drawStroke",
    value: function drawStroke() {
      this.sk.translate(0, -1 * this.dim.h / 2, 0);
      this.sk.rotateX(90);
      this.sk.stroke(this.strokeColor);
      this.sk.angleMode(this.sk.DEGREES);
      this.sk.beginShape(this.sk.LINES);

      for (var i = 0; i < 360; i++) {
        var px = Math.cos(i) * this.dim.w;
        var py = Math.sin(i) * this.dim.w;
        this.sk.vertex(px, py);
      }

      this.sk.endShape();
    }
  }, {
    key: "draw",
    value: function draw(warp) {
      if (warp) {
        this.fillColor.setAlpha(190);
      } else {
        this.fillColor.setAlpha(255);
      }

      this.sk.fill(this.fillColor);
      this.sk.noStroke();

      if (!warp) {
        this.update();
      }

      this.sk.push();
      this.sk.rotate(this.rotateCounter, [0, 0, 1]);
      this.shapeFn(this.dim.w, this.dim.h);
      this.drawStroke();
      this.sk.pop();
    }
  }]);

  return Cone;
}(_Objekt2["default"]);

exports["default"] = Cone;
;