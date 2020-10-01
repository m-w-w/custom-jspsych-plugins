# custom-jspsych-plugins
custom plugins for the jspsych library (https://www.jspsych.org/)

# jspsych-record-permission.js 
An unexpected request for microphone access might be dismissed by the participant. This plugin provides a button from which the participant can actively request access. The text of the button can be edited with the parameter "button_label", and instructions can be inserted above the button with the parameter "prompt": 

```javascript
var request = {
  type: 'record-permission',
  button_label: 'Request access to microphone',
  prompt: 'Please click the button below to request access.'
  };
```

If the participant grants access, the experiment advances to the next trial in the timeline. If the participant does not grant access, an error message appears. [Tested with JATOS 3.5.7 /jspsych-6.1.0 / Firefox 80.0.1]


# jspsych-record-audio-JATOS.js 
As of recently, JATOS (http://www.jatos.org) allows for experiments to upload files. This plugin provides a way to record and save audio using that method. The trial begins with a "record" button that the participant can click to start recording, and an initial text prompt. When pressed, the record button disappears and is replaced by a "stop recording" button, and the prompt text is replaced by a second message in red text specified by "recording_msg". When "stop recording" is pressed, the audio file (OGG) is uploaded to JATOS using the function *jatos.uploadResultFile()*. The filename can be specified using the parameter "audio_filename", which if not specified will default to a timestamp. Once the file is uploaded, the experiment advances to the next trial in the timeline. Following the format of other jsPsych plugins, a measure of how long the participant remained on the trial is saved as "rt". [Tested with JATOS 3.5.7 /jspsych-6.1.0 / Firefox 80.0.1]

```javascript
var record = {
  type: 'record-audio-JATOS',
  prompt: 'Press the "record" button to start recording.',
  recording_msg: 'Recording now! Press the "stop recording" button to end the trial.',
  audio_filename: 'some_specific_filename'
  };
```

