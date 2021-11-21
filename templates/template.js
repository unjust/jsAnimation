import { paper } from 'paper';

(function myApp() {

    paper.setup(document.getElementById("myCanvas"));

    const view_center = paper.view.center;
    
    paper.view.onMouseDown = (event) => {
        // interaction here
        console.log('clicked');
    };

        
    paper.view.onFrame = (e) => {
        // animation here
        console.log('hello world', view_center);
    };

})();