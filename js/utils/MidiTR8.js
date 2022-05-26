import { accessMIDI } from "Utils/Midi.js"

// 137, 153 ch 10 note on/off 
// https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes
const TR8_keys = {
 36: 'BD',
 38: 'SD',
 43: 'LT',
 47: 'MT',
 50: 'HT',
 37: 'RS',
 39: 'HC',
 42: 'CH',
 46: 'OH',
 49: 'CC',
 51: 'RC',
}

const instrumentHandlerDefaults = {
  onBD: function() {},
  onSD: function() {},
  onLT: function() {},
  onMT: function() {},
  onHT: function() {},
  onRS: function() {},
  onHC: function() {},
  onCH: function() {},
  onOH: function() {},
  onCC: function() {},
  onRC: function() {},
}

let onMidiHandler = () => {};
let onNoteOnHandler = () => {};
let onNoteOffHandler = () => {};
let onControlChangeHandler = () => {};
let instrumentHandlers = instrumentHandlerDefaults;
const noteQueue = [];
let noteQueueMax = 100;

export const getNoteQueue = () => noteQueue;

const addNoteQueue = (note) => {
  if (noteQueue.length >= noteQueueMax) {
    noteQueue.shift();
  }
  noteQueue.push(note);
}

export const init = ({ 
    onMidiFn=()=>{},
    onNoteOn=()=>{},
    onNoteOff=()=>{},
    onControlChange=()=>{},
    noteQueueLimit=100,
    instHandlers={}
  }) => {
  // 185 is control change channel 10
  onMidiHandler = onMidiFn;
  onNoteOnHandler = onNoteOn;
  onNoteOffHandler = onNoteOff;
  onControlChangeHandler = onControlChange;
  instrumentHandlers = { ...instrumentHandlerDefaults, ...instHandlers };
  noteQueueMax = noteQueueLimit;
  accessMIDI(_onMidi);
}

const _onMidi = function(msg) {
  const [ type, key, velocity ] = msg.data;
  if (!key) {
    return;
  }
  
  // console.log(msg.data)
  // https://code.tutsplus.com/tutorials/introduction-to-web-midi--cms-25220
  // 153 is note on, 137 is not off channel 10
  // 176 - 191 is control change 185 ch 10 https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes
  // 201 ch 10 program change, 192 ch 1 program change

  const instHandlerName = `on${TR8_keys[key]}`;
  // all values are for channel 10
  switch(type) {
    case 137:
      // ch 10 note off
      onNoteOffHandler(key);
      instrumentHandlers[instHandlerName]("noteoff", velocity);
      break;
    case 153:
      addNoteQueue(key);
      onNoteOnHandler(key);
      instrumentHandlers[instHandlerName]("noteon", velocity);
      break;
    case 185:
      onControlChangeHandler(type, key, velocity); // is key or velocity right here?
    default:
      break;
  }

}



