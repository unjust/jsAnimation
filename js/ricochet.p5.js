import p5 from 'p5';

new p5((s) => {

	const canvas_w = 800,
		canvas_h = 600;


	const vel = 10;

	// t, r, b, l
	const normals = [
		s.createVector(1,1),
		s.createVector(-1,1),
		s.createVector(1,-1),
		s.createVector(1,-1)
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
		this.directionAngle = 45;

		this.currentColor = randomColor();

		// start by storing initial vertex
		this.vertices = [ s.createVector(x1, y1) ];

		// the last point in our buffer
		this.lastVertex = () => this.vertices[this.vertices.length - 1];
		
		this.setColor = (c) => this.color = c;
	
		this.getMagnitude = () => p5.Vector.sub(this.vertices[0], this.lastVertex()).mag();
		
		this.setNewDirection = () => {
			const currentDirectonAngle = this.directionAngle;

			this.direction = getNewDirection(this.currentDirectionIndex);
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
				this.setNewDirection();
				console.log("now the direction is", this.currentDirectionIndex);
			}
		};

		this.draw = () => {
			s.stroke(`rgba(${this.currentColor[0]},${this.currentColor[1]},${this.currentColor[2]},1.0)`);
			
			for (let v = 0; v < this.vertices.length; v++) {
				s.point(this.vertices[v].x, this.vertices[v].y);
			}
			
			s.stroke('yellow');
			s.point(this.vertices[0].x, this.vertices[0].y);
			//s.pop();
		}
	}


	let ray;
	let drawDebug = false;
	
	s.debug = () => {
		// update
		s.stroke('green');
		
		const v0 = s.createVector(s.width/2, s.height/2);
		const v1 = s.createVector(s.mouseX, s.mouseY);
		const h = p5.Vector.sub(v1, v0).heading();

		s.line(v0.x, v0.y, v1.x, v1.y);
		s.text(`heading: \n radians ${h} \n degrees ${s.degrees(h)}`, v1.x + 5, v1.y + 5);
	};


	s.setup = () => {
		const c = s.createCanvas(canvas_w, canvas_h, p5.WEBGL);
		c.parent('container');
		s.fill('white');
		s.strokeWeight(4);
		ray = new Ray();

	};

	s.keyPressed = () => drawDebug = !drawDebug;

	s.draw = () => {
		s.clear();
		ray.update();
		ray.draw();

		if (drawDebug) {
			s.debug();
		}
	};
});