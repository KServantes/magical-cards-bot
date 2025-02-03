require('dotenv').config();
require("module-alias/register");

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { Guilds, GuildMessages, GuildMessageReactions } = GatewayIntentBits;
const { Message, ThreadMember } = Partials;


const client = new Client({
    intents: [Guilds, GuildMessages, GuildMessageReactions],
    partials: [Message, ThreadMember]
});

const loadCollections = require('./utility');
const loadEvents = require('./events');

// register commands and interactions collections
loadCollections(client);
// load events
loadEvents(client);

client.login(process.env.TOKEN);