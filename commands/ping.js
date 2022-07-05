const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('heartbeat')
				.setDescription('Test the websocket connection.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('roundtrip')
				.setDescription('Test the latency of a full API roundtrip.')),

	async execute(interaction) {
		if (interaction.options.getSubcommand('heartbeat') === 'heartbeat') {
			const { ws } = interaction.client;
			interaction.reply(`Websocket heartbeat: ${ws.ping}`);
		}
		else if (interaction.options.getSubcommand('roundtrip') === 'roundtrip') {
			const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
			interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
		}
		else {
			await interaction.reply('Pong!');
		}
	},
};