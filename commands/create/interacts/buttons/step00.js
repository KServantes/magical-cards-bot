// eslint-disable-next-line no-unused-vars
const { MessageEmbed, ButtonInteraction, Message, MessageButton } = require('discord.js');
const { BOT_IMG_URL, EMOTE_FACEDOWN, EMOTE_HATS } = require('../../utils/constants');
const Form = require('../../forms');
const Cache = require('../../utils/cache');
const wait = require('node:timers/promises').setTimeout;


/**
 * Starts the card creation process
 *
 * Brings up Info Form
 * @param {ButtonInteraction} interaction Button Interact
 * @returns {Promise<Message<boolean>>} Edited message
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
 * @param {ButtonInteraction} interaction Button Interact
 * @returns {Promise<Message>} Deleted message
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
 * Toggle the card image preview
 * @param {ButtonInteraction} interaction Button Interact
 * @returns {Promise<Message>} Message with updated components
 */
const bcPreview = async interaction => {
	const { message, client, member } = interaction;
	const { embeds, components } = message;
	const actionRow = components[0];
	/**
	 * First button in action row "Preview"
	 * @type {MessageButton}
	 */
	const prevBtn = actionRow.components[2];

	const { cache } = client;
	const memberInfo = Cache.getMemberInfo(cache, member);

	const { preview: prev } = memberInfo;
	const emoji = prev ? EMOTE_FACEDOWN : EMOTE_HATS;
	const label = prev ? 'Hiding' : 'Viewing';

	prevBtn.setEmoji(emoji);
	prevBtn.setLabel(label);
	memberInfo.showPreview = !prev;

	return await interaction.update({ embeds, components });
};

module.exports = { bcStart, bcHalt, bcPreview };