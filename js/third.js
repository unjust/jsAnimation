import { paper, Shape, Point } from 'paper';

(function myApp() {
    paper.setup(document.getElementById("myCanvas"));

    const viewCenter = paper.view.center,
        origin = new Point(paper.view.center.x, paper.view.center.y);
    
    const circle = new Shape.Circle({
        center: origin,
        radius: 10,
        strokeColor: 'orange'
    });

    //debugger
    console.log(circle.center);
    let count = 0,
        xradius = 50,
        yradius = 100;

    paper.view.onFrame = (e) => {
        count += .1;
        circle.position = { 
            x :  origin.x + (Math.sin(count) * xradius),
            y :  origin.y + (Math.cos(count) * yradius)
        };
    };

})();