const { MessageEmbed } = require('discord.js');
const Helper = require('../../utils/cache');
const Form = require('../../forms');

// modal (atk, def, lvl, lscale, rscale)
/**
 * @param {MessageComponentInteraction} interaction
 * @returns {Promise<Message>|Promise<void>}
 */
const bcNext3 = async interaction => {
	const { cache } = interaction.client;
	const { member } = interaction;
	const cardRec = Helper.setCardCache(cache, member);
	console.log('Recorded as: ', cardRec);

	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Creating')
		.setDescription('Step 3 of 6...')
		.setThumbnail('https://i.imgur.com/ebtLbkK.png');

	await Form.stats(interaction);
	return await interaction.message.edit({ embeds: [embed], components: [], files: [] });
};

module.exports = { bcNext3 };