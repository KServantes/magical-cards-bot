require('dotenv').config();

const { Client, Intents } = require('discord.js');
const { addCollections } = require('./utility');
const { GUILDS, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS } = Intents.FLAGS;

const client = new Client({
	intents:  [GUILDS, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE'],
});

addCollections(client);

client.on('ready', () => {
	client.user.setActivity('Out for floodgates!', { type: 'WATCHING' });
	console.log('Magical Cards');
});

client.on('interactionCreate', async interaction => {
	const { interactions } = client;

	// eslint-disable-next-line no-unused-vars
	for (const [ _, interactType] of interactions.entries()) {
		const { type, interact } = interactType;
		if (type(interaction)) {
			interact(interaction);
		}
	}
});

client.on('error', e => {
	console.log(e);
});

client.login(process.env.TOKEN);