// use strict
// Create a Paper.js Path to draw a line into it:
var path = new Path();

// Give the stroke a color
path.strokeColor = 'black';
var start = new Point(100, 100);

// Move to start and draw a line from there
path.moveTo(start);

// Note the plus operator on Point objects.
// PaperScript does that for us, and much more!
path.lineTo(start.length * 3 + [ 100, -50 ]);

var otherPath = new Path();
otherPath.strokeColor = 'green';
otherPath.add(new Point(0, 0), new Point(0, 100));
otherPath.angle = 200;