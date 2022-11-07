const { SlashCommandBuilder } = require('@discordjs/builders');
const Helper = require('./library/msgHelper');
const wait = require('node:timers/promises').setTimeout;

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
				),
		),
	async execute(interaction) {
		const { member, client, options, user } = interaction;
		const userOption = options.getUser('duelist');
		const command = options.getSubcommand();

		if (command === 'view') {
			const { embeds, components, error } = await Helper.ViewCards({ member, client, user, options: { userOption } });
			if (error) {
				const msg = {};
				for (const prop in error) {
					msg[prop] = error[prop];
				}

				await interaction.reply(msg);
				await wait(4000);
				return await interaction.deleteReply();
			}
			return interaction.reply({ embeds, components });
		}
	},
};