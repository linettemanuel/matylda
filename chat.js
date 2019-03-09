var translate = require('./translate')

var AssistantV1 = require('watson-developer-cloud/assistant/v1');
var workspaceId = conversationWorkspaceId = '76ceb03d-f023-444c-8d7b-79d6bb48b461';

//REST API
var express = require('express');
var bodyParser = require('body-parser');

var assistant = new AssistantV1({
  version: '2019-02-28',
  iam_apikey: 'uYf0u76pFoseeT5rGWAfM_TFCY2mpq7WCm4vm6p-BznS',
  url: 'https://gateway-fra.watsonplatform.net/assistant/api'
});




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
          res.json(response);
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

