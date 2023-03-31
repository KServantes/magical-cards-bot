const { MessageEmbed } = require('discord.js');
const { BOT_IMG_URL } = require('../../constants');
const { MiddleWrapper } = require('../../utils');
const Form = require('./../../forms/index');
const wait = require('node:timers/promises').setTimeout;


/**
 * Starts the card creation process
 * Brings up Info Form
 */
const bcStart = MiddleWrapper(async interaction => {
	const { message } = interaction;
	const { footer } = message.embeds[0];

	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Creating')
		.setDescription('> Please wait...')
		.setFooter(footer)
		.setThumbnail(BOT_IMG_URL);


	await Form.info(interaction);

	return await message.edit({ embeds: [embed], components: [] });
});

const bcHalt = MiddleWrapper(async interaction => {
	await interaction.update({ content: 'Until next time...', components: [], embeds: [] });
	await wait(4000);
	return await interaction.message.delete();
});

module.exports = { bcStart, bcHalt };