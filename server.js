// Copyright 2017 Nils Whitmont 
// Permission is hereby granted, free of charge, to
// any person obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the following
// conditions: The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software. THE SOFTWARE
// IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
// IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

server.get('/', function (request, response, next) {
    response.send(200, {status: 'online'});
    next();
});

server.get('/status', function (request, response) {
    response.send({status: 'online'});
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var HeroCardName = 'Hero card';
var ThumbnailCardName = 'Thumbnail card';
var ReceiptCardName = 'Receipt card';
var SigninCardName = 'Sign-in card';
var AnimationCardName = "Animation card";
var VideoCardName = "Video card";
var AudioCardName = "Audio card";
var EmojiChoicePrompt = "Emoji Choice Prompt";
var SpanishLanguagePrompt = "Spanish Choice Prompt";
var SuggestedActionsMessage = "Suggested Actions Message";
var AdaptiveCardDemo = "Adaptive Card Demo";

var CardNames = [
    HeroCardName,
    ThumbnailCardName,
    ReceiptCardName,
    SigninCardName,
    AnimationCardName,
    VideoCardName,
    AudioCardName,
    EmojiChoicePrompt,
    SpanishLanguagePrompt,
    SuggestedActionsMessage,
    AdaptiveCardDemo
];

var bot = new builder.UniversalBot(connector, [
    function (session) {
        builder
            .Prompts
            .choice(session, 'What would you like to test?', CardNames, {
                maxRetries: 3,
                retryPrompt: 'Ooops, what you wrote is not a valid option, please try again'
            });
    },
    function (session, results) {
        // create the card based on selection
        var selectedCardName = results.response.entity;

        if (selectedCardName === EmojiChoicePrompt) {
            session.beginDialog('emoji_choice_prompt');
        } else if (selectedCardName === SpanishLanguagePrompt) {
            session.beginDialog('spanish_choice_prompt');
        } else if (selectedCardName === SuggestedActionsMessage) {
            session.beginDialog('suggested_actions');
        } else if (selectedCardName === AdaptiveCardDemo) {
            session.beginDialog('adaptive_card_demo');
        } 
        else {
            var card = createCard(selectedCardName, session);

            // attach the card to the reply message
            var msg = new builder
                .Message(session)
                .addAttachment(card);
            session.send(msg);
            // end the conversation
            session.endConversation();
        }
    }
]);

function createCard(selectedCardName, session) {
    switch (selectedCardName) {
        case HeroCardName:
            return createHeroCard(session);
        case ThumbnailCardName:
            return createThumbnailCard(session);
        case ReceiptCardName:
            return createReceiptCard(session);
        case SigninCardName:
            return createSigninCard(session);
        case AnimationCardName:
            return createAnimationCard(session);
        case VideoCardName:
            return createVideoCard(session);
        case AudioCardName:
            return createAudioCard(session);
        default:
            return createHeroCard(session);
    }
}

function createHeroCard(session) {
    return new builder
        .HeroCard(session)
        .title('BotFramework Hero Card')
        .subtitle('Your bots — wherever your users are talking')
        .text('Build and connect intelligent bots to interact with your users naturally whereve' +
                'r they are, from text/sms to Skype, Slack, Office 365 mail and other popular ser' +
                'vices.')
        .images([
            builder
                .CardImage
                .create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbo' +
                        'tframework_960.jpg')
        ])
        .buttons([
            builder
                .CardAction
                .openUrl(session, 'https://docs.botframework.com/en-us/', 'Get Started')
        ]);
}

function createThumbnailCard(session) {
    return new builder
        .ThumbnailCard(session)
        .title('BotFramework Thumbnail Card')
        .subtitle('Your bots — wherever your users are talking')
        .text('Build and connect intelligent bots to interact with your users naturally whereve' +
                'r they are, from text/sms to Skype, Slack, Office 365 mail and other popular ser' +
                'vices.')
        .images([
            builder
                .CardImage
                .create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbo' +
                        'tframework_960.jpg')
        ])
        .buttons([
            builder
                .CardAction
                .openUrl(session, 'https://docs.botframework.com/en-us/', 'Get Started')
        ]);
}

var order = 1234;
function createReceiptCard(session) {
    return new builder
        .ReceiptCard(session)
        .title('John Doe')
        .facts([
            builder
                .Fact
                .create(session, order++, 'Order Number'),
            builder
                .Fact
                .create(session, 'VISA 5555-****', 'Payment Method')
        ])
        .items([
            builder
                .ReceiptItem
                .create(session, '$ 38.45', 'Data Transfer')
                .quantity(368)
                .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/traffic-manager.p' +
                        'ng')),
            builder
                .ReceiptItem
                .create(session, '$ 45.00', 'App Service')
                .quantity(720)
                .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/cloud-service.png'))
        ])
        .tax('$ 7.50')
        .total('$ 90.95')
        .buttons([
            builder
                .CardAction
                .openUrl(session, 'https://azure.microsoft.com/en-us/pricing/', 'More Information')
                .image('https://raw.githubusercontent.com/amido/azure-vector-icons/master/renders/micros' +
                        'oft-azure.png')
        ]);
}

function createSigninCard(session) {
    return new builder
        .SigninCard(session)
        .text('BotFramework Sign-in Card')
        .button('Sign-in', 'https://login.microsoftonline.com');
}

function createAnimationCard(session) {
    return new builder
        .AnimationCard(session)
        .title('Microsoft Bot Framework')
        .subtitle('Animation Card')
        .image(builder.CardImage.create(session, 'https://docs.botframework.com/en-us/images/faq-overview/botframework_overview_ju' +
                'ly.png'))
        .media([
            {
                url: 'http://i.giphy.com/Ki55RUbOV5njy.gif'
            }
        ]);
}

function createVideoCard(session) {
    return new builder
        .VideoCard(session)
        .title('Big Buck Bunny')
        .subtitle('by the Blender Institute')
        .text('Big Buck Bunny (code-named Peach) is a short computer-animated comedy film by th' +
                'e Blender Institute, part of the Blender Foundation. Like the foundation\'s prev' +
                'ious film Elephants Dream, the film was made using Blender, a free software appl' +
                'ication for animation made by the same foundation. It was released as an open-so' +
                'urce film under Creative Commons License Attribution 3.0.')
        .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_' +
                'big.jpg/220px-Big_buck_bunny_poster_big.jpg'))
        .media([
            {
                url: 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4'
            }
        ])
        .buttons([
            builder
                .CardAction
                .openUrl(session, 'https://peach.blender.org/', 'Learn More')
        ]);
}

function createAudioCard(session) {
    return new builder
        .AudioCard(session)
        .title('I am your father')
        .subtitle('Star Wars: Episode V - The Empire Strikes Back')
        .text('The Empire Strikes Back (also known as Star Wars: Episode V – The Empire Strikes' +
                ' Back) is a 1980 American epic space opera film directed by Irvin Kershner. Leig' +
                'h Brackett and Lawrence Kasdan wrote the screenplay, with George Lucas writing t' +
                'he film\'s story and serving as executive producer. The second installment in th' +
                'e original Star Wars trilogy, it was produced by Gary Kurtz for Lucasfilm Ltd. a' +
                'nd stars Mark Hamill, Harrison Ford, Carrie Fisher, Billy Dee Williams, Anthony ' +
                'Daniels, David Prowse, Kenny Baker, Peter Mayhew and Frank Oz.')
        .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/en/3/3c/SW_-_Empire_Strikes_Back.jpg'))
        .media([
            {
                url: 'http://www.wavlist.com/movies/004/father.wav'
            }
        ])
        .buttons([
            builder
                .CardAction
                .openUrl(session, 'https://en.wikipedia.org/wiki/The_Empire_Strikes_Back', 'Read More')
        ]);
}

function createSuggestedActionsMessage(session) {
    var message = new builder
        .Message(session)
        .text("Thank you for expressing interest in our premium golf shirt! What color of shirt" +
                " would you like?")
        .suggestedActions([
            builder
                .CardAction
                .imBack(session, "productId=1&color=green", "Green"),
            builder
                .CardAction
                .imBack(session, "productId=1&color=blue", "Blue"),
            builder
                .CardAction
                .imBack(session, "productId=1&color=red", "Red")
        ]);
}

bot.dialog('suggested_actions', [function (session) {
        var message = new builder
            .Message(session)
            .text("Thank you for expressing interest in our premium golf shirt! What color of shirt" +
                " would you like?")
            .suggestedActions([
                builder
                    .CardAction
                    .imBack(session, "productId=1&color=green", "Green"),
                builder
                    .CardAction
                    .imBack(session, "productId=1&color=blue", "Blue"),
                builder
                    .CardAction
                    .imBack(session, "productId=1&color=red", "Red")
            ]);

        session.send(message);
    }
]);

bot.dialog('suggested_actions_reponse_handler', function (session) {
    session.send('You picked a color...');
}).triggerAction(/productId=1&color/i);

var emojiChoices01 = ['Low 😊', 'Moderate 😐', 'High 😣'];
var emojiFoodChoices = ['&#x1F355', '&#x1F32E', '&#x1F371'];
var asianFoodChoices = ['🍱', '🍣', '🍤'];


bot.dialog('emoji_choice_prompt', [
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

bot.dialog('spanish_choice_prompt', [
    function (session) {
        let options = {
            listStyle: builder.ListStyle['button']
        };
        builder
            .Prompts
            .choice(session, '¿Qué quieres hacer? Presiona el botón de la opción que necesites.', [
                'Sí', 'No', 'Dónde'
            ], options);
    },
    function (session, results) {
        session.send('Option selected: ' + results.response.entity);
        session.endDialog();
    }
]);

// adaptive cards example from:
// https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-send-rich-cards
bot.dialog('adaptive_card_demo', function(session) {
    var adaptiveCardMessage = new builder.Message(session)
    .addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            speak: "<s>Your  meeting about \"Adaptive Card design session\"<break strength='weak'/> is starting at 12:30pm</s><s>Do you want to snooze <break strength='weak'/> or do you want to send a late notification to the attendees?</s>",
               body: [
                    {
                        "type": "TextBlock",
                        "text": "Adaptive Card design session",
                        "size": "large",
                        "weight": "bolder"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Conf Room 112/3377 (10)"
                    },
                    {
                        "type": "TextBlock",
                        "text": "12:30 PM - 1:30 PM"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Snooze for"
                    },
                    {
                        "type": "Input.ChoiceSet",
                        "id": "snooze",
                        "style":"compact",
                        "choices": [
                            {
                                "title": "5 minutes",
                                "value": "5",
                                "isSelected": true
                            },
                            {
                                "title": "15 minutes",
                                "value": "15"
                            },
                            {
                                "title": "30 minutes",
                                "value": "30"
                            }
                        ]
                    }
                ],
                "actions": [
                    {
                        "type": "Action.Http",
                        "method": "POST",
                        "url": "http://foo.com",
                        "title": "Snooze"
                    },
                    {
                        "type": "Action.Http",
                        "method": "POST",
                        "url": "http://foo.com",
                        "title": "I'll be late"
                    },
                    {
                        "type": "Action.Http",
                        "method": "POST",
                        "url": "http://foo.com",
                        "title": "Dismiss"
                    }
                ]
        }
    });

    session.send(adaptiveCardMessage);
    session.endDialog();
});

bot.dialog('exit', function (session) {
    session.endConversation('Goodbye!');
}).triggerAction({matches: /(quit|exit)/i});

// END OF LINE
