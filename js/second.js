import { paper, Path, Point } from 'paper';

const iter = (times, fn) => {
    let arr = [];
    while (times > 0) {
        arr.push(fn());
        times--;
    }
    return arr;
}

const getVector = (path) => path.segments[1].point.subtract(path.segments[0].point);
const getEndAngle = (angle, index) => angle + (-90);

(function HelloWorld() {
    paper.setup(document.getElementById("myCanvas2"));

    const view = paper.view;
    const w = view.size.width;
    const h = view.size.height;
    const NUM_PATHS = 4;

    let index = 0;
    let drawNext = true;

    let path = new Path({
        strokeColor: 'green',
        strokeWidth: 3,
        selected: false
    });
    path.add(new Point(w/2, h/2), new Point(w/2 + 100, h/2));
    let endAngle = getEndAngle(getVector(path).angle, index);
    path.pivot = path.segments[0].point;

    let currentPath,
        previousPath = path,
        pathsArr = [];


    const angles = [0, -90, -180, 90];

    paper.view.onMouseDown = function(event) {
        // Add a segment to the path at the position of the mouse:
       drawNext = true;
    }

    paper.view.onFrame = function(e) {
        if (index > NUM_PATHS || (!currentPath && drawNext === false)) {
            return;
        }

        const alternate = (index % 2);

        if (!currentPath) {
            currentPath = previousPath.clone();
            currentPath.pivot = currentPath.segments[alternate].point;
            currentPath.selected = true;
            pathsArr.push(currentPath);

            endAngle = angles[index];

            previousPath.selected = false;

            index++;
            previousPath = currentPath;
            drawNext = false;
        }

        const angle = getVector(currentPath).angle;
        const diff = endAngle - angle,
            delta = Math.abs(diff);
        console.log(`${index} ---- angle: ${angle}, end: ${endAngle}, delta: ${delta}`);
       
        if (delta > 2.0) {
            currentPath.rotate(-1.0); 
        } else {
            console.log(`will rotate by ${diff}`);
            currentPath.rotate(diff); 
            console.log(`after rotate ${getVector(currentPath).angle}`);
            currentPath = null;
        }

        // get the second point
        // minus the first point
    }
})();