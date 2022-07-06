require('dotenv').config();

const { Client, Intents } = require('discord.js');
const { addCollections } = require('./utility');
// const db = require('./data/dbConfig');

const client = new Client({
	intents:  [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
	partials: ['MESSAGE'],
});

addCollections(client);

client.on('ready', () => {
	// if (!db) console.log('no db!');
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

client.login(process.env.TOKEN);