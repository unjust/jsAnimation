import { paper, Path, Symbol, Group, Point } from 'paper';

(function myApp() {

    paper.setup(document.getElementById("myCanvas"));
    const view_center = paper.view.center;
    
    let active = false;

    const MAX_SYMBOLS = 10;
    const groupWidth = paper.view.size.width / 20;
    const groupHeight = 80;
    let cursorPoint;

    const createGroup = () => {
        const radius = groupWidth/2;
        const circle = Path.Circle(new Point(groupWidth/2, groupHeight - radius), radius);
        circle.fillColor = 'red';
        circle.fullySelected = true;
    
        const triangle = new Path([ 
            new Point(0, 0), 
            new Point(new Point(groupWidth/2, groupHeight - 20)), 
            new Point(new Point(groupWidth, 0))
        ]);

        triangle.fillColor = 'blue';
        triangle.closed = true;
        triangle.fullySelected = true;

        return new Group({
            children: [ circle, triangle ]
        });
    }


    const symbol = new Symbol(createGroup());
    let instances = [];
    const addInstance = (point = new Point(groupWidth/2, groupHeight/2)) => {
        instances.push(symbol.place(point));
        // instances[instances.length - 1].selected = true;
    }
    
    addInstance();

    paper.view.onMouseDown = (event) => {
        // interaction here
        console.log('clicked');
    };
 
    paper.view.onMouseMove = (event) => {
        // interaction here
        if (!active && instances[0].hitTest(event.point)) {
            active = true;
            console.log("activated");
        }
        cursorPoint = event.point;
        if (instances.length < MAX_SYMBOLS) {
            addInstance();
        }
    };

    paper.view.onFrame = (event) => {
    
        // for as far away + velocity that the mouse is
        // generate a symbol + place it (with a max)

        // if they catch up
        // destroy the symbol

        // set all current symbols in motion
        // chasing the mouse cursor
        // at a certain velocity
        // and easing
        

        if (active) {
            // console.log(instances[0].position);
            instances.forEach((inst, i) => {
                const delta = (cursorPoint).subtract(inst.position);
                inst.position = (inst.position).add(delta.divide(i * 2));
                
                // if (i > 1 && delta.x < 1 && delta.y < 1) {
                //     inst.remove();
                // }
            });
        }
    };

})();   