import { paper, Point, Path, Group } from 'paper';

(function myApp() {

    paper.setup(document.getElementById("myCanvas"));

    const view_center = paper.view.center;
    
    const cube = {
        size: 50,
        sides: 6,
        color: 'blue'
    };

    
    const drawPath = function() {
        path1 = new Path.Line(new Point(0, 0), new Point(cubeWidth/2, cubeHeight/2));
        path2 = new Path.Line(new Point(0, cubeHeight), new Point(cubeWidth/2, cubeHeight + cubeHeight/2));
        path1.strokeColor = 'black';
        path2.strokeColor = 'blue';
    }   

    paper.view.onMouseDown = (event) => {
        // interaction here
    };

    // drawPath();

    var outlineCubeGroup = new Group();

	var hexagon = new Path.RegularPolygon({
		center: view_center,
		sides: cube.sides,
		radius: cube.size,
        strokeColor: cube.color,
        closed: true,
		parent: outlineCubeGroup
    });
    
    // inner
    for (let i = 0; i < 3; i++) {
        const point = hexagon.segments[i * 2];

        let p = new Path({
            segments: [point.clone(), hexagon.bounds.center],
            strokeColor: cube.color,
            parent: outlineCubeGroup
        });       
    }
    
    const getPoint = (i) => i < hexagon.segments.length ? hexagon.segments[i] : 0;

    let currentIndex = 0,
        currentPoint = getPoint(currentIndex),
        nextPoint = getPoint(currentIndex + 1);
    let tracedShape = new Path({
        strokeColor: 'red'
    });

    paper.view.onFrame = (e) => {
        // animation here
        // path1.add(new Point(30, 75));
        // path2.add(new Point(50, 75));
        // group.rotate(1);
        debugger
        const vector = nextPoint.subtract(currentPoint),
            fraction = vector/100;
        if (vec < 0) {
            tracedShape.add(fraction);
        } else {
            currentPoint = nextPoint;
            nextPoint = getNextPoint(currentIndex++);
        }
        tracedShape.add(currentPoint);
        
    };

})();