const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const Cards = require('../data/models');
const Cache = require('./library/cache');
const Helper = require('./library/msgHelper');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('library')
		.setDescription('Review the cards in your library.')
		.addUserOption(option =>
			option
				.setName('duelist')
				.setDescription('The member\'s library to show.'),
		)
		.addStringOption(option =>
			option
				.setName('card')
				.setDescription('Card to look for')
				.setAutocomplete(true),
		),
	async execute(interaction) {
		const { member, client, options, user } = interaction;
		// const userOp = options.getUser('duelist');
		// const { id: memberID } = userOp ? userOp : member;
		const cards = await Cards.getAllCards();

		const { cache } = client;
		Helper.setPageInfo({ cache, member, cards });

		const memInfo = Cache.getMemberInfo(cache, member);
		const { page } = memInfo;

		if (cards.length >= 1) {
			try {
				const { msg, maxPage } = Helper.getEmbedMsg({ cache, member });
				const url = user.displayAvatarURL();

				const cardsEmbed = new MessageEmbed()
					.setColor('#7ec460')
					.setTitle('Library')
					.setDescription(msg)
					.setThumbnail('https://i.imgur.com/ebtLbkK.png')
					.setFooter({ text: `Page 1 of ${maxPage}`, iconURL: url });

				const prevPage = new MessageButton()
					.setCustomId('lib prev page')
					.setLabel('<<')
					.setDisabled(page === 1 ? true : false)
					.setStyle('PRIMARY');
				const nextPage = new MessageButton()
					.setCustomId('lib next page')
					.setLabel('>>')
					.setDisabled(page === maxPage ? true : false)
					.setStyle('PRIMARY');
				const exportCards = new MessageButton()
					.setCustomId('export cards')
					.setLabel('Export')
					.setDisabled(true)
					.setStyle('SUCCESS');

				const row = new MessageActionRow().addComponents(prevPage, nextPage, exportCards);

				const buttons = new Array(10);
				for (const index of buttons.keys()) {
					buttons[index] = new MessageButton()
						.setCustomId(`card ${index}`)
						.setLabel(`${ 1 + index }`)
						.setStyle('SECONDARY');
				}

				const btop = buttons.slice(0, 5);
				const bsec = buttons.slice(5);
				const srow1 = new MessageActionRow().addComponents(btop);
				const srow2 = new MessageActionRow().addComponents(bsec);

				return await interaction.reply({ embeds: [cardsEmbed], components: [row, srow1, srow2] });
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
				.setDescription(msg)
				.setThumbnail('https://i.imgur.com/ebtLbkK.png');

			await interaction.reply({ embeds: [embed] });
			await wait(4000);
			return await interaction.deleteReply();
		}
	},
};