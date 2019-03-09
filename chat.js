var translate = require('./translate')

var AssistantV1 = require('watson-developer-cloud/assistant/v1');
var workspaceId = conversationWorkspaceId = '76ceb03d-f023-444c-8d7b-79d6bb48b461';

var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var _soundplayer = require('sound-player');
var speakerDeviceId = "plughw:0,0";
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var mic = setupMicrophone();

//REST API
var express = require('express');
var bodyParser = require('body-parser');

var assistant = new AssistantV1({
  version: '2019-02-28',
  iam_apikey: 'uYf0u76pFoseeT5rGWAfM_TFCY2mpq7WCm4vm6p-BznS',
  url: 'https://gateway-fra.watsonplatform.net/assistant/api'
});

var textToSpeech = new TextToSpeechV1({
  iam_apikey: 'bUDQtHqXAaNWK8JFquYpPMrlDCEjMv5cO_9EgJ3qNLgO',
  url: 'https://stream-fra.watsonplatform.net/text-to-speech/api'
});

var speechToText = new SpeechToTextV1 ({
  iam_apikey: '0CCOvJ46ZT8Rq2IyOobD9gFsaMu0oJyJHmtYzqyTpPmM',
  url: 'https://stream-fra.watsonplatform.net/speech-to-text/api'
});

var params = {
  objectMode: true,
  content_type: 'audio/flac',
  model: 'en-US_BroadbandModel',
  keywords_threshold: 0.5,
  max_alternatives: 3
};

// Create the stream.
var recognizeStream = speechToText.recognizeUsingWebSocket(params);

// Pipe in the audio.
fs.createReadStream('audio-file.flac').pipe(recognizeStream);

// Listen for events.
recognizeStream.on('data', function(event) { onEvent('Data:', event); });
recognizeStream.on('error', function(event) { onEvent('Error:', event); });
recognizeStream.on('close', function(event) { onEvent('Close:', event); });

// Display events on the console.
function onEvent(name, event) {
    console.log(name, JSON.stringify(event, null, 2));
};

textToSpeech.listVoices(null, function(error, voices) {
  if (error) {
    console.log(error);
  } else {
    console.log('This is my list: ' + JSON.stringify(voices, null, 2));
  }
});

var micParams = {
  'rate': '44100',
  'channels': '2',
  'debug': false,
  'exitOnSilence': 6
};

function setupMicrophone() {

  // create the microphone
  mic = Mic(micParams);

  // (re-)create the mic audio stream and pipe it to STT
  micInputStream = mic.getAudioStream();

});

var getVoiceParams = {
  voice: 'en-US_AllisonVoice'
};

textToSpeech.getVoice(getVoiceParams, function(error, voice) {
  if (error) {
    console.log(error);
  } else {
    console.log(JSON.stringify(voice, null, 2));
  }
});

var synthesizeParams = {
  text: 'Hello world',
  accept: 'audio/wav',
  voice: 'en-US_AllisonVoice'
};

function speak(message) {
  // make sure we're trying to say something
  if (message == undefined || message == "") {
      console.log(error("Tried to speak an empty message."));
      return; // exit if theres nothing to say!
  }

  var voice = synthesizeParams.voice ;

  var utterance = {
      text: message,
      voice: voice,
      accept: synthesizeParams.accept
  };

  return new Promise(function(resolve, reject) {
      temp.open('media', function(err) {
          if (err) {
              reject("error: could not open temporary file for writing at path: " + 'hello_world.wav');
          }

          textToSpeech.synthesize(utterancsynthesizeParamse)
              .pipe(fs.createWriteStream('hello_world.wav'))
              .on('close', function() {
                  winston.debug("wrote audio stream to temp file", 'hello_world.wav');
                  winston.verbose("Matylda speaking: " + message);

                  resolve(play('hello_world.wav'));
              });
      });
  });
}

function play(soundFile) {
  pauseListening();

    return new Promise(function(resolve, reject) {
        // if we don't have a speaker, throw an error
        if (_soundplayer == undefined) {
            reject(new Error("unable to play audio, cannot see any \"speaker\""));
            return;
        }

        // initialize soundplayer lib
        var speakerOptions = {
            filename: soundFile,
            gain: 100,
            debug: true,
            player: "aplay", // "afplay" "aplay" "mpg123" "mpg321"
            device: speakerDeviceId
        }
        var player = new self._soundplayer(speakerOptions);

        winston.debug("Playing audio with parameters: ", speakerOptions);

        player.on('complete', function() {
            winston.debug("audio playback finished");

            // resume listening
            _resumeListening();

            // done
            resolve();
        });

        player.on('error', function(err) {
            winston.error('Error occurred while playing audio :', err);
        });

        // play the audio
        player.play(soundFile);
    });
}

function pauseListening() {
  if (mic != undefined) {
    winston.debug("listening paused");
    mic.pause();  
  }
}

function resumeListening() {
  if (mic != undefined) {
    winston.debug("listening resumed");
    mic.resume();
  }
}


// Pipe the synthesized text to a file.
textToSpeech.synthesize(synthesizeParams).on('error', function(error) {
  console.log(error);
}).pipe(fs.createWriteStream('hello_world.wav'));



function initRestAPI() {
  var restAPI = express();
  restAPI.use(bodyParser.urlencoded({ extended: true }));
  restAPI.use(bodyParser.json());

  var port = 80;
  var router = express.Router();

  router.get('/translate', function (req, res) {
    var promise = translate.translate("Hello, world!");
    promise.then(function(result) {
      res.json({message: result});
    });
  });

var is_translating = false;

  router.route('/chat')
    .get(function (req, res) {
      assistant.message({
        workspace_id: workspaceId,
        input: {'text': req.body.message }
      },  function(err, response) {
        if (err) {
          var err = "[REST API] 'message' block is missing in the POST payload";
          console.error(err);
          res.json({ "error": err })
        } else {
          console.log(JSON.stringify(response, null, 2));
          if (response.context.action.action == 'translate') {
            //start translating
            is_translating = true;
            res.json(response);
          } else if (response.context.action.action == 'end_translate') {
            //end translating
            is_translating = false;
            res.json(response);
          } else {
            if (is_translating) {
              // translate user's message
              var promise = translate.translate(req.body.message);
                promise.then(function(result) {
                res.json({output: {text: [result], language: "cz"}});
              });
            } else {
              // regular message
              res.json(response);
            }
          }
        }
      });
    })
    .post(function (req, res) {
      assistant.message({
        workspace_id: workspaceId,
        input: {'text': req.body.message }
      },  function(err, response) {
        if (err) {
          var err = "[REST API] 'message' block is missing in the POST payload";
          console.error(err);
          res.json({ "error": err })
        } else {
          console.log(JSON.stringify(response, null, 2));
          res.json(JSON.stringify(response, null, 2));
        }
      });
    })

  router.route('/message')
    .post(function (req, res) {
      console.log(req.body.text);
      res.json({"status": "ok"});
    }) 

  restAPI.listen(port);
  console.log('RestAPI is active on port ' + port);

  restAPI.use('/rest', router);
  restAPI.use(express.static(__dirname + '/public'));
}


initRestAPI();

