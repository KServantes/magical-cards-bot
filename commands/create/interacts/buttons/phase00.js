/**
 * Phase 00
 * @module Buttons_00_InitialReply
 * 
 * @author Keddy
 * @version 0.1.0
 * @description  Keeps the ButtonHandler functions for the buttons on the bot's initial reply.
 * Editing message with an Info Modal in DMs
 * Creating a new thread in the server channel. You can specify which channels you'd like it make threads in.
 * Creating a new forum post in a community. You can specify what forum channel you'd like to use.
 * */

const { Colors, Message, Collection, ButtonInteraction, EmbedBuilder, 
	ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType,
	ActionRowBuilder, GuildTextThreadManager, ThreadAutoArchiveDuration, } = require('discord.js');

const wait = require('node:timers/promises').setTimeout;
const { OneHour } = ThreadAutoArchiveDuration;
const { PrivateThread } = ChannelType;
const { Short } = TextInputStyle;
const { Blue } = Colors;

const { BOT_IMG_URL } = require('@constants');


/**
 * Starts the card creation process
 *
 * Updates initial message and info modal
 * @param {ButtonInteraction} interaction Button Interact
 * @returns {Promise<Message<boolean>>} Edited message
 */
const buttonStart = async interaction => {

	const { message } = interaction;
	const { footer } = message.embeds[0];

	const embed = new EmbedBuilder()
		.setColor(Blue)
		.setTitle('Creating')
		.setDescription('Please wait...')
		.setFooter(footer)
		.setThumbnail(BOT_IMG_URL);

	const modal = new ModalBuilder()
		.setCustomId('check')
		.setTitle('Card Info');
	const nameInput = new TextInputBuilder()
		.setCustomId('checkers')
		.setLabel('What\'s this card\'s name?')
		.setStyle(Short)
		.setPlaceholder('Name')
		.setRequired(true);

	const nameActionRow = new ActionRowBuilder().addComponents(nameInput);

	modal.addComponents(nameActionRow);

	await interaction.showModal(modal);

	return await interaction.update({ components: [], embeds: [embed] })
};

/**
 * Starts the card creation process
 *
 * Starts a new thread and sends a info message to that thread
 * @param {ButtonInteraction} interaction Button Interact
 * @returns {Promise<Message<boolean>>} Edited message
 */
const buttonStartThread = async interaction => {
	const { message, member, channel } = interaction;
	const { footer } = message.embeds[0];
	/** @type {{ threads: GuildTextThreadManager }} */
	const { threads } = channel;

	const getThreadCount = (() => {
		const memColl = new Collection();

		if (threads.cache && threads.cache.size > 1) {
			const memberCount = threads.cache.reduce((acc, thread) => {
				const { ownerId, name } = thread;
				if (ownerId == process.env.CLIENT_ID && name.startsWith(member.displayName)) {
					acc.set(acc.size,thread)
				}
				return acc;
			}, memColl)

			return memberCount.size + 1
		}
		else return 1;
	})();

	const newChannel = await threads.create({
		name: `${member.displayName}'s Custom Card ${getThreadCount}`,
		autoArchiveDuration: OneHour,
		type: PrivateThread,
		// rateLimitPerUser: 3,
		reason: 'Magical Cards Bot Custom Card Application'
	});

	const embed = new EmbedBuilder()
		.setColor(Blue)
		.setTitle('New Card')
		.setDescription('We\'ve created a new card application! At anytime, while in this channel, you can mention me @MagicalCardsBot for Menu Options!')
		.setFooter(footer)
		.setThumbnail(BOT_IMG_URL)
		.setTimestamp();

	const routeEmbed = new EmbedBuilder()
		.setColor(Blue)
		.setTitle('Creating...')
		.setDescription(`You\'ve been added to ${newChannel}! Keep in mind other slash commands will not work in these threads!`)
		.setFooter(footer)
		.setThumbnail(BOT_IMG_URL)
		.setTimestamp();

	await newChannel.members.add(member)
	await newChannel.send({ content: null, components: [], embeds: [embed] })
	return await interaction.update({ components: [], embeds: [routeEmbed] })
};

/**
 * Replies with farewell and deletes after 4 seconds.
 * @param {ButtonInteraction} interaction Button Interact
 * @returns {Promise<Message>} Deleted message
 */
const buttonHalt = async interaction => {
	const { message } = interaction;
	const { footer } = message.embeds[0];

	const embed = new EmbedBuilder()
		.setColor(Blue)
		.setTitle('Farewell')
		.setDescription('Until next time...')
		.setFooter(footer)
		.setThumbnail(BOT_IMG_URL);

	await interaction.update({ components: [], embeds: [embed] });
	await wait(2000);
	if (message.deletable) await interaction.deleteReply();
};

module.exports = { buttonStart, buttonStartThread, buttonHalt };