import { paper, Point, Path, Group } from 'paper';

(function myApp() {

    paper.setup(document.getElementById("myCanvas"));

    const view_center = paper.view.center;
    
    const cubeWidth = 20,
        cubeHeight = 20;

    let path1, path2;
    const drawPath = function() {
        path1 = new Path.Line(new Point(0, 0), new Point(cubeWidth/2, cubeHeight/2));
        path2 = new Path.Line(new Point(0, cubeHeight), new Point(cubeWidth/2, cubeHeight + cubeHeight/2));
        path1.strokeColor = 'black';
        path2.strokeColor = 'blue';
    }   

    paper.view.onMouseDown = (event) => {
        // interaction here
    };

    drawPath();

    var group = new Group();
	var hexagon = new Path.RegularPolygon({
		center: view_center,
		sides: 6,
		radius: 50,
		fillColor: 'blue',
		parent: group
    });
    
    for (let i = 0; i < 2; i++) {
        let p = new Path({
            fillColor: (i % 2) ? 'red' : 'green',
            closed: true
        });
        for (let j = 0; j < 3; j++ ) {
            p.add(hexagon.segments[(i * 2) + j].clone());
        }
        p.add(hexagon.bounds.center);
    }

    paper.view.onFrame = (e) => {
        // animation here
        path1.add(new Point(30, 75));
        path2.add(new Point(50, 75));
        hexagon.rotate(1);
    };

})();