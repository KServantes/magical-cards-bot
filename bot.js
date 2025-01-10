require('dotenv').config();

const { Client, GatewayIntentBits, Partials, Events, ActivityType } = require('discord.js');
const { Guilds, GuildMessages, GuildMessageReactions } = GatewayIntentBits;
const { Watching } = ActivityType;
const { ClientReady } = Events;
const { Message } = Partials;


const client = new Client({
    intents: [Guilds, GuildMessages, GuildMessageReactions],
    partials: [Message]
});

client.on(ClientReady, () => {
    client.user.setActivity('out for floodgates', {type: Watching});
    console.log('Magical Cards');
});

client.login(process.env.TOKEN)