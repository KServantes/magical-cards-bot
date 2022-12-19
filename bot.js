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
			
>>> **Commands**

**Cards**
\`/ create card\` - Create a new card to add to the library.

**Library**
\`/ library view\` - Review cards in the library.
	- \`duelist\` - Review cards made by this duelist.
	- \`card\` - Review a certain card.
	- \`public\` - True. Set to false to privatize.
	*(e.g. '/library view duelist card public: false)*
	*'View card from this duelist in private message.'*

\`/ library export\` - Export your cards from the main cdb.
	- \`duelist\` - Export a duelists card's from the cdb.
	- \`public\` - Allows cdb file to be seen by all (default: false);
	*(e.g. '/library export duelist: Magical Cards Bot public: True')*
	*'Export all the cards in the library.'*

**Misc**
\`/ avatar\` - Displays your avatar URL.
		- member - Displays another member's avatar URL.
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