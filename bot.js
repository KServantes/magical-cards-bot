require('dotenv').config();
require("module-alias/register");

const { BotClient } = require('@structures');

const client = new BotClient();

// load events
client.loadEvents();
// register commands and interactions collections
client.loadCollections();

process.on("unhandledRejection", (error) => console.log(`Unhandled exception`, error));

client.login(process.env.TOKEN);