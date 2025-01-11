const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.addSubcommand(subcommand => 
			subcommand.setName('pong')
			.setDescription('Quick test response.')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('heartbeat')
				.setDescription('Test the websocket connection.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('roundtrip')
				.setDescription('Test the latency of a full API roundtrip.')),
	/**
	 * 
	 * @param {CommandInteraction} interaction 
	 * @returns 
	 */
	async execute(interaction) {
		if (interaction.options.getSubcommand('heartbeat') === 'heartbeat') {
			const { ws } = interaction.client;
			return interaction.reply(`Websocket heartbeat: ${ws.ping}`);
		}
		else if (interaction.options.getSubcommand('roundtrip') === 'roundtrip') {
			const response = await interaction.reply({ content: 'Pinging...', withResponse: true });
			const { message: sent } = response.resource;
			return interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
		}
		else {
			return interaction.reply('Pong!');
		}
	},
};