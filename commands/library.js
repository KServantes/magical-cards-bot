const { SlashCommandBuilder } = require('@discordjs/builders');
const Helper = require('./library/msgHelper');

const OPT_DUELIST = 'duelist';
const OPT_CARD = 'card';
const OPT_PUBLIC = 'public';

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
						.setName(OPT_DUELIST)
						.setDescription('View the duelist\'s cards in the library.'),
				)
				.addStringOption(option =>
					option
						.setName(OPT_CARD)
						.setDescription('View a specific card')
						.setAutocomplete(true),
				)
				.addBooleanOption(option =>
					option
						.setName(OPT_PUBLIC)
						.setDescription('If false, only you will view the library.'),
				),
		)
		.addSubcommand(command =>
			command
				.setName('export')
				.setDescription('Export cards from the Library')
				.addUserOption(option =>
					option
						.setName(OPT_DUELIST)
						.setDescription('Export a duelists cards.'),
				)
				.addBooleanOption(option =>
					option
						.setName(OPT_PUBLIC)
						.setDescription('Make the cdb file public download.'),
				),
		),
	async execute(interaction) {
		const { member, client, options, user } = interaction;
		const userOption = options.getUser(OPT_DUELIST);
		const public = options.getBoolean(OPT_PUBLIC);
		const searchCard = options.getString(OPT_CARD);
		const command = options.getSubcommand();
		const args = {
			member,
			client,
			user,
			options:
				{
					public,
					duelist: userOption,
					search: searchCard,
				},
		};

		if (command === 'view') {
			const { embeds, components, error } = await Helper.ViewCards(args);
			if (error) return await Helper.errorHandler(interaction, error);

			// hide from public
			// this is public usually
			let ephemeral = false;
			if (public === false) ephemeral = true;
			return interaction.reply({ embeds, components, ephemeral });
		}

		if (command === 'export') {
			// show to public
			// this is private
			let ephemeral = true;
			if (public) ephemeral = false;
			await interaction.deferReply({ ephemeral });

			const { embeds, components, files, error } = await Helper.ExportCards(args);
			if (error) {
				const msg = {};
				for (const prop in error) {
					msg[prop] = error[prop];
				}
				return await interaction.editReply(msg);
			}
			return interaction.editReply({ embeds, components, files });
		}
	},
};