# custom-jspsych-plugins
custom plugins for the jspsych library (https://www.jspsych.org/)

# jspsych-record-permission.js 
An unexpected request for microphone access might be dismissed by the participant. This plugin provides a button from which the participant can actively request access. The text of the button can be edited with the parameter "button_label", and instructions can be inserted above the button with the parameter "prompt": 

```javascript
var request = {
  type: "record-permission",
  button_label: 'Request access to microphone',
  prompt: 'Please click the button below to grant access.'
  };
```

If the participant grants access, the experiment advances to the next trial in the timeline. If the participant does not grant access, an error message appears. [Tested with JATOS/jspsych-6.1.0 on Firefox 80.0.1.]
