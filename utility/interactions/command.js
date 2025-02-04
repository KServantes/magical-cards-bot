const isCommand = interaction => {
	return interaction.isCommand();
};

const interactionCommand = async (interaction) => {

	const { commands } = interaction.client;
	const command = commands.get(interaction.commandName);

	if (!command) return;
	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.log('command error', error);
		await interaction.reply({ content: 'There was an error while executing this command!', flags: "Ephemeral" });
	}
};

module.exports = {
	name: 'command',
	type: isCommand,
	interact: interactionCommand,
};