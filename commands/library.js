const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getMemCards } = require('../data/models');
const wait = require('node:timers/promises').setTimeout;
const Helper = require('./library/msgHelper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('library')
		.setDescription('Review the cards in your library.')
		.addUserOption(option => option.setName('duelist').setDescription('The member\'s library to show.')),
	async execute(interaction) {
		const userOp = interaction.options.getUser('duelist');
		const { id: memberID } = userOp ? userOp : interaction.member;
		const cards = await getMemCards(memberID);

		if (cards.length >= 1) {
			try {
				const msg = Helper.initialMsg(cards);
				const reply = await interaction.reply({ content: msg, fetchReply: true });
				Helper.reactToMsg(reply, cards);

				const collection = await Helper.reactionCollection(reply);
				if (collection.size < 1) return await reply.reactions.removeAll();
				const reaction = collection.first();
				const { name } = reaction.emoji;
				const card = Helper.getCardFromReact(name, cards);
				const msgContent = `Library | Cards: ${cards.length}\n[${card.id}]\n${card.name}\n${card.desc}\n`;
				Helper.msgLoop(reply, { content: Helper.formatMsg(msgContent) }, cards);
			}
			catch (err) {
				console.log({ err });
				return await interaction.reply({ content: 'Something went wrong.' });
			}
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