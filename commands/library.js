const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { getMemCards } = require('../data/models');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('library')
		.setDescription('Review the cards in your library.')
		.addUserOption(option => option.setName('duelist').setDescription('The member\'s library to show.')),
	async execute(interaction) {
		const userOp = interaction.options.getUser('duelist');
		if (userOp) interaction.client.cache.set('libUser', userOp);
		const { id: memberID } = userOp ? userOp : interaction.member;
		const cards = await getMemCards(memberID);

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('show_cards')
					.setLabel('Show')
					.setStyle('SUCCESS'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('export_cards')
					.setLabel('Export')
					.setStyle('PRIMARY'),
			);

		if (cards.length >= 1) {
			const msg = `You have ${cards.length} card${cards.length < 2 ? '' : 's'} in the library.`;
			const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Library')
				.setDescription(msg);

			await interaction.reply({ components: [row], embeds: [embed] });
			// await wait(4000);
			// return await interaction.deleteReply();
		}
		else {
			const msg = 'I\'m  afraid I don\'t have any cards ';
			const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Library')
				.setDescription(msg);

			await interaction.reply({ embeds: [embed] });
			await wait(4000);
			return await interaction.deleteReply();
		}
	},
};