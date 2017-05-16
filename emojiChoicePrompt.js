var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());


var emojiChoices01 = ['Low 😊', 'Moderate 😐', 'High 😣'];
var emojiFoodChoices = ['&#x1F355', '&#x1F32E', '&#x1F371'];
var asianFoodChoices = ['🍱', '🍣', '🍤'];

var bot = new builder.UniversalBot(connector, [
    function (session) {
        builder.Prompts.choice(session, "Select an emoji response:", asianFoodChoices, {listStyle: builder.ListStyle.button});
    },
    function (session, results) {
        console.log('\n');
        console.log(results.response)
        session.send("You picked: " + results.response.entity);
        session.endDialog();
    }
]);

// END OF LINE
