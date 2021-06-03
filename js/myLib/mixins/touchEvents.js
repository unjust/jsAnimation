// https://github.com/freshfork/p5.EasyCam/blob/master/p5.easycam.js
/*
'touchstart'
'dbltap'
'touchmoveSingle'
'touchmoveMulti'
*/
export const extendTouchEasycam = function(easycam, opts) {
  for (let prop in opts) {
    if (easycam.mouse[prop]) {
      easycam.mouse[prop] = opts[prop];
    }
  }
  easycam.removeMouseListeners();
  easycam.attachMouseListeners();
} 
