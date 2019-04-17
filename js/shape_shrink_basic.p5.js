import p5 from 'p5';


new p5((sk) => {
  
  const canvasW = 400,
        canvasH = 400;

  let dest_x = 0,
      dest_y = 0;
  
  let shapeWidth = canvasW - 10;
  let shapeHeight = canvasW - 10;
  const MIN_SIZE = 10;

  let shape_type = 0;
  
  let draw_counter = 0,
      shape_size_diff_counter = 0;

  let inResetMode = false;
  
  const BUFFER_MAX_LENGTH = 50;

  let drawingHistory = [];

  sk.setup = () => {
    sk.background(100);
    sk.createCanvas(canvasW, canvasH);
    console.log('objective: one shape that scrolls through forms and shrinks with delayed drawing');
    console.log('man: hold down key to shrink, move mouse to alter falling direction');
  };

  sk.drawShape = (dest_x, dest_y, shape_type, w, h) => {
    sk.fill('white');
    sk.triangle(dest_x - w/2, dest_y, dest_x, dest_y - h, dest_x + w/2, dest_y);
  }

  sk.draw = () => {
    sk.clear();
    sk.background(100);
    
    draw_counter += 1;

    dest_x = (Math.sin(draw_counter/25) * canvasW/4) + canvasW/2;
    dest_y = canvasH; // the bottom
    // dest_y = sk.mouseY;
    
    let w = shapeWidth - (shape_size_diff_counter);
    let h = shapeHeight - (shape_size_diff_counter);

    const rand = Math.floor(Math.random() * 10);
    
    // if we reach a certain mizsize
    if (w < MIN_SIZE || h < MIN_SIZE) {
      inResetMode = true;
      shape_size_diff_counter = 0;
    } else {
      shape_size_diff_counter += rand;
    }
    
    // get shapetype
    shape_type = (shape_type === 2) ? 0 : shape_type + 1;

    if (inResetMode) {
      if (drawingHistory.length === 0) {
        inResetMode = false;
      }
    };

    drawingHistory.push({ shape_type, dest_x, dest_y, w, h }); 

    for (let i = 0; i < drawingHistory.length; i++) {
      const pastShape = drawingHistory[i];
      sk.drawShape(pastShape.dest_x, pastShape.dest_y, pastShape.shape_type, pastShape.w, pastShape.h);
    }

    if (drawingHistory.length > BUFFER_MAX_LENGTH) {
      drawingHistory.shift();
    }
  };
});

