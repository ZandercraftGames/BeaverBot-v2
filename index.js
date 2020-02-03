/**
 * BeaverBot-v2!
 */

/**
 * DEPRECATED!!!
 * Reason For Deprecation:
 * Functionality to run as an app has been temporarily removed to satisfy StandardJS. Can only run as a custom integration.
 * Original Purpose:
 * Define a function for initiating a conversation on installation
 * With custom integrations, we don't have a way to find out who installed us, so we can't message them :(
 */

function onInstallation (bot, installer) {
  if (installer) {
    bot.startPrivateConversation({ user: installer }, function (err, convo) {
      if (err) {
        console.log(err)
      } else {
        convo.say('Hello! I am BeaverBot and I have just joined your team!')
        convo.say('You must now /invite me to a channel so that I can be of use.')
      }
    })
  }
}

/**
 * Configure the persistence options and database
 */

var config = {}
if (process.env.MONGOLAB_URI) {
  var BotkitStorage = require('botkit-storage-mongo')
  config = {
    storage: BotkitStorage({ mongoUri: process.env.MONGOLAB_URI })
  }
} else {
  config = {
    json_file_store: ((process.env.TOKEN) ? './db_slack_bot_ci/' : './db_slack_bot_a/') // use a different name if an app or CI
  }
}

/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
  // Treat this as a custom integration
  var customIntegration = require('./lib/custom_integrations')
  var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN
  var controller = customIntegration.configure(token, config, onInstallation)
} else {
  console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment')
  process.exit(1)
}
/* else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
  // Treat this as an app
  var app = require('./lib/apps')
  var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation)
} */

/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
  console.log('** The RTM api just connected!')
})

controller.on('rtm_close', function (bot) {
  console.log('** The RTM api just closed')
  // you may want to attempt to re-open
})

/**
 * Core bot logic goes here!
 */

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, 'Hello! I am BeaverBot and I am here to have fun and watch you guys progress in FRC!')
})

controller.hears(['hello', 'hi', 'heya', 'yo', 'hey', 'howdy', 'greetings'], ['direct_message', 'direct_mention', 'mention'], async (bot, message) => {
  await bot.reply(message, 'Hello!')
})

/**
 * Any un-handled direct mention gets a reaction and a pat response!
 */
controller.on('direct_message,mention,direct_mention', async (bot, message) => {
  await bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: '2609'
  }, function (err) {
    if (err) {
      console.log(err)
    }
    bot.reply(message, 'I heard you loud and clear boss, but this doesnt seem to be a command I know how to respond to.')
  })
})

// wait for a new user to join a channel, then say hi
controller.on('channel_join', async (bot, message) => {
  await bot.reply(message, 'Welcome to the channel!')
})

// Log every message received
controller.middleware.receive.use(function (bot, message, next) {
  if (message.user !== bot.user) {
    console.log('Log: Received: ', message)
    // modify the message
    message.logged = true
    // continue processing the message
    next()
  }
})
