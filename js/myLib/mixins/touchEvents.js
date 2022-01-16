// https://github.com/freshfork/p5.EasyCam/blob/master/p5.easycam.js
/**
@description
override/extend events to support touch
in particular projects

@example
easycam = createEasyCam.bind(sk)();
extendTouchEasycam(easycam, {
  dbltap: (e) => {
    sk.keyPressed(e);
    sk.keyIsPressed = !sk.keyIsPressed;
  },
  // touchmoveMulti: (e) => {
  //   sk.keyIsPressed = true;
  // }
})

@events
in easycam:
'touchstart'
'dbltap'
'touchmoveSingle'
'touchmoveMulti'
**/

export const extendTouchEasycam = function(easycam, opts) {
  for (let prop in opts) {
    if (easycam.mouse[prop]) {
      easycam.mouse[prop] = opts[prop];
    }
  }
  easycam.removeMouseListeners(); // remove what has been defined and reattach overrides
  easycam.attachMouseListeners();
} 
