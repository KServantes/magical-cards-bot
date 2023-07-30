const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, CommandInteraction } = require('discord.js');
const { UID_START, UID_HALT, UID_VISTA, EMOTE_HATS } = require('./create/utils/constants');
const Helper = require('./create/utils/cache');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Create cards, images, and databases for YGOPRO.'),
	/**
	 * Creates a prompt to start following the card making process
	 * @param {CommandInteraction} interaction Command interaction
	 * @returns {Promise<void>} Replies to the interaction
	 */
	async execute(interaction) {
		const { member, client } = interaction;
		const { cache } = client;

		const memInfo = Helper.getMemberInfo(cache, member);
		const { apps, name, iconURL } = memInfo;

		if (apps.size > 0) {
			// new embeds and such
			// to continue unfinished cards
		}

		const start = new MessageButton()
			.setCustomId(UID_START)
			.setLabel('Ready')
			.setStyle('SUCCESS');
		const abort = new MessageButton()
			.setCustomId(UID_HALT)
			.setLabel('Not yet')
			.setStyle('DANGER');
		const preview = new MessageButton()
			.setCustomId(UID_VISTA)
			.setLabel('Viewing')
			.setEmoji(EMOTE_HATS)
			.setStyle('SECONDARY');

		const greeting = '>>> Hello! I\'m Magical Card\'s Bot!\nI\'ll take you through the steps to make a card.\n\nAre you ready?';

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Welcome')
			.setDescription(greeting)
			.setFooter({ text: name, iconURL })
			// .setFooter({ text: '‌‌  \n\n' + member.id })
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');

		const row = new MessageActionRow().addComponents(abort, start, preview);

		return interaction.reply({ content: null, components: [row], embeds: [embed] });
	},
};