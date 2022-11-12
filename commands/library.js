const { SlashCommandBuilder } = require('@discordjs/builders');
const Helper = require('./library/msgHelper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('library')
		.setDescription('Library of cards indexed.')
		.addSubcommand(command =>
			command
				.setName('view')
				.setDescription('View all the cards in the library.')
				.addUserOption(option =>
					option
						.setName('duelist')
						.setDescription('View the duelist\'s cards in the library.'),
				)
				.addStringOption(option =>
					option
						.setName('card')
						.setDescription('View a specific card')
						.setAutocomplete(true),
				),
		)
		.addSubcommand(command =>
			command
				.setName('export')
				.setDescription('Export cards from the Library')
				.addUserOption(option =>
					option
						.setName('duelist')
						.setDescription('Export a duelists cards.'),
				)
				.addBooleanOption(option =>
					option
						.setName('public')
						.setDescription('Make the cdb file public download.'),
				),
		),
	async execute(interaction) {
		const { member, client, options, user } = interaction;
		const userOption = options.getUser('duelist');
		const command = options.getSubcommand();

		if (command === 'view') {
			const { embeds, components, error } = await Helper.ViewCards({ member, client, user, options: { user: userOption } });
			if (error) return await Helper.errorHandler(interaction, error);
			return interaction.reply({ embeds, components });
		}
		if (command === 'export') {
			await interaction.deferReply();

			const { embeds, components, files, error } = await Helper.ExportCards({ member, client, user, options: { user: userOption } });
			if (error) return await Helper.errorHandler(interaction, error);
			return interaction.editReply({ embeds, components, files });
		}
	},
};