const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder, CommandInteraction, ButtonStyle, Colors } = require('discord.js');
const { UID_START, UID_HALT, BOT_IMG_URL } = require('@constants');
const { InteractionCallbackResponse } = require('discord.js');
const { Success, Danger } = ButtonStyle;
const { Blue } = Colors;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Create cards, images, and databases for YGOPRO.'),
	/**
	 * Creates a prompt to start following the card making process
	 * @param {CommandInteraction} interaction Command interaction
	 * @returns {Promise<InteractionCallbackResponse>} Replies to the interaction
	 */
	async execute(interaction) {
        const { member } = interaction;
        const { displayName: name, user } = member;

		const start = new ButtonBuilder()
			.setCustomId(UID_START)
			.setLabel('Ready')
			.setStyle(Success);
		const abort = new ButtonBuilder()
			.setCustomId(UID_HALT)
			.setLabel('Not yet')
			.setStyle(Danger);

		const greeting = 'Hello! I\'m Magical Card\'s Bot!\nI\'ll take you through the steps to make a card.\n\nAre you ready?';

		const embed = new EmbedBuilder()
			.setColor(Blue)
			.setTitle('Welcome')
			.setDescription(greeting)
			.setFooter({ text: name, iconURL: user.displayAvatarURL() })
			.setThumbnail(BOT_IMG_URL);

		const row = new ActionRowBuilder().addComponents(abort, start);

		return interaction.reply({ content: null, components: [row], embeds: [embed] });
	},
};