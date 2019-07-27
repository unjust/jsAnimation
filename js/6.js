import { paper, Path, Symbol, Group, Point } from 'paper';

(function myApp() {

    paper.setup(document.getElementById("myCanvas"));
    const view_center = paper.view.center;
    
    const NUM_GROUPS = 120;

    const groupWidth = paper.view.size.width / 20;
    const groupHeight = 80;

    // const texture1 = new Raster("img/gradient-1.png", view_center);
    // texture1.width = 300;
    // texture1.height = 300;
    // texture1.blendMode = 'source-atop';
  
    // const layer = new Group([ circle, texture1 ]);
    // circle.blendMode = 'hard-light';
    

    const radius = groupWidth/2;
    const circle = Path.Circle(new Point(groupWidth/2, groupHeight - radius), radius);
    circle.fillColor = 'red';
   
    const triangle = new Path([ 
        new Point(0, 0), 
        new Point(new Point(groupWidth/2, groupHeight - 20)), 
        new Point(new Point(groupWidth, 0))
    ]);

    triangle.fillColor = 'blue';

    const arr = new Array(NUM_GROUPS).fill(1);
    const symbolGroups = arr.map((val, i) => new Symbol(
        new Group({
            children: [ circle.clone(), triangle.clone() ]
        })
    ));
    for (let i = 0; i < symbolGroups.length; i++) {
        const xpos = i * groupWidth;
        const row = Math.floor(xpos / paper.view.size.width);
        const point = new Point(
            xpos - (row * paper.view.size.width),
            row * groupHeight
        );
        console.log(point);
        symbolGroups[i].place(point);
    };

    circle.visible = false;
    triangle.visible = false;

    paper.view.onMouseDown = (event) => {
        // interaction here
        console.log('clicked');
    };
 
    paper.view.onFrame = (event) => {
        // animation here
        symbolGroups.map((symbol, i) => 
            symbol.definition.translate([ Math.sin(event.time + i), Math.cos(event.time + i)])
        );
        // console.log('hello world', view_center);
    };

})();