require('dotenv').config();

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { Guilds, GuildMessages, GuildMessageReactions } = GatewayIntentBits;
const { Message } = Partials;


const client = new Client({
    intents: [Guilds, GuildMessages, GuildMessageReactions],
    partials: [Message]
});

const { execute: events } = require('./events');

events(client);

client.login(process.env.TOKEN)