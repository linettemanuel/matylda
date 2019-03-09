var http = require('http');
var querystring = require('querystring');

function translate(text_en) {

    var data = querystring.stringify({
        input_text: text_en
      });

    var options = {
        host: "lindat.mff.cuni.cz",
        port: "80",
        path: "/services/transformer/api/v1/models/en-cs",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/x-www-form-urlencoded",   
            "Content-Length": Buffer.byteLength(data)
        }
    }

    return new Promise(function(resolve, reject) {
        var req = http.request(options, function(res) {
            res.setEncoding("utf8");
            res.on('data', function(chunk) {
                if (chunk.length <= 4) {
                    reject(false);
                }
                var text = chunk.substr(2, chunk.length - 4);
                console.log('Response: ' + text);
                resolve(text);
            });
            res.on('error', function(e) {
                console.log('Error: ' + e);
                reject(e);
            });
        });
        req.write(data);
        req.end();
    });
}


module.exports = {
    translate: translate
}