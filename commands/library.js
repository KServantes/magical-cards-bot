const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getMemCards } = require('../data/models');
const wait = require('node:timers/promises').setTimeout;

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

			const msg = cards.reduce((acc, c, i) => {
				const str = `[${i + 1}] [${c.id}] - ${c.name} \n`;

				return acc.concat(`${str}`);
			}, `Library | Cards: ${cards.length} \n`);

			const msgFormat = (message) => {
				return ` \`\`\`${message}\`\`\` `;
			};

			const reply = await interaction.reply({ content: msgFormat(msg), fetchReply: true });
			const reactables = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
			cards.forEach(async (_, i) => {
				const reaction = reactables[i];
				await reply.react(reaction);
			});

			const filter = (r, u) => {
				return reactables.includes(r.emoji.name) && u.id != reply.author.id;
			};
			// const collector = reply.createReactionCollector({ filter, maxEmojis: 1 });
			const collection = await reply.awaitReactions({ filter, max: 1, time: 60000 });

			const reaction = collection.first();
			const cardIndex = reactables.indexOf(reaction.emoji.name);
			const card = cards[cardIndex];
			const msgContent = `Library | Cards: ${cards.length}\n[${card.id}]\n${card.name}\n${card.desc}\n`;
			console.log(msgContent);
			await reply.edit({ content: msgFormat(msgContent) });
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