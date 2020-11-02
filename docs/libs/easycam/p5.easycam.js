/*
 * 
 * The p5.EasyCam library - Easy 3D CameraControl for p5.js and WEBGL.
 *
 *   Copyright 2018 by Thomas Diewald (https://www.thomasdiewald.com)
 *
 *   Source: https://github.com/diwi/p5.EasyCam
 *
 *   MIT License: https://opensource.org/licenses/MIT
 * 
 * 
 * explanatory notes:
 * 
 * p5.EasyCam is a derivative of the original PeasyCam Library by Jonathan Feinberg 
 * and combines new useful features with the great look and feel of its parent.
 * 
 */
'use strict';
/** @namespace  */

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Dw = function (ext) {
  /**
   * EasyCam Library Info
   */
  var INFO = {
    /** name    */
    LIBRARY: "p5.EasyCam",

    /** version */
    VERSION: "1.0.9",

    /** author  */
    AUTHOR: "Thomas Diewald",

    /** source  */
    SOURCE: "https://github.com/diwi/p5.EasyCam",
    toString: function toString() {
      return this.LIBRARY + " v" + this.VERSION + " by " + this.AUTHOR + " (" + this.SOURCE + ")";
    }
  };
  /**
   * EasyCam
   *
   * <pre>
   *
   *   new Dw.EasyCam(p5.RendererGL, {
   *     distance : z,                 // scalar
   *     center   : [x, y, z],         // vector
   *     rotation : [q0, q1, q2, q3],  // quaternion
   *     viewport : [x, y, w, h],      // array
   *   }
   *
   * </pre>
   *
   * @param {p5.RendererGL} renderer - p5 WEBGL renderer
   * @param {Object}        args     - {distance, center, rotation, viewport}
   *
   */

  var EasyCam = /*#__PURE__*/function () {
    /**
     * @constructor
     */
    function EasyCam(renderer, args) {
      _classCallCheck(this, EasyCam);

      // WEBGL renderer required
      if (!(renderer instanceof p5.RendererGL)) {
        console.log("renderer needs to be an instance of p5.RendererGL");
        return;
      } // define default args


      args = args || {};
      if (args.distance === undefined) args.distance = 500;
      if (args.center === undefined) args.center = [0, 0, 0];
      if (args.rotation === undefined) args.rotation = Rotation.identity();
      if (args.viewport === undefined) args.viewport = [0, 0, renderer.width, renderer.height]; // library info

      this.INFO = INFO; // set renderer, graphics, p5
      // this.renderer;
      // this.graphics;
      // this.P5

      this.setCanvas(renderer); // self reference

      var cam = this;
      this.cam = cam; // some constants

      this.LOOK = [0, 0, 1];
      this.UP = [0, 1, 0]; // principal axes flags

      this.AXIS = new function () {
        this.YAW = 0x01;
        this.PITCH = 0x02;
        this.ROLL = 0x04;
        this.ALL = this.YAW | this.PITCH | this.ROLL;
      }(); // mouse action constraints

      this.SHIFT_CONSTRAINT = 0; // applied when pressing the shift key

      this.FIXED_CONSTRAINT = 0; // applied, when set by user and SHIFT_CONSTRAINT is 0

      this.DRAG_CONSTRAINT = 0; // depending on SHIFT_CONSTRAINT and FIXED_CONSTRAINT, default is ALL
      // mouse action speed

      this.scale_rotation = 0.001;
      this.scale_pan = 0.0002;
      this.scale_zoom = 0.001;
      this.scale_zoomwheel = 20.0; // zoom limits

      this.distance_min_limit = 0.01;
      this.distance_min = 1.0;
      this.distance_max = Number.MAX_VALUE; // main state

      this.state = {
        distance: args.distance,
        // scalar
        center: args.center.slice(),
        // vec3
        rotation: args.rotation.slice(),
        // quaternion
        copy: function copy(dst) {
          dst = dst || {};
          dst.distance = this.distance;
          dst.center = this.center.slice();
          dst.rotation = this.rotation.slice();
          return dst;
        }
      }; // backup-state at start

      this.state_reset = this.state.copy(); // backup-state, probably not required

      this.state_pushed = this.state.copy(); // viewport for the mouse-pointer [x,y,w,h]

      this.viewport = args.viewport.slice(); // mouse/touch/key action handler

      this.mouse = {
        cam: cam,
        curr: [0, 0, 0],
        prev: [0, 0, 0],
        dist: [0, 0, 0],
        mwheel: 0,
        isPressed: false,
        // true if (istouchdown || ismousedown)
        istouchdown: false,
        // true, if input came from a touch
        ismousedown: false,
        // true, if input came from a mouse
        BUTTON: {
          LMB: 0x01,
          MMB: 0x02,
          RMB: 0x04
        },
        button: 0,
        mouseDragLeft: cam.mouseDragRotate.bind(cam),
        mouseDragCenter: cam.mouseDragPan.bind(cam),
        mouseDragRight: cam.mouseDragZoom.bind(cam),
        mouseWheelAction: cam.mouseWheelZoom.bind(cam),
        touchmoveSingle: cam.mouseDragRotate.bind(cam),
        touchmoveMulti: function touchmoveMulti() {
          cam.mouseDragPan();
          cam.mouseDragZoom();
        },
        insideViewport: function insideViewport(x, y) {
          var x0 = cam.viewport[0],
              x1 = x0 + cam.viewport[2];
          var y0 = cam.viewport[1],
              y1 = y0 + cam.viewport[3];
          return x > x0 && x < x1 && y > y0 && y < y1;
        },
        solveConstraint: function solveConstraint() {
          var dx = this.dist[0];
          var dy = this.dist[1]; // YAW, PITCH

          if (this.shiftKey && !cam.SHIFT_CONSTRAINT && Math.abs(dx - dy) > 1) {
            cam.SHIFT_CONSTRAINT = Math.abs(dx) > Math.abs(dy) ? cam.AXIS.YAW : cam.AXIS.PITCH;
          } // define constraint by increasing priority


          cam.DRAG_CONSTRAINT = cam.AXIS.ALL;
          if (cam.FIXED_CONSTRAINT) cam.DRAG_CONSTRAINT = cam.FIXED_CONSTRAINT;
          if (cam.SHIFT_CONSTRAINT) cam.DRAG_CONSTRAINT = cam.SHIFT_CONSTRAINT;
        },
        updateInput: function updateInput(x, y, z) {
          var mouse = cam.mouse;
          var pd = cam.P5.pixelDensity();
          mouse.prev[0] = mouse.curr[0];
          mouse.prev[1] = mouse.curr[1];
          mouse.prev[2] = mouse.curr[2];
          mouse.curr[0] = x;
          mouse.curr[1] = y;
          mouse.curr[2] = z;
          mouse.dist[0] = -(mouse.curr[0] - mouse.prev[0]) / pd;
          mouse.dist[1] = -(mouse.curr[1] - mouse.prev[1]) / pd;
          mouse.dist[2] = -(mouse.curr[2] - mouse.prev[2]) / pd;
        },
        //////////////////////////////////////////////////////////////////////////
        // mouseinput
        //////////////////////////////////////////////////////////////////////////
        mousedown: function mousedown(event) {
          var mouse = cam.mouse;
          if (event.button === 0) mouse.button |= mouse.BUTTON.LMB;
          if (event.button === 1) mouse.button |= mouse.BUTTON.MMB;
          if (event.button === 2) mouse.button |= mouse.BUTTON.RMB;

          if (mouse.insideViewport(event.x, event.y)) {
            mouse.updateInput(event.x, event.y, event.y);
            mouse.ismousedown = mouse.button > 0;
            mouse.isPressed = mouse.ismousedown;
            cam.SHIFT_CONSTRAINT = 0;
          }
        },
        mousedrag: function mousedrag() {
          var pd = cam.P5.pixelDensity();
          var mouse = cam.mouse;

          if (mouse.ismousedown) {
            var x = cam.P5.mouseX;
            var y = cam.P5.mouseY;
            var z = y;
            mouse.updateInput(x, y, z);
            mouse.solveConstraint();
            var LMB = mouse.button & mouse.BUTTON.LMB;
            var MMB = mouse.button & mouse.BUTTON.MMB;
            var RMB = mouse.button & mouse.BUTTON.RMB;
            if (LMB && mouse.mouseDragLeft) mouse.mouseDragLeft();
            if (MMB && mouse.mouseDragCenter) mouse.mouseDragCenter();
            if (RMB && mouse.mouseDragRight) mouse.mouseDragRight();
          }
        },
        mouseup: function mouseup(event) {
          var mouse = cam.mouse;
          if (event.button === 0) mouse.button &= ~mouse.BUTTON.LMB;
          if (event.button === 1) mouse.button &= ~mouse.BUTTON.MMB;
          if (event.button === 2) mouse.button &= ~mouse.BUTTON.RMB;
          mouse.ismousedown = mouse.button > 0;
          mouse.isPressed = mouse.istouchdown || mouse.ismousedown;
          cam.SHIFT_CONSTRAINT = 0;
        },
        dblclick: function dblclick(event) {
          var x = event.x;
          var y = event.y;

          if (cam.mouse.insideViewport(x, y)) {
            cam.reset();
          }
        },
        wheel: function wheel(event) {
          var x = event.x;
          var y = event.y;
          var mouse = cam.mouse;

          if (mouse.insideViewport(x, y)) {
            mouse.mwheel = event.deltaY * 0.01;
            if (mouse.mouseWheelAction) mouse.mouseWheelAction();
          }
        },
        //////////////////////////////////////////////////////////////////////////
        // touchinput
        //////////////////////////////////////////////////////////////////////////
        evaluateTouches: function evaluateTouches(event) {
          var touches = event.touches;
          var avg_x = 0.0;
          var avg_y = 0.0;
          var avg_d = 0.0;
          var i,
              dx,
              dy,
              count = touches.length; // center, averaged touch position

          for (i = 0; i < count; i++) {
            avg_x += touches[i].clientX;
            avg_y += touches[i].clientY;
          }

          avg_x /= count;
          avg_y /= count; // offset, mean distance to center

          for (i = 0; i < count; i++) {
            dx = avg_x - touches[i].clientX;
            dy = avg_y - touches[i].clientY;
            avg_d += Math.sqrt(dx * dx + dy * dy);
          }

          avg_d /= count;
          cam.mouse.updateInput(avg_x, avg_y, -avg_d);
        },
        touchstart: function touchstart(event) {
          event.preventDefault();
          event.stopPropagation();
          var mouse = cam.mouse;
          mouse.evaluateTouches(event);
          mouse.istouchdown = mouse.insideViewport(mouse.curr[0], mouse.curr[1]);
          mouse.isPressed = cam.mouse.istouchdown || cam.mouse.ismousedown;
          mouse.dbltap(event);
        },
        touchmove: function touchmove(event) {
          event.preventDefault();
          event.stopPropagation();
          var mouse = cam.mouse;

          if (mouse.istouchdown) {
            mouse.evaluateTouches(event);
            mouse.solveConstraint();

            if (event.touches.length === 1) {
              mouse.touchmoveSingle();
            } else {
              mouse.touchmoveMulti();
              mouse.tapcount = 0;
            }
          }
        },
        touchend: function touchend(event) {
          event.preventDefault();
          event.stopPropagation();
          var mouse = cam.mouse;
          mouse.istouchdown = false, mouse.isPressed = mouse.istouchdown || mouse.ismousedown;
          cam.SHIFT_CONSTRAINT = 0;

          if (mouse.tapcount >= 2) {
            if (mouse.insideViewport(mouse.curr[0], mouse.curr[1])) {
              cam.reset();
            }

            mouse.tapcount = 0;
          }
        },
        tapcount: 0,
        dbltap: function dbltap(event) {
          if (cam.mouse.tapcount++ == 0) {
            setTimeout(function () {
              cam.mouse.tapcount = 0;
            }, 350);
          }
        },
        //////////////////////////////////////////////////////////////////////////
        // keyingput
        //////////////////////////////////////////////////////////////////////////
        // key-event for shift constraints
        shiftKey: false,
        keydown: function keydown(event) {
          var mouse = cam.mouse;

          if (!mouse.shiftKey) {
            mouse.shiftKey = event.keyCode === 16;
          }
        },
        keyup: function keyup(event) {
          var mouse = cam.mouse;

          if (mouse.shiftKey) {
            mouse.shiftKey = event.keyCode !== 16;

            if (!mouse.shiftKey) {
              cam.SHIFT_CONSTRAINT = 0;
            }
          }
        }
      }; // camera mouse listeners

      this.attachMouseListeners(); // P5 registered callbacks, TODO unregister on dispose

      this.auto_update = true;
      this.P5.registerMethod('pre', function () {
        if (cam.auto_update) {
          cam.update();
        }
      }); // damped camera transition

      this.dampedZoom = new DampedAction(function (d) {
        cam.zoom(d * cam.getZoomMult());
      });
      this.dampedPanX = new DampedAction(function (d) {
        cam.panX(d * cam.getPanMult());
      });
      this.dampedPanY = new DampedAction(function (d) {
        cam.panY(d * cam.getPanMult());
      });
      this.dampedRotX = new DampedAction(function (d) {
        cam.rotateX(d * cam.getRotationMult());
      });
      this.dampedRotY = new DampedAction(function (d) {
        cam.rotateY(d * cam.getRotationMult());
      });
      this.dampedRotZ = new DampedAction(function (d) {
        cam.rotateZ(d * cam.getRotationMult());
      }); // interpolated camera transition

      this.timedRot = new Interpolation(cam.setInterpolatedRotation.bind(cam));
      this.timedPan = new Interpolation(cam.setInterpolatedCenter.bind(cam));
      this.timedzoom = new Interpolation(cam.setInterpolatedDistance.bind(cam));
    }
    /**
     * sets the WEBGL renderer the camera is working on
     *
     * @param {p5.RendererGL} renderer ... p5 WEBGL renderer
     */


    _createClass(EasyCam, [{
      key: "setCanvas",
      value: function setCanvas(renderer) {
        if (renderer instanceof p5.RendererGL) {
          // p5js seems to be not very clear about this
          // ... a bit confusing, so i guess this could change in future releases
          this.renderer = renderer;

          if (renderer._pInst instanceof p5) {
            this.graphics = renderer;
          } else {
            this.graphics = renderer._pInst;
          }

          this.P5 = this.graphics._pInst;
        } else {
          this.graphics = undefined;
          this.renderer = undefined;
        }
      }
      /** @return {p5.RendererGL} the currently used renderer */

    }, {
      key: "getCanvas",
      value: function getCanvas() {
        return this.renderer;
      }
    }, {
      key: "attachListener",
      value: function attachListener(el, ev, fx, op) {
        if (!el || el === fx.el) {
          return;
        }

        this.detachListener(fx);
        fx.el = el;
        fx.ev = ev;
        fx.op = op;
        fx.el.addEventListener(fx.ev, fx, fx.op);
      }
    }, {
      key: "detachListener",
      value: function detachListener(fx) {
        if (fx.el) {
          fx.el.removeEventListener(fx.ev, fx, fx.op);
          fx.el = undefined;
        }
      }
      /** attaches input-listeners (mouse, touch, key) to the used renderer */

    }, {
      key: "attachMouseListeners",
      value: function attachMouseListeners(renderer) {
        var cam = this.cam;
        var mouse = cam.mouse;
        renderer = renderer || cam.renderer;

        if (renderer) {
          var op = {
            passive: false
          };
          var el = renderer.elt;
          cam.attachListener(el, 'mousedown', mouse.mousedown, op);
          cam.attachListener(el, 'mouseup', mouse.mouseup, op);
          cam.attachListener(el, 'dblclick', mouse.dblclick, op);
          cam.attachListener(el, 'wheel', mouse.wheel, op);
          cam.attachListener(el, 'touchstart', mouse.touchstart, op);
          cam.attachListener(el, 'touchend', mouse.touchend, op);
          cam.attachListener(el, 'touchmove', mouse.touchmove, op);
          cam.attachListener(window, 'keydown', mouse.keydown, op);
          cam.attachListener(window, 'keyup', mouse.keyup, op);
        }
      }
      /** detaches all attached input-listeners */

    }, {
      key: "removeMouseListeners",
      value: function removeMouseListeners() {
        var cam = this.cam;
        var mouse = cam.mouse;
        cam.detachListener(mouse.mousedown);
        cam.detachListener(mouse.mouseup);
        cam.detachListener(mouse.dblclick);
        cam.detachListener(mouse.wheel);
        cam.detachListener(mouse.keydown);
        cam.detachListener(mouse.keyup);
        cam.detachListener(mouse.touchstart);
        cam.detachListener(mouse.touchend);
        cam.detachListener(mouse.touchmove);
      }
      /** Disposes/releases the camera. */

    }, {
      key: "dispose",
      value: function dispose() {
        // TODO: p5 unregister 'pre', ... not available in 0.5.16
        removeMouseListeners();
      }
      /** @return {boolean} the current autoUpdate state */

    }, {
      key: "getAutoUpdate",
      value: function getAutoUpdate() {
        return this.auto_update;
      }
      /** 
       * If true, the EasyCam will update automatically in a pre-draw step.
       * This updates the camera state and updates the renderers 
       * modelview/camera matrix.
       *
       * If false, the update() needs to be called manually.
       *
       * @param {boolean} the new autoUpdate state 
       */

    }, {
      key: "setAutoUpdate",
      value: function setAutoUpdate(status) {
        this.auto_update = status;
      }
      /** 
       * Updates the camera state (interpolated / damped animations) and updates
       * the renderers' modelview/camera matrix.
       *
       * if "auto_update" is true, this is called automatically in a pre-draw call.
       */

    }, {
      key: "update",
      value: function update() {
        var cam = this.cam;
        var mouse = cam.mouse;
        mouse.mousedrag();
        var b_update = false;
        b_update |= cam.dampedZoom.update();
        b_update |= cam.dampedPanX.update();
        b_update |= cam.dampedPanY.update();
        b_update |= cam.dampedRotX.update();
        b_update |= cam.dampedRotY.update();
        b_update |= cam.dampedRotZ.update(); // interpolated actions have lower priority then damped actions

        if (b_update) {
          cam.timedRot.stop();
          cam.timedPan.stop();
          cam.timedzoom.stop();
        } else {
          cam.timedRot.update();
          cam.timedPan.update();
          cam.timedzoom.update();
        }

        cam.apply();
      }
      /** 
       * Applies the current camera state to the renderers' modelview/camera matrix.
       * If no argument is given, then the cameras currently set renderer is used.
       */

    }, {
      key: "apply",
      value: function apply(renderer) {
        var cam = this.cam;
        renderer = renderer || cam.renderer;

        if (renderer) {
          this.camEYE = this.getPosition(this.camEYE);
          this.camLAT = this.getCenter(this.camLAT);
          this.camRUP = this.getUpVector(this.camRUP); // https://github.com/diwi/p5.EasyCam/pull/6/files

          renderer._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]);
        }
      }
      /** @param {int[]} the new viewport-def, as [x,y,w,h] */

    }, {
      key: "setViewport",
      value: function setViewport(viewport) {
        this.viewport = viewport.slice();
      }
      /** @returns {int[]} the current viewport-def, as [x,y,w,h] */

    }, {
      key: "getViewport",
      value: function getViewport() {
        return this.viewport;
      } //
      // mouse state changes
      //

      /** implemented zoom-cb for mouswheel handler.*/

    }, {
      key: "mouseWheelZoom",
      value: function mouseWheelZoom() {
        var cam = this;
        var mouse = cam.mouse;
        cam.dampedZoom.addForce(mouse.mwheel * cam.scale_zoomwheel);
      }
      /** implemented zoom-cb for mousedrag/touch handler.*/

    }, {
      key: "mouseDragZoom",
      value: function mouseDragZoom() {
        var cam = this;
        var mouse = cam.mouse;
        cam.dampedZoom.addForce(-mouse.dist[2]);
      }
      /** implemented pan-cb for mousedrag/touch handler.*/

    }, {
      key: "mouseDragPan",
      value: function mouseDragPan() {
        var cam = this;
        var mouse = cam.mouse;
        cam.dampedPanX.addForce(cam.DRAG_CONSTRAINT & cam.AXIS.YAW ? mouse.dist[0] : 0);
        cam.dampedPanY.addForce(cam.DRAG_CONSTRAINT & cam.AXIS.PITCH ? mouse.dist[1] : 0);
      }
      /** implemented rotate-cb for mousedrag/touch handler.*/

    }, {
      key: "mouseDragRotate",
      value: function mouseDragRotate() {
        var cam = this;
        var mouse = cam.mouse;
        var mx = mouse.curr[0],
            my = mouse.curr[1];
        var dx = mouse.dist[0],
            dy = mouse.dist[1]; // mouse [-1, +1]

        var mxNdc = Math.min(Math.max((mx - cam.viewport[0]) / cam.viewport[2], 0), 1) * 2 - 1;
        var myNdc = Math.min(Math.max((my - cam.viewport[1]) / cam.viewport[3], 0), 1) * 2 - 1;

        if (cam.DRAG_CONSTRAINT & cam.AXIS.YAW) {
          cam.dampedRotY.addForce(+dx * (1.0 - myNdc * myNdc));
        }

        if (cam.DRAG_CONSTRAINT & cam.AXIS.PITCH) {
          cam.dampedRotX.addForce(-dy * (1.0 - mxNdc * mxNdc));
        }

        if (cam.DRAG_CONSTRAINT & cam.AXIS.ROLL) {
          cam.dampedRotZ.addForce(-dx * myNdc);
          cam.dampedRotZ.addForce(+dy * mxNdc);
        }
      } //
      // damped multipliers
      //

      /** (private) returns the used zoom -multiplier for damped actions. */

    }, {
      key: "getZoomMult",
      value: function getZoomMult() {
        return this.state.distance * this.scale_zoom;
      }
      /** (private) returns the used pan-multiplier for damped actions. */

    }, {
      key: "getPanMult",
      value: function getPanMult() {
        return this.state.distance * this.scale_pan;
      }
      /** (private) returns the used rotate-multiplier for damped actions. */

    }, {
      key: "getRotationMult",
      value: function getRotationMult() {
        return Math.pow(Math.log10(1 + this.state.distance), 0.5) * this.scale_rotation;
      } //
      // damped state changes
      //

      /** Applies a change to the current zoom.  */

    }, {
      key: "zoom",
      value: function zoom(dz) {
        var cam = this.cam;
        var distance_tmp = cam.state.distance + dz; // check lower bound

        if (distance_tmp < cam.distance_min) {
          distance_tmp = cam.distance_min;
          cam.dampedZoom.stop();
        } // check upper bound


        if (distance_tmp > cam.distance_max) {
          distance_tmp = cam.distance_max;
          cam.dampedZoom.stop();
        }

        cam.state.distance = distance_tmp;
      }
      /** Applies a change to the current pan-xValue.  */

    }, {
      key: "panX",
      value: function panX(dx) {
        var state = this.cam.state;

        if (dx) {
          var val = Rotation.applyToVec3(state.rotation, [dx, 0, 0]);
          Vec3.add(state.center, val, state.center);
        }
      }
      /** Applies a change to the current pan-yValue.  */

    }, {
      key: "panY",
      value: function panY(dy) {
        var state = this.cam.state;

        if (dy) {
          var val = Rotation.applyToVec3(state.rotation, [0, dy, 0]);
          Vec3.add(state.center, val, state.center);
        }
      }
      /** Applies a change to the current pan-value.  */

    }, {
      key: "pan",
      value: function pan(dx, dy) {
        this.cam.panX(dx);
        this.cam.panY(dx);
      }
      /** Applies a change to the current xRotation.  */

    }, {
      key: "rotateX",
      value: function rotateX(rx) {
        this.cam.rotate([1, 0, 0], rx);
      }
      /** Applies a change to the current yRotation.  */

    }, {
      key: "rotateY",
      value: function rotateY(ry) {
        this.cam.rotate([0, 1, 0], ry);
      }
      /** Applies a change to the current zRotation.  */

    }, {
      key: "rotateZ",
      value: function rotateZ(rz) {
        this.cam.rotate([0, 0, 1], rz);
      }
      /** Applies a change to the current rotation, using the given axis/angle.  */

    }, {
      key: "rotate",
      value: function rotate(axis, angle) {
        var state = this.cam.state;

        if (angle) {
          var new_rotation = Rotation.create({
            axis: axis,
            angle: angle
          });
          Rotation.applyToRotation(state.rotation, new_rotation, state.rotation);
        }
      } // 
      // interpolated states
      //

      /** Sets the new camera-distance, interpolated (t) between given A and B. */

    }, {
      key: "setInterpolatedDistance",
      value: function setInterpolatedDistance(valA, valB, t) {
        this.cam.state.distance = Scalar.mix(valA, valB, Scalar.smoothstep(t));
      }
      /** Sets the new camera-center, interpolated (t) between given A and B. */

    }, {
      key: "setInterpolatedCenter",
      value: function setInterpolatedCenter(valA, valB, t) {
        this.cam.state.center = Vec3.mix(valA, valB, Scalar.smoothstep(t));
      }
      /** Sets the new camera-rotation, interpolated (t) between given A and B. */

    }, {
      key: "setInterpolatedRotation",
      value: function setInterpolatedRotation(valA, valB, t) {
        this.cam.state.rotation = Rotation.slerp(valA, valB, t);
      } //
      // DISTANCE
      //

      /** Sets the minimum camera distance. */

    }, {
      key: "setDistanceMin",
      value: function setDistanceMin(distance_min) {
        this.distance_min = Math.max(distance_min, this.distance_min_limit);
        this.zoom(0); // update, to ensure new minimum
      }
      /** Sets the maximum camera distance. */

    }, {
      key: "setDistanceMax",
      value: function setDistanceMax(distance_max) {
        this.distance_max = distance_max;
        this.zoom(0); // update, to ensure new maximum
      }
      /** 
       * Sets the new camera distance.
       *
       * @param {double} new distance.
       * @param {long} animation time in millis.
       */

    }, {
      key: "setDistance",
      value: function setDistance(distance, duration) {
        this.timedzoom.start(this.state.distance, distance, duration, [this.dampedZoom]);
      }
      /** @returns {double} the current camera distance. */

    }, {
      key: "getDistance",
      value: function getDistance() {
        return this.state.distance;
      } //
      // CENTER / LOOK AT
      //

      /** 
       * Sets the new camera center.
       *
       * @param {double[]} new center.
       * @param {long} animation time in millis.
       */

    }, {
      key: "setCenter",
      value: function setCenter(center, duration) {
        this.timedPan.start(this.state.center, center, duration, [this.dampedPanX, this.dampedPanY]);
      }
      /** @returns {double[]} the current camera center. */

    }, {
      key: "getCenter",
      value: function getCenter() {
        return this.state.center;
      } //
      // ROTATION
      //

      /** 
       * Sets the new camera rotation (quaternion).
       *
       * @param {double[]} new rotation as quat[q0,q1,q2,q3].
       * @param {long} animation time in millis.
       */

    }, {
      key: "setRotation",
      value: function setRotation(rotation, duration) {
        this.timedRot.start(this.state.rotation, rotation, duration, [this.dampedRotX, this.dampedRotY, this.dampedRotZ]);
      }
      /** @returns {double[]} the current camera rotation as quat[q0,q1,q2,q3]. */

    }, {
      key: "getRotation",
      value: function getRotation() {
        return this.state.rotation;
      } //
      // CAMERA POSITION/EYE
      //

      /** @returns {double[]} the current camera position, aka. the eye position. */

    }, {
      key: "getPosition",
      value: function getPosition(dst) {
        var cam = this.cam;
        var state = cam.state;
        dst = Vec3.assert(dst);
        Rotation.applyToVec3(state.rotation, cam.LOOK, dst);
        Vec3.mult(dst, state.distance, dst);
        Vec3.add(dst, state.center, dst);
        return dst;
      } //
      // CAMERA UP
      //

      /** @returns {double[]} the current camera up vector. */

    }, {
      key: "getUpVector",
      value: function getUpVector(dst) {
        var cam = this.cam;
        var state = cam.state;
        dst = Vec3.assert(dst);
        Rotation.applyToVec3(state.rotation, cam.UP, dst);
        return dst;
      } //
      // STATE (rotation, center, distance)
      //

      /** @returns {Object} a copy of the camera state {distance,center,rotation} */

    }, {
      key: "getState",
      value: function getState() {
        return this.state.copy();
      }
      /** 
       * @param {Object} a new camera state {distance,center,rotation}.
       * @param {long} animation time in millis.
       */

    }, {
      key: "setState",
      value: function setState(other, duration) {
        if (other) {
          this.setDistance(other.distance, duration);
          this.setCenter(other.center, duration);
          this.setRotation(other.rotation, duration);
        }
      }
    }, {
      key: "pushState",
      value: function pushState() {
        return this.state_pushed = this.getState();
      }
    }, {
      key: "popState",
      value: function popState(duration) {
        this.setState(this.state_pushed, duration);
      }
      /** sets the current state as reset-state. */

    }, {
      key: "pushResetState",
      value: function pushResetState() {
        return this.state_reset = this.getState();
      }
      /** resets the camera, by applying the reset-state. */

    }, {
      key: "reset",
      value: function reset(duration) {
        this.setState(this.state_reset, duration);
      }
      /** sets the rotation scale/speed. */

    }, {
      key: "setRotationScale",
      value: function setRotationScale(scale_rotation) {
        this.scale_rotation = scale_rotation;
      }
      /** sets the pan scale/speed. */

    }, {
      key: "setPanScale",
      value: function setPanScale(scale_pan) {
        this.scale_pan = scale_pan;
      }
      /** sets the zoom scale/speed. */

    }, {
      key: "setZoomScale",
      value: function setZoomScale(scale_zoom) {
        this.scale_zoom = scale_zoom;
      }
      /** sets the wheel scale/speed. */

    }, {
      key: "setWheelScale",
      value: function setWheelScale(wheelScale) {
        this.scale_zoomwheel = wheelScale;
      }
      /** @returns the rotation scale/speed. */

    }, {
      key: "getRotationScale",
      value: function getRotationScale() {
        return this.scale_rotation;
      }
      /** @returns the pan scale/speed. */

    }, {
      key: "getPanScale",
      value: function getPanScale() {
        return this.scale_pan;
      }
      /** @returns the zoom scale/speed. */

    }, {
      key: "getZoomScale",
      value: function getZoomScale() {
        return this.scale_zoom;
      }
      /** @returns the wheel scale/speed. */

    }, {
      key: "getWheelScale",
      value: function getWheelScale() {
        return this.scale_zoomwheel;
      }
      /** sets the default damping scale/speed. */

    }, {
      key: "setDamping",
      value: function setDamping(damping) {
        this.dampedZoom.damping = damping;
        this.dampedPanX.damping = damping;
        this.dampedPanY.damping = damping;
        this.dampedRotX.damping = damping;
        this.dampedRotY.damping = damping;
        this.dampedRotZ.damping = damping;
      }
      /** sets the default interpolation time in millis. */

    }, {
      key: "setDefaultInterpolationTime",
      value: function setDefaultInterpolationTime(duration) {
        this.timedRot.default_duration = duration;
        this.timedPan.default_duration = duration;
        this.timedzoom.default_duration = duration;
      }
      /** 
       * sets the rotation constraint for each axis separately.
       *
       * @param {boolean} yaw constraint
       * @param {boolean} pitch constraint
       * @param {boolean} roll constraint
       */

    }, {
      key: "setRotationConstraint",
      value: function setRotationConstraint(yaw, pitch, roll) {
        var cam = this.cam;
        cam.FIXED_CONSTRAINT = 0;
        cam.FIXED_CONSTRAINT |= yaw ? cam.AXIS.YAW : 0;
        cam.FIXED_CONSTRAINT |= pitch ? cam.AXIS.PITCH : 0;
        cam.FIXED_CONSTRAINT |= roll ? cam.AXIS.ROLL : 0;
      }
      /**
       * 
       * begin screen-aligned 2D-drawing.
       * 
       * <pre>
       * beginHUD()
       *   disabled depth test
       *   ortho
       *   ... your code is executed here ...
       * endHUD()
       * </pre>
       * 
       */

    }, {
      key: "beginHUD",
      value: function beginHUD(renderer, w, h) {
        var cam = this.cam;
        renderer = renderer || cam.renderer;
        if (!renderer) return;
        renderer.push();
        var gl = renderer.drawingContext;
        var w = w !== undefined ? w : renderer.width;
        var h = h !== undefined ? h : renderer.height;
        var d = Number.MAX_VALUE;
        gl.flush(); // gl.finish();
        // 1) disable DEPTH_TEST

        gl.disable(gl.DEPTH_TEST); // 2) push modelview/projection
        //    p5 is not creating a push/pop stack

        this.pushed_uMVMatrix = renderer.uMVMatrix.copy();
        this.pushed_uPMatrix = renderer.uPMatrix.copy(); // 3) set new modelview (identity)

        renderer.resetMatrix(); // 4) set new projection (ortho)

        renderer.ortho(0, w, -h, 0, -d, +d); // renderer.ortho();
        // renderer.translate(-w/2, -h/2);
      }
      /**
       * 
       * end screen-aligned 2D-drawing.
       * 
       */

    }, {
      key: "endHUD",
      value: function endHUD(renderer) {
        var cam = this.cam;
        renderer = renderer || cam.renderer;
        if (!renderer) return;
        var gl = renderer.drawingContext;
        gl.flush(); // gl.finish();
        // 2) restore modelview/projection

        renderer.uMVMatrix.set(this.pushed_uMVMatrix);
        renderer.uPMatrix.set(this.pushed_uPMatrix); // 1) enable DEPTH_TEST

        gl.enable(gl.DEPTH_TEST);
        renderer.pop();
      }
    }]);

    return EasyCam;
  }();
  /**
   * Damped callback, that accepts the resulting damped/smooth value.
   *
   * @callback dampedCallback
   * @param {double} value - the damped/smoothed value
   *
   */

  /**
   *
   * DampedAction, for smoothly changing a value to zero.
   *
   * @param {dampedCallback} cb - callback that accepts the damped value as argument.
   */


  var DampedAction = /*#__PURE__*/function () {
    /**  @constructor */
    function DampedAction(cb) {
      _classCallCheck(this, DampedAction);

      this.value = 0.0;
      this.damping = 0.85;
      this.action = cb;
    }
    /** adds a value to the current value beeing damped. 
     * @param {double} force - the value beeing added.
     */


    _createClass(DampedAction, [{
      key: "addForce",
      value: function addForce(force) {
        this.value += force;
      }
      /** updates the damping and calls {@link damped-callback}. */

    }, {
      key: "update",
      value: function update() {
        var active = this.value * this.value > 0.000001;

        if (active) {
          this.action(this.value);
          this.value *= this.damping;
        } else {
          this.stop();
        }

        return active;
      }
      /** stops the damping. */

    }, {
      key: "stop",
      value: function stop() {
        this.value = 0.0;
      }
    }]);

    return DampedAction;
  }();
  /**
   * Interpolation callback, that implements any form of interpolation between
   * two values A and B and the interpolationparameter t.
   * <pre>
   *   linear: A * (1-t) + B * t
   *   smooth, etc...
   * </pre>
   * @callback interpolationCallback
   * @param {Object} A - First Value
   * @param {Object} B - Second Value
   * @param {double} t - interpolation parameter [0, 1]
   *
   */

  /**
   *
   * Interpolation, for smoothly changing a value by interpolating it over time.
   *
   * @param {interpolationCallback} cb - callback for interpolating between two values.
   */


  var Interpolation = /*#__PURE__*/function () {
    /**  @constructor */
    function Interpolation(cb) {
      _classCallCheck(this, Interpolation);

      this.default_duration = 300;
      this.action = cb;
    }
    /** starts the interpolation.
     *  If the given interpolation-duration is 0, then
     * {@link interpolation-callback} is called immediately.
     */


    _createClass(Interpolation, [{
      key: "start",
      value: function start(valA, valB, duration, actions) {
        for (var x in actions) {
          actions[x].stop();
        }

        this.valA = valA;
        this.valB = valB;
        this.duration = duration === undefined ? this.default_duration : duration;
        this.timer = new Date().getTime();
        this.active = this.duration > 0;

        if (!this.active) {
          this.interpolate(1);
        }
      }
      /** updates the interpolation and calls {@link interpolation-callback}.*/

    }, {
      key: "update",
      value: function update() {
        if (this.active) {
          var t = (new Date().getTime() - this.timer) / this.duration;

          if (t > 0.995) {
            this.interpolate(1);
            this.stop();
          } else {
            this.interpolate(t);
          }
        }
      }
    }, {
      key: "interpolate",
      value: function interpolate(t) {
        this.action(this.valA, this.valB, t);
      }
      /** stops the interpolation. */

    }, {
      key: "stop",
      value: function stop() {
        this.active = false;
      }
    }]);

    return Interpolation;
  }(); ////////////////////////////////////////////////////////////////////////////////
  //
  // ROTATION (Quaternion)
  //
  ////////////////////////////////////////////////////////////////////////////////

  /**
   * Rotation as Quaternion [q0, q1, q2, q3]
   *
   * Note: Only functions that were required for the EasyCam to work are implemented.
   * 
   * @namespace
   */


  var Rotation = {
    assert: function assert(dst) {
      return dst === undefined || dst.constructor !== Array ? [1, 0, 0, 0] : dst;
    },

    /** @returns {Number[]} an identity rotation [1,0,0,0] */
    identity: function identity() {
      return [1, 0, 0, 0];
    },

    /** 
     * Applies the rotation to a vector and returns dst or a new vector.
     *
     * @param {Number[]} rot - Rotation (Quaternion)
     * @param {Number[]} vec - vector to be rotated by rot
     * @param {Number[]} dst - resulting vector
     * @returns {Number[]} dst- resulting vector
     */
    applyToVec3: function applyToVec3(rot, vec, dst) {
      var _vec = _slicedToArray(vec, 3),
          x = _vec[0],
          y = _vec[1],
          z = _vec[2];

      var _rot = _slicedToArray(rot, 4),
          q0 = _rot[0],
          q1 = _rot[1],
          q2 = _rot[2],
          q3 = _rot[3];

      var s = q1 * x + q2 * y + q3 * z;
      dst = Vec3.assert(dst);
      dst[0] = 2 * (q0 * (x * q0 - (q2 * z - q3 * y)) + s * q1) - x;
      dst[1] = 2 * (q0 * (y * q0 - (q3 * x - q1 * z)) + s * q2) - y;
      dst[2] = 2 * (q0 * (z * q0 - (q1 * y - q2 * x)) + s * q3) - z;
      return dst;
    },

    /** 
     * Applies the rotation to another rotation and returns dst or a new rotation.
     *
     * @param {Number[]} rotA - RotationA (Quaternion)
     * @param {Number[]} rotB - RotationB (Quaternion)
     * @param {Number[]} dst - resulting rotation
     * @returns {Number[]} dst - resulting rotation
     */
    applyToRotation: function applyToRotation(rotA, rotB, dst) {
      var _rotA = _slicedToArray(rotA, 4),
          a0 = _rotA[0],
          a1 = _rotA[1],
          a2 = _rotA[2],
          a3 = _rotA[3];

      var _rotB = _slicedToArray(rotB, 4),
          b0 = _rotB[0],
          b1 = _rotB[1],
          b2 = _rotB[2],
          b3 = _rotB[3];

      dst = Rotation.assert(dst);
      dst[0] = b0 * a0 - (b1 * a1 + b2 * a2 + b3 * a3);
      dst[1] = b1 * a0 + b0 * a1 + (b2 * a3 - b3 * a2);
      dst[2] = b2 * a0 + b0 * a2 + (b3 * a1 - b1 * a3);
      dst[3] = b3 * a0 + b0 * a3 + (b1 * a2 - b2 * a1);
      return dst;
    },

    /** 
     * Interpolates a rotation.
     *
     * @param {Number[]} rotA - RotationA (Quaternion)
     * @param {Number[]} rotB - RotationB (Quaternion)
     * @param {Number  } t - interpolation parameter
     * @param {Number[]} dst - resulting rotation
     * @returns {Number[]} dst - resulting rotation
     */
    slerp: function slerp(rotA, rotB, t, dst) {
      var _rotA2 = _slicedToArray(rotA, 4),
          a0 = _rotA2[0],
          a1 = _rotA2[1],
          a2 = _rotA2[2],
          a3 = _rotA2[3];

      var _rotB2 = _slicedToArray(rotB, 4),
          b0 = _rotB2[0],
          b1 = _rotB2[1],
          b2 = _rotB2[2],
          b3 = _rotB2[3];

      var cosTheta = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;

      if (cosTheta < 0) {
        b0 = -b0;
        b1 = -b1;
        b2 = -b2;
        b3 = -b3;
        cosTheta = -cosTheta;
      }

      var theta = Math.acos(cosTheta);
      var sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);
      var w1, w2;

      if (sinTheta > 0.001) {
        w1 = Math.sin((1.0 - t) * theta) / sinTheta;
        w2 = Math.sin(t * theta) / sinTheta;
      } else {
        w1 = 1.0 - t;
        w2 = t;
      }

      dst = Rotation.assert(dst);
      dst[0] = w1 * a0 + w2 * b0;
      dst[1] = w1 * a1 + w2 * b1;
      dst[2] = w1 * a2 + w2 * b2;
      dst[3] = w1 * a3 + w2 * b3;
      return Rotation.create({
        rotation: dst,
        normalize: true
      }, dst);
    },

    /** 
     * Creates/Initiates a new Rotation
     *
     * <pre>
     *
     *    1) Axis,Angle:
     *       {
     *         axis : [x, y, z],
     *         angle: double
     *       }
     *      
     *    2) Another Rotation:
     *       {
     *         rotation : [q0, q1, q2, q3],
     *         normalize: boolean
     *       }
     *      
     *    3) 3 euler angles, XYZ-order:
     *       {
     *         angles_xyz : [rX, rY, rZ]
     *       }
     *   
     * </pre>
     *
     *
     * @param {Object} def - Definition, for creating the new Rotation
     * @param {Number[]} dst - resulting rotation
     * @returns {Number[]} dst - resulting rotation
     */
    create: function create(def, dst) {
      dst = Rotation.assert(dst); // 1) from axis and angle

      if (def.axis) {
        var axis = def.axis;
        var angle = def.angle;
        var norm = Vec3.mag(axis);
        if (norm == 0.0) return; // vector is of zero length

        var halfAngle = -0.5 * angle;
        var coeff = Math.sin(halfAngle) / norm;
        dst[0] = Math.cos(halfAngle);
        dst[1] = coeff * axis[0];
        dst[2] = coeff * axis[1];
        dst[3] = coeff * axis[2];
        return dst;
      } // 2) from another rotation


      if (def.rotation) {
        dst[0] = def.rotation[0];
        dst[1] = def.rotation[1];
        dst[2] = def.rotation[2];
        dst[3] = def.rotation[3];

        if (def.normalize) {
          var inv = 1.0 / Math.sqrt(dst[0] * dst[0] + dst[1] * dst[1] + dst[2] * dst[2] + dst[3] * dst[3]);
          dst[0] *= inv;
          dst[1] *= inv;
          dst[2] *= inv;
          dst[3] *= inv;
        }

        return dst;
      } // 3) from 3 euler angles, order XYZ


      if (def.angles_xyz) {
        var ax = -0.5 * def.angles_xyz[0];
        var ay = -0.5 * def.angles_xyz[1];
        var az = -0.5 * def.angles_xyz[2];
        var rotX = [Math.cos(ax), Math.sin(ax), 0, 0];
        var rotY = [Math.cos(ay), 0, Math.sin(ay), 0];
        var rotZ = [Math.cos(az), 0, 0, Math.sin(az)];
        Rotation.applyToRotation(rotY, rotZ, dst);
        Rotation.applyToRotation(rotX, dst, dst);
        return dst;
      }
    } //
    // ... to be continued ...
    //

  }; ////////////////////////////////////////////////////////////////////////////////
  //
  // SCALAR
  //
  ////////////////////////////////////////////////////////////////////////////////

  /**
   * Scalar as a simple number.
   *
   * Note: Only functions that were required for the EasyCam to work are implemented.
   *
   * @namespace
   */

  var Scalar = {
    /**
     * Linear interpolation between A and B using t[0,1]
     */
    mix: function mix(a, b, t) {
      return a * (1 - t) + b * t;
    },

    /**
     * modifying t as a function of smoothstep(0,1,t);
     */
    smoothstep: function smoothstep(x) {
      return x * x * (3 - 2 * x);
    },

    /**
     * modifying t as a function of smootherstep(0,1,t);
     */
    smootherstep: function smootherstep(t) {
      return x * x * x * (x * (x * 6 - 15) + 10);
    }
  }; ////////////////////////////////////////////////////////////////////////////////
  //
  // VEC3
  //
  ////////////////////////////////////////////////////////////////////////////////

  /**
   * Vec3 as a 3D vector (Array)
   *
   * @namespace
   */

  var Vec3 = {
    assert: function assert(dst) {
      return dst === undefined || dst.constructor !== Array ? [0, 0, 0] : dst;
    },
    isScalar: function isScalar(arg) {
      // TODO: do some profiling to figure out what fails
      return arg !== undefined && arg.constructor !== Array; // return typeof(arg) === 'number';
    },

    /** addition: <pre> dst = a + b </pre>  */
    add: function add(a, b, dst) {
      dst = this.assert(dst);

      if (this.isScalar(b)) {
        dst[0] = a[0] + b;
        dst[1] = a[1] + b;
        dst[2] = a[2] + b;
      } else {
        dst[0] = a[0] + b[0];
        dst[1] = a[1] + b[1];
        dst[2] = a[2] + b[2];
      }

      return dst;
    },

    /** componentwise multiplication: <pre> dst = a * b </pre>  */
    mult: function mult(a, b, dst) {
      dst = this.assert(dst);

      if (this.isScalar(b)) {
        dst[0] = a[0] * b;
        dst[1] = a[1] * b;
        dst[2] = a[2] * b;
      } else {
        dst[0] = a[0] * b[0];
        dst[1] = a[1] * b[1];
        dst[2] = a[2] * b[2];
      }

      return dst;
    },

    /** squared length  */
    magSq: function magSq(a) {
      return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
    },

    /** length  */
    mag: function mag(a) {
      return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
    },

    /** dot-product  */
    dot: function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    },

    /** cross-product  */
    cross: function cross(a, b, dst) {
      dst = this.assert(dst);
      dst[0] = a[1] * b[2] - a[2] * b[1];
      dst[1] = a[2] * b[0] - a[0] * b[2];
      dst[2] = a[0] * b[1] - a[1] * b[0];
      return dst;
    },

    /** angle  */
    angle: function angle(v1, v2) {
      var normProduct = this.mag(v1) * this.mag(v2);

      if (normProduct === 0.0) {
        return 0.0; // at least one vector is of zero length
      }

      var dot = this.dot(v1, v2);
      var threshold = normProduct * 0.9999;

      if (dot < -threshold || dot > threshold) {
        // the vectors are almost aligned, compute using the sine
        var v3 = this.cross(v1, v2);

        if (dot >= 0) {
          return Math.asin(this.mag(v3) / normProduct);
        } else {
          return Math.PI - Math.asin(this.mag(v3) / normProduct);
        }
      } // the vectors are sufficiently separated to use the cosine


      return Math.acos(dot / normProduct);
    },

    /** linear interpolation: <pre> dst = a * (1 - t) + b * t </pre> */
    mix: function mix(a, b, t, dst) {
      dst = this.assert(dst);
      dst[0] = Scalar.mix(a[0], b[0], t);
      dst[1] = Scalar.mix(a[1], b[1], t);
      dst[2] = Scalar.mix(a[2], b[2], t);
      return dst;
    } //
    // ... to be continued ...
    //

  }; ////////////////////////////////////////////////////////////////////////////////
  //
  // public objects
  //
  ////////////////////////////////////////////////////////////////////////////////

  /**
   * @static
   */

  EasyCam.INFO = INFO; // make static

  Object.freeze(INFO); // and constant

  ext = ext !== undefined ? ext : {};
  /**
   * @memberof Dw
   */

  ext.EasyCam = EasyCam;
  /**
   * @memberof Dw
   */

  ext.DampedAction = DampedAction;
  /**
   * @memberof Dw
   */

  ext.Interpolation = Interpolation;
  /**
   * @memberof Dw
   */

  ext.Rotation = Rotation;
  /**
   * @memberof Dw
   */

  ext.Vec3 = Vec3;
  /**
   * @memberof Dw
   */

  ext.Scalar = Scalar;
  return ext;
}(Dw); ////////////////////////////////////////////////////////////////////////////////
//
// p5 patches, bug fixes, workarounds, ...
//
////////////////////////////////////////////////////////////////////////////////

/**
 * @submodule Camera
 * @for p5
 */


if (p5) {
  /**
   * p5.EasyCam creator function. 
   * Arguments are optional, and equal to the default EasyCam constructor.
   * @return {EasyCam} a new EasyCam
   */
  p5.prototype.createEasyCam = function ()
  /* p5.RendererGL, {state} */
  {
    var renderer = this._renderer;
    var args = arguments[0];

    if (arguments[0] instanceof p5.RendererGL) {
      renderer = arguments[0];
      args = arguments[1]; // could still be undefined, which is fine
    }

    return new Dw.EasyCam(renderer, args);
  };
  /**
   * Overriding the current p5.ortho();
   *
   * p5 v0.5.16
   * temporary bugfix for https://github.com/processing/p5.js/pull/2463.
   *
   * @param  {Number} left   camera frustum left plane
   * @param  {Number} right  camera frustum right plane
   * @param  {Number} bottom camera frustum bottom plane
   * @param  {Number} top    camera frustum top plane
   * @param  {Number} near   camera frustum near plane
   * @param  {Number} far    camera frustum far plane
   * @return {p5}            the p5 object
   */


  p5.prototype.ortho = function () {
    this._renderer.ortho.apply(this._renderer, arguments);

    return this;
  };

  p5.RendererGL.prototype.ortho = function (left, right, bottom, top, near, far) {
    if (left === undefined) left = -this.width / 2;
    if (right === undefined) right = +this.width / 2;
    if (bottom === undefined) bottom = -this.height / 2;
    if (top === undefined) top = +this.height / 2;
    if (near === undefined) near = 0;
    if (far === undefined) far = Math.max(this.width, this.height);
    var w = right - left;
    var h = top - bottom;
    var d = far - near;
    var x = +2.0 / w;
    var y = +2.0 / h;
    var z = -2.0 / d;
    var tx = -(right + left) / w;
    var ty = -(top + bottom) / h;
    var tz = -(far + near) / d;
    this.uPMatrix = p5.Matrix.identity();
    this.uPMatrix.set(x, 0, 0, 0, 0, -y, 0, 0, 0, 0, z, 0, tx, ty, tz, 1);
    this._curCamera = 'custom';
  };
}