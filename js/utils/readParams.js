const getParams = () => new URLSearchParams(window.location.search);

export const hasFrameParam = () => getParams().has('frame')


// frameCount count to an interesting frame
// framerate slow down
// export interesting frame
/*
saveFrames(filename, extension, duration, framerate, [callback])
saveFrames('out', 'png', 1, 25, data => {
  print(data);
});
*/
