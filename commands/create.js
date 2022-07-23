const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { UID_START, UID_HALT } = require('./create/constants');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Start the card creation process.'),

	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(UID_START)
					.setLabel('Ready')
					.setStyle('SUCCESS'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(UID_HALT)
					.setLabel('Not yet')
					.setStyle('DANGER'),
			);

		const greeting = 'Hello! I\'m Magical Card\'s Bot!\nI\'ll take you through the steps to make a card.\n    Are you ready?';

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Welcome')
			.setDescription(greeting)
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');

		return interaction.reply({ content: null, components: [row], embeds: [embed] });
	},
};