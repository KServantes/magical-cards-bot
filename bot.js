require('dotenv').config();

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { Guilds, GuildMessages, GuildMessageReactions } = GatewayIntentBits;
const { Message } = Partials;

const fs = require('node:fs');
const path = require('node:path');

const client = new Client({
    intents: [Guilds, GuildMessages, GuildMessageReactions],
    partials: [Message]
});

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN)