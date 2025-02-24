const { Colors, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder, MessageFlags,
	SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { UID_START, UID_HALT, UID_START_THREAD, BOT_IMG_URL, BOT_FORUM_CHANNEL, GUILD_CACHE } = require('@constants');
const { BotClient } = require('@structures');
const { Success, Danger } = ButtonStyle;
const { Ephemeral } = MessageFlags;
const { Blue } = Colors;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Create cards, images, and databases for YGOPRO.'),
	/**
	 * Creates a prompt to start the card making process
	 * @param {ChatInputCommandInteraction} interaction Command interaction
	 * @returns {Promise<Message>} Replies to the interaction
	 */
	async execute(interaction) {
        const { member, user, guildId } = interaction;
		/** @type {{ client: BotClient }} */
		const { client } = interaction;
        const { displayName: name } = member;

		const start = new ButtonBuilder()
			.setCustomId(UID_START)
			.setLabel('Ready')
			.setStyle(Success);
		const startThread = new ButtonBuilder()
			.setCustomId(UID_START_THREAD)
			.setLabel('Ready')
			.setStyle(Success)
		const abort = new ButtonBuilder()
			.setCustomId(UID_HALT)
			.setLabel('Not yet')
			.setStyle(Danger);

		const greeting = 'Hello! I\'m Magical Card\'s Bot!\nI\'ll take you through the steps to make a card.\n\nAre you ready?';

		const embed = new EmbedBuilder()
			.setColor(Blue)
			.setTitle('Welcome')
			.setDescription(greeting)
			.setFooter({ text: name, iconURL: user.displayAvatarURL() })
			.setThumbnail(BOT_IMG_URL)
			.setTimestamp();

		const components = interaction.channel.isDMBased() ? [abort,start] : [abort,startThread];
		const row = new ActionRowBuilder().addComponents(components);

		/** @todo DB.getForumChannelForServer() */
		const { forum_channel } = client.bot.getGuildSettings(guildId)

		if (BOT_FORUM_CHANNEL != '' || forum_channel != '') {
			console.log('forum channel exists!')
			// return interaction.reply({ content: `There is a forum channel we could use in ${channelMention(BOT_FORUM_CHANNEL)}`})
		}

		return interaction.reply({ content: null, components: [row], embeds: [embed], flags: Ephemeral})
	},
};