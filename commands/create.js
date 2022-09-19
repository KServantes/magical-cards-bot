const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { UID_START, UID_HALT } = require('./create/constants');
const Helper = require('../commands/create/cache');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Start the card creation process.'),

	async execute(interaction) {
		// temp cache for
		// grab member info
		const { member, client } = interaction;
		const { cache } = client;

		const memInfo = Helper.getMemberInfo(cache, member);
		const { apps, name } = memInfo;

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

		const greeting = '>>> Hello! I\'m Magical Card\'s Bot!\nI\'ll take you through the steps to make a card.\n\nAre you ready?';

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`Welcome ${name}`)
			.setDescription(greeting)
			.setFooter({ text: '‌‌  \n\n' + member.id })
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');

		const row = new MessageActionRow().addComponents(abort, start);

		return interaction.reply({ content: null, components: [row], embeds: [embed] });
	},
};