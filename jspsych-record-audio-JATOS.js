/*
 * Plugin to record audio as OGG and upload to JATOS
 * Borrows code and concepts from https://www.twilio.com/blog/mediastream-recording-api
 */

jsPsych.plugins["record-audio-JATOS"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "record-audio-JATOS",
    parameters: {
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed above the buttons.'
      },
      recording_msg: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Recording message',
        default: 'Recording now. Press the button below to stop recording.',
        description: 'Any content here will be displayed while actively recording.'
      },
      audio_filename: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Audio filename',
        default: null,
        description: 'The name of the audio file (no extension). If empty, uses timestamp.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // start of adding HTML...
    var html = "";
    
    // add the prompt above the buttons
    html += '<div class="prompt">' + trial.prompt + '<br><br></div>';
    
    // add the recording message
    html += '<div class="rcrd_msg" style="color:#FF0000" hidden="hidden">' + 
      trial.recording_msg + '<br><br></div>';
    
    // add the buttons
    html += '<button class="record">Record</button>' + 
      '<button class="stop" hidden="hidden">Stop Recording</button>';
    
    // ...end of adding HTML
    display_element.innerHTML = html;

    // prepare for recording
    const constraints = { audio: true };
    let chunks = [];
    
    // prepare for interactions
    const record = document.querySelector('.record');
    const stop = document.querySelector('.stop');
    const soundClips = document.querySelector('.sound-clips');
    const prompt = document.querySelector('.prompt');
    const recording_msg = document.querySelector('.rcrd_msg');
    
    // if getUserMedia succeeds...
    let onSuccess = function (stream) {
      
      const mediaRecorder = new MediaRecorder(stream);
      
      // listen for clicks to record
      record.onclick = function () {
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log("recorder started");
        record.setAttribute('hidden', 'hidden');
        prompt.setAttribute('hidden', 'hidden');
        recording_msg.removeAttribute('hidden');
        stop.removeAttribute('hidden');
        stop.disabled = false;
        record.disabled = true;
      }

      // listen for click to stop recording audio
      stop.onclick = function () {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log("recorder stopped");
        stop.setAttribute('hidden', 'hidden');
        recording_msg.setAttribute('hidden', 'hidden');
        prompt.removeAttribute('hidden');
        record.removeAttribute('hidden');
        stop.disabled = true;
        record.disabled = false;
      }

      // when recording is stopped...
      mediaRecorder.onstop = function (e) {
        
        console.log("recording stopped.");

        // upload the audio blob as OGG to JATOS with given filename
        const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
        const audioURL = window.URL.createObjectURL(blob);
        if (trial.audio_filename === null) {
          trial.audio_filename = String(Date.now());
        };
        var full_filename = trial.audio_filename + ".ogg";
        jatos.uploadResultFile(blob, full_filename).done(() => { 
          console.info(full_filename + " uploaded");
        });

        // save any trial_data information
        var endTime = performance.now();
        var response_time = endTime - startTime;
        var trial_data = {
          rt: response_time
        };
      
        // end trial
        jsPsych.finishTrial(trial_data);
      }

      // gathering chunks of audio
      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      }
    } 

    let onError = function (err) {
      console.log('The following error occured: ' + err);
    }
        
    // attempt to getUserMedia  
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    
    // keep track of start time for eventual rt variable
    var startTime = performance.now();          
  };

  return plugin;
})();

