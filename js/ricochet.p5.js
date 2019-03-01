import p5 from 'p5';

new p5((sketch) => {

	const canvas_w = 800,
		canvas_h = 600;


	const vel = 10;

	// t, r, b, l
	const normals = [
		sketch.createVector(1,1),
		sketch.createVector(-1,1),
		sketch.createVector(1,-1),
		sketch.createVector(1,-1)
	];

	/**
	 * @function hit
	 * @param {Vector} v 
	 * @returns {String, Boolean} what edge it hit or false if none
	 */
	
	 // need to more accuratel calculate what will hit,
	 // could hit a corner
	const hit = (v) => {
		console.log("calling hit test with v is ", v);
		if (v.y <= 0) {
			return 't';
		} else if (v.x >= canvas_w) {
			return 'r';
		} else if (v.y >= canvas_h) {
			return 'b'
		} else if (v.x <= 0) {
			return 'l'
		} 
		return false;
	};

	// trying to prevent changing directions
	// too much if we are out of bounds
	const isInBounds = (v) => !hit(v);

	const getNewDirection = (direction) => {
		let d = Math.floor(Math.random() * Math.floor(normals.length));
		return (d != direction) ? d : getNewDirection(d);
	};

	/**
	 *  @returns percentage RGBA notation stroke('rgba(100%,0%,100%,0.5)');
	 */
	const randomColor = (opacity = 1.0) => new Array(3).fill(0).map(() => Math.ceil(Math.random() * 100));

	const Ray = function(x1=100, y1=100, vel=.2, mag=100) {
	
		this.velocity = vel;
		this.maxMagnitude = mag; // magnitude ??

		this.currentDirectionIndex = 0;
		this.currentColor = randomColor();

		// start by storing initial vertex
		this.vertices = [ sketch.createVector(x1, y1) ];

		// the last point in our buffer
		this.lastVertex = () => this.vertices[this.vertices.length - 1];
		
		this.setColor = (c) => this.color = c;
	
		this.getMagnitude = () => {
			const mag = p5.Vector.sub(this.vertices[0], this.lastVertex()).mag();
			
			const a = (this.vertices[0].x - this.vertices[this.vertices.length - 1].x);
			const b = (this.vertices[0].y - this.vertices[this.vertices.length - 1].y);
			const mag2 = Math.sqrt(a*a + b*b);
			console.log(a, b, mag, mag2, this.vertices.length); 
			return mag;
		}
		
		// https://processing.org/examples/accelerationwithvectors.html
		// http://www.mightydrake.com/Articles/ricochet.htm
		//https://gamedev.stackexchange.com/questions/23672/determine-resulting-angle-of-wall-collision
	
		this.update = () => {
			// if this thing is less than the magnitude we want, add a vertex
			if (this.getMagnitude() > this.maxMagnitude) {
				this.vertices.pop();
			}
			const newVertex = (this.vertices[0].copy()).add(normals[this.currentDirectionIndex]);
			this.vertices.unshift(newVertex);
			
			// console.log(`start = ${this.vertices[0]}, end = ${this.lastVertex()}`);
	
			if (hit(this.vertices[0])) {
				// debugger
				this.currentColor = randomColor();
				this.currentDirectionIndex = getNewDirection(this.currentDirectionIndex);
				console.log("now the direction is", this.currentDirectionIndex);
			}
		};

		this.draw = () => {
			//sketch.push();
			//sketch.translate(this.lastVertex().x, this.lastVertex().y);
			sketch.stroke(`rgba(${this.currentColor[0]},${this.currentColor[1]},${this.currentColor[2]},1.0)`);
			
			for (let v = 0; v < this.vertices.length; v++) {
				sketch.point(this.vertices[v].x, this.vertices[v].y);
			}
			
			sketch.stroke('yellow');
			sketch.point(this.vertices[0].x, this.vertices[0].y);
			//sketch.pop();
		}
	}


	let ray;

	sketch.setup = () => {
		const c = sketch.createCanvas(canvas_w, canvas_h, p5.WEBGL);
		c.parent('container');
		sketch.fill('white');
		sketch.strokeWeight(4);
		ray = new Ray();
	};

	sketch.draw = () => {
		sketch.clear();
		ray.update();
		ray.draw();
	};
});