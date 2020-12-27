import { paper, Path, Point, PointText } from 'paper';

(function HelloWorld() {

    paper.setup(document.getElementById("myCanvas"));
    const view = paper.view;

    // Create a Paper.js Path to draw a line into it:
    let path = new Path();

    // Give the stroke a color
    path.strokeColor = 'green';
    path.strokeWidth = 3;

    path.add(new Point(0, 50), new Point(100, 100))
    path.insert(1, new Point(40, 50));
    path.closed = true;
   
    const text = new PointText({
        point: view.center,
        fontSize: 30,
        fillColor: 'black',
        justifiction: 'center'
    });

    const getDestination = () => Point.random().multiply(view.size);
    let destination = getDestination();
    
    paper.view.onFrame = function(e) {
        
        let vector = destination.subtract(text.position);
        text.position = text.position.add(vector.divide(30));
        text.content = `LOL ${Math.round(vector.length)}`;
        // console.log(vector.length);
        if (vector.length < 5) {
            destination = getDestination();
        }
    }
})();