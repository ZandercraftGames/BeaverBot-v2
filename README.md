# BeaverBot-v2

1. Botkit is structured around event listeners. The most important is the “hear” listener, which kicks off an action when your bot hears something. `index.js` contains the core logic, and has this event listener:

    ```javascript
    controller.hears('hello','direct_message', function(bot,message) {
        bot.reply(message, 'Hello!');
    });
    ```

    This event handler is triggered when the bot receives a direct message from a user that contains the word “hello.”

    The bot responds in the direct message with, “Hello!”

2. You can listen to any kind of message or you can configure your bot to only listen to direct messages or specific @-mentions of your bot. It’s up to you! To start let’s re-write the event listener to be more  flexible about the greetings it is listening for:
    ```javascript
    controller.hears(['hello', 'hi', 'greetings'], ['direct_mention', 'mention', 'direct_message'], function(bot,message) {
         bot.reply(message, 'Hello!');
     });
    ```

    Now our bot will respond any time it sees “hello,” “hi,” or “greetings” in either a DM or a message that @-mentions the bot. (Don’t forget to restart your bot after each edit!)

## Hurrah! Welcome to Level 2
At this point you will probably want to start doing more sophisticated things, like making requests to external services, so your bot can respond with timely and useful information (depending on what your bot does, of course). There’s a lot more to Botkit than this! You can learn more about Botkit’s awesome features by simply perusing the [Botkit documentation](http://howdy.ai/botkit/docs/).

Once you’ve got your bot developed to your liking, it is ready to be deployed to your own hosting framework. No other configuration is necessary, except storing the token and desired port in environment variables.

# Using Botkit for Bot Apps

You can find full instructions for building a bot app with this repository at https://medium.com/slack-developer-blog/easy-peasy-bots-getting-started-96b65e6049bf#.4ay2fjf32

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
