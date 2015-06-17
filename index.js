'use strict';
var Sandbox = new (require('sandbox'));
function evalJSHandler(request, reply){
    if(request.payload.token !== process.env.config.slackToken) return reply('Incorrect token').code(401);
    var code = request.payload.text.slice(3).trim();
    Sandbox.run(code, function(out){
        var response = '';
        if( (!out.result || out.result === 'null') && out.console.length === 0 ) return reply('Snippet ran sucessfully.');
        if(out.console.length > 0){
            response += out.console.reduce(function(s, c){
                return s + c.replace('\n', ' ');
            }, '');
            return reply({text : response});
        }
        response = out.result.split('\n').slice(0,3).join('\n');
        reply({text : response});
    });
}

module.exports = {
  handler : evalJSHandler,
  path : '/slack/outgoing/eval-js',
  method : 'POST'
};