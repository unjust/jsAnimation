"use strict";

var _paper = require("paper");

(function HelloWorld() {
  _paper.paper.setup(document.getElementById("myCanvas"));

  var view = _paper.paper.view; // Create a Paper.js Path to draw a line into it:

  var path = new _paper.Path(); // Give the stroke a color

  path.strokeColor = 'green';
  path.strokeWidth = 3;
  path.add(new _paper.Point(0, 50), new _paper.Point(100, 100));
  path.insert(1, new _paper.Point(40, 50));
  path.closed = true;
  var text = new _paper.PointText({
    point: view.center,
    fontSize: 30,
    fillColor: 'black',
    justifiction: 'center'
  });

  var getDestination = function getDestination() {
    return _paper.Point.random().multiply(view.size);
  };

  var destination = getDestination();

  _paper.paper.view.onFrame = function (e) {
    var vector = destination.subtract(text.position);
    text.position = text.position.add(vector.divide(30));
    text.content = "LOL ".concat(Math.round(vector.length)); // console.log(vector.length);

    if (vector.length < 5) {
      destination = getDestination();
    }
  };
})();