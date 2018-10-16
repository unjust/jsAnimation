import { paper, Shape, Point } from 'paper';

(function myApp() {

    paper.setup(document.getElementById("myCanvas"));

    const view_center = paper.view.center,
        origin = new Point(view_center.x, view_center.y);
    
    
    paper.view.onMouseDown = (event) => {
        // interaction here
    };

        
    paper.view.onFrame = (e) => {
        // animation here
    };

})();