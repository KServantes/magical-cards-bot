require('dotenv').config();

const { Client, Intents, MessageEmbed } = require('discord.js');
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
	try {
		const { interactions } = client;

		// eslint-disable-next-line no-unused-vars
		for (const [ _, interactType] of interactions.entries()) {
			const { type, interact } = interactType;
			if (type(interaction)) {
				interact(interaction);
			}
		}
	}
	catch (error) {
		console.log('interaction error', error);
		return await interaction.reply({ content: 'There was an error executing this interaction!', ephemeral: true });
	}
});

client.on('messageCreate', async message => {
	const botID = client.user.id;

	if (message.mentions.has(botID)) {

		const embed = new MessageEmbed()
			.setTitle('Hello')
			.setDescription(`My name is Magical Cards Bot! I'm a Custom Card Creation Bot.
			
>>> Commands

Cards
\`/ create\` - Create a new card to add to the library.
\`/ create image\` - Create a new card image. Uploaded to Imgur.

Library
\`/ library view\` - Review cards in the library.
\`/ library view duelist\` - Review cards made by that creator.
\`/ library view card\` - Review a certain card.

\`/ library export\` - Export your cards from the main cdb.
\`/ library export duelist\` - Export a duelists card's from the cdb.
(If Magic Card Bot selected, gets all the cards.)
\`/ library export public\` - Allows cdb file to be seen by all (default: false);

Misc
\`/ avatar\` - Displays your avatar URL.
\`/ avatar member\` - Displays another member's avatar URL.
\`/ ping heartbeat\` - Test the websocket connection.
\`/ ping roundtrip\` - Test the latency of the full API roundtrip.`)
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');
		return await message.reply({ embeds: [embed] });
	}
});

client.on('error', e => {
	console.log(e);
});

client.login(process.env.TOKEN);