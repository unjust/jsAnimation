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
  
  const BUFFER_MAX_LENGTH = 5;

  let drawingHistory = [];

  sk.setup = () => {
    sk.background(100);
    sk.createCanvas(canvasW, canvasH);
    console.log('objective: one shape that scrolls through forms and shrinks with delayed drawing');
    console.log('hold down key to shrink, move mouse to alter falling direction');
  };

  sk.keyPressed = () => {};

  sk.keyReleased = () => {};

  sk.drawShape = (dest_x, dest_y, shape_type, w, h) => {
    sk.fill('white');
    
    // another idea with dfferent shapes
    //  switch(shape_type) {
    //   case 0:
    //     sk.triangle(dest_x - w/2, dest_y, dest_x, dest_y - h, dest_x + w/2, dest_y);
    //     break;
    //   case 1:
    //     sk.rect(dest_x - w/2, dest_y - h, w, h);
    //     break;
    //   case 2:
    //     sk.ellipse(dest_x, dest_y - h/4, w/2, h/2);
    //     break;
    //   default:
    //     sk.triangle(dest_x - w/2, dest_y, dest_x, dest_y - h, dest_x + w/2, dest_y);
    //     break;
    // }
    sk.triangle(dest_x - w/2, dest_y, dest_x, dest_y - h, dest_x + w/2, dest_y);
  }

  // sk.draw = () => {
  //   sk.clear();
  //   sk.background(100);
  //   sk.fill('red');
  //   let dest_x = 100;
  //   let dest_y = 200;
  //   let w = 100;
  //   let h = 100;
  //   sk.triangle(dest_x - w/2, dest_y, dest_x, dest_y - h, dest_x + w/2, dest_y);
  //   //sk.rect(dest_x - w/2, dest_y - h, w, h);
  //   sk.ellipse(dest_x, dest_y - h/2, w, h);
  // }

  sk.draw = () => {
    // upper_left corner
    // sk.translate(canvasW/2, canvasH/2); 
    draw_counter += 1;

    dest_x = (Math.sin(draw_counter/25) * canvasW/4) + canvasW/2;
    dest_y = canvasH; // the bottom
    // dest_y = sk.mouseY;
    
    let w = shapeWidth - (shape_size_diff_counter);
    let h = shapeHeight - (shape_size_diff_counter);

    const rand = Math.floor(Math.random() * 5);
    
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
      sk.clear();
      sk.background(100);
    }

    // if (!sk.keyIsPressed) {
    //   sk.clear();
    //   sk.background(100);
    // }


    if (inResetMode) {
      if (drawingHistory.length === 0) {
        inResetMode = false;
      }
    };

    for (let i = 0; i < drawingHistory.length; i++) {
      const pastShape = drawingHistory[i];
      sk.drawShape(dest_x, dest_y, pastShape.shape_type, pastShape.w, pastShape.h);
    }

    if (!inResetMode && draw_counter % 10 == 0 && draw_counter > 0) {
      sk.drawShape(dest_x, dest_y, shape_type, w, h);
      // push new shape if less than 10 in buffer
      //if (drawingHistory.length < BUFFER_MAX_LENGTH) {
        drawingHistory.push({ shape_type, w, h });
      //}
    } 

    if (inResetMode || drawingHistory.length > BUFFER_MAX_LENGTH) {
      drawingHistory.shift();
    }
  };
});

