import p5 from 'p5';

new p5((s) => {

	const canvas_w = 800,
		canvas_h = 600;

	// t, r, b, l = sides top, right, bottom, left
	const normals = {
		t: s.createVector(0,1),
		r: s.createVector(-1,0),
		b: s.createVector(0,-1),
		l: s.createVector(1,0)
	};


	
	// need to more accurate calculate what will hit,
	// could hit a corner
	const topBottomEdge = (v) => (v.y >= canvas_h - 3 || v.y <= 3);
	const leftRightEdge = (v) => (v.x >= canvas_w - 3 || v.x <= 3);

	const MARGIN = 0;

	/**
	 * @function hit
	 * @param {Vector} v 
	 * @returns {String, Boolean} what edge it hit or false if none
	 */
	const hit = (v) => {
		let hitpoints = "";

		if (v.y <= MARGIN) {
			hitpoints = 't';
		}
		if (v.x >= canvas_w - MARGIN) {
			hitpoints += 'r';
		}
		if (v.y >= canvas_h - MARGIN) {
			hitpoints += 'b';
		}
		if (v.x <= MARGIN) {
			hitpoints += 'l';
		} 

		return hitpoints || false;
	};

	// trying to prevent changing directions
	// too much if we are out of bounds
	const isInBounds = (v) => !hit(v);

	/**
	 *  @returns percentage RGBA notation stroke('rgba(100%,0%,100%,0.5)');
	 */
	const randomColor = (opacity = 1.0) => new Array(3).fill(0).map(() => Math.ceil(Math.random() * 100));

	const Ray = function(x1=100, y1=100, vel=10, mag=100) {
	
		this.velocity = vel;
		this.maxMagnitude = mag; // magnitude ??

		this.directionVector = s.createVector(1, 1);

		this.currentColor = randomColor();

		// start by storing initial vertex
		this.verticesArray = [ s.createVector(x1, y1) ];

		// the last point in our buffer
		this.lastVertex = () => this.verticesArray[this.verticesArray.length - 1];
		
		this.setColor = (c) => this.color = c;
	
		this.getMagnitude = () => p5.Vector.sub(this.verticesArray[0], this.lastVertex()).mag();
		
		this.setNewDirection = (side) => {
			const vector = this.directionVector.copy();

			const sides = side.split('');

			// for (let s in sides) {
			// 	vector.add(normals[s]);
			// }

			vector.add(normals[sides[0]]);
			this.directionVector = vector;
			console.log(`directionVector ${this.directionVector}`);
		}

		// https://processing.org/examples/accelerationwithvectors.html
		// http://www.mightydrake.com/Articles/ricochet.htm
		// https://gamedev.stackexchange.com/questions/23672/determine-resulting-angle-of-wall-collision
	
		this.update = () => {
			
			// if this thing is less than the magnitude we want, add a vertex
			if (this.getMagnitude() > this.maxMagnitude) {
				this.verticesArray.pop();
			}

			const velocityDirection = p5.Vector.mult(this.directionVector, this.velocity);
			// console.log(`directionVector ${this.directionVector}, velocity ${this.velocity} = ${velocityDirection}`);
			
			const newVertex = (this.verticesArray[0].copy()).add(velocityDirection);
			this.verticesArray.unshift(newVertex);

			
			
			// console.log(`start = ${this.verticesArray[0]}, end = ${this.lastVertex()}`);
	
			let side;
			if (side = hit(this.verticesArray[0])) {
				this.currentColor = randomColor();
				this.setNewDirection(side);
				// console.log("now the direction is", this.currentDirectionIndex);
			}
		};

		this.draw = () => {
			s.stroke(`rgba(${this.currentColor[0]},${this.currentColor[1]},${this.currentColor[2]},1.0)`);
			
			for (let v = 0; v < this.verticesArray.length; v++) {
				s.point(this.verticesArray[v].x, this.verticesArray[v].y);
			}
			
			s.stroke('yellow');
			s.point(this.verticesArray[0].x, this.verticesArray[0].y);
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
			s.text('heading of ray: ', s.width - 80, s.height - 10);
		}
	};
});