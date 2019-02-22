import p5 from 'p5';



new p5((sketch) => {

	const canvas_w = 800,
		canvas_h = 600;

	const s = 10;
	const augment = {
		0: sketch.createVector(1 * s, 1 * s),
		1: sketch.createVector(-1 * s, 1 * s),
		2: sketch.createVector(1 * s, -1 * s),
		3: sketch.createVector(-1 * s, -1 * s)
	};

	const hit = (v) => (v.x >= canvas_w || v.x <= 0 || v.y >= canvas_h || v.y <= 0);

	// trying to prevent changing directions too much if we are out of bounds
	const isInBounds = (v) => (v.x <= canvas_w || v.x >= 0 || v.y <= canvas_h || v.y >= 0);

	const getNextDirection = (curr) => {
		let r = Math.floor(Math.random() * Math.floor(4));
		return (r != curr) ? r : getNextDirection(r);
	};

	/**
	 *  @returns percentage RGBA notation stroke('rgba(100%,0%,100%,0.5)');
	 */
	const randomColor = (opacity = 1.0) => {
		const c = new Array(3).fill(0).map(() => Math.ceil(Math.random() * 100));
		return c;
	}

	const Line = function(x1 = 100, y1 = 100, x2 = 0, y2 = 0, s = 10, len = 100) {
		this.currentColor = 'black';
		this.speed = s;
		this.length = len;

		this.start = sketch.createVector(x1, y1),
		this.end = sketch.createVector(x2, y2);

		this.buffer = [];

		this.currentAugmentKey = 0;
		this.currentColor = randomColor();

		this.setColor = (c) => {
			this.color = c;
		};

		this.restart = () => {};
	
		this.update = () => {
			if (this.buffer.length == this.line_len) {
				this.buffer.shift();
				end = this.buffer[0]; // the oldest values are at the front
			} else {
				let delta = sketch.createVector(this.line_len, this.line_len);
				p5.Vector.sub(this.start, delta, this.end);
			}
			this.start.add(augment[this.currentAugmentKey]);
			this.buffer.push(this.start.copy());
	
			// console.log(`start = ${start}, 0 = ${buffer[0]}, end = ${end}`);
	
			if (hit(this.start)) {
				// if (isInBounds(start)) {
					// get nearest edge
	
					this.currentColor = randomColor();
					this.currentAugmentKey = getNextDirection(this.currentAugmentKey);
					console.log("now the direction is", this.currentAugmentKey);
				// }
				// else {
				// 	this.restart();
				// }
			}
		};

		this.draw = () => {
			const bufferLength = this.buffer.length;

			for (let v = 0; v < bufferLength; v++) {
				const percent_left = (1 - (v / bufferLength)); // 0 opacity on the first one sice its the last pixel really
				const opacity = bufferLength - (percent_left * bufferLength);

				if (v == bufferLength - 1) {
					sketch.stroke('black');
				} else {
					const str = `rgba(${this.currentColor[0]}%, ${this.currentColor[1]}%, ${this.currentColor[2]}%, ${opacity / 100})`;
					sketch.stroke(str);
				}
				if (bufferLength > v + 1) {
					sketch.line(this.buffer[v].x, this.buffer[v].y, this.buffer[v + 1].x, this.buffer[v + 1].y);
				} else {
					sketch.point(this.buffer[v].x, this.buffer[v].y);
				}
			}
		}
	}

	// const nearestEdge = (v) => {
	// 	let nearestEdge = sketch.createVector(0, 0);
	// 	if (v.x > canvas_w) {
	// 		nearestEdge.x = canvas_w;
	// 		// recalc
	// 	}
	// 	if (v.y > canvas_h) {
	// 		nearestEdge.x = canvas_h;
	// 		//recalc
	// 	}
	// 	if (v.x < 0) {
	// 		// recalc

	// 	}
	// 	if (v.y < 0) {
	// 		//recalc
	// 		const a = sketch.createVector(v.x, -1 * v.y);
	// 		v.add(a);
	// 	}
	// }


	let line;

	sketch.setup = () => {
		const c = sketch.createCanvas(canvas_w, canvas_h, p5.WEBGL);
		c.parent('container');

		sketch.fill('white');
		sketch.strokeWeight(4);

		line = new Line();
	};

	sketch.draw = () => {
		sketch.clear();
		line.update();
		line.draw();
	};
});