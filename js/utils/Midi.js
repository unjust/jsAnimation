
let midi = null;

const onMIDIMessage = (message) => {
  const str = `MIDI message received at timestamp ${message.timeStamp}
    ${message.data.length} bytes`;
  message.data.forEach(d => console.log(`${str} 0x${d.toString(16)}`));
}

export const accessMIDI = (midiHandler=onMIDIMessage) => {
  navigator.requestMIDIAccess().then((midiAccess) => {
    midi = midiAccess;
    if (midiAccess.inputs) {
      console.log(`Listening to MIDI ${midiAccess.inputs.size} ports`);
      midiAccess.inputs.forEach(entry => entry.onmidimessage = midiHandler);
    }
  }, (err) => {
    console.log("an error ocurred with MIDI", err);
  });
}
