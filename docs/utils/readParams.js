"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasFrameParam = void 0;

var getParams = function getParams() {
  return new URLSearchParams(window.location.search);
};

var hasFrameParam = function hasFrameParam() {
  return getParams().has('frame');
}; // frameCount count to an interesting frame
// framerate slow down
// export interesting frame

/*
saveFrames(filename, extension, duration, framerate, [callback])
saveFrames('out', 'png', 1, 25, data => {
  print(data);
});
*/


exports.hasFrameParam = hasFrameParam;