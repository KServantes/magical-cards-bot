// eslint-disable-next-line no-unused-vars
const { MessageEmbed, ButtonInteraction, Message } = require('discord.js');
const { BOT_IMG_URL } = require('../../constants');
const Form = require('./../../forms/index');
const Cache = require('../../cache');
const wait = require('node:timers/promises').setTimeout;


/**
 * Starts the card creation process
 * Brings up Info Form
 *
 * @param {ButtonInteraction} interaction
 * @returns {Promise<Message<boolean>>}
 */
const bcStart = async interaction => {
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
};

/**
 * Replies with farewell and deletes after 4 seconds.
 * @param {ButtonInteraction} interaction
 * @returns {Promise<Message>}
 */
const bcHalt = async interaction => {
	const { footer } = interaction.message.embeds[0];

	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Farewell')
		.setDescription('> Until next time...')
		.setFooter(footer)
		.setThumbnail(BOT_IMG_URL);

	await interaction.update({ components: [], embeds: [embed] });
	await wait(4000);
	return await interaction.message.delete();
};

/**
 *
 * @param {ButtonInteraction} interaction
 * @returns {Promise<Message>}
 */
const bcPreview = async interaction => {
	const { message, client, member } = interaction;
	const actionRow = message.components[0];
	const prevBtn = actionRow.components[0];

	const { cache } = client;
	const memberInfo = Cache.getMemberInfo(cache, member);

	const { preview: prev } = memberInfo;
	const label = prev ? 'OFF' : 'ON';

	prevBtn.setLabel('Preview: ' + label);
	memberInfo.showPreview = !prev;

	return await interaction.update({ embeds: message.embeds, components: message.components });
};

module.exports = { bcStart, bcHalt, bcPreview };