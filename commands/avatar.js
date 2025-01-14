const { SlashCommandBuilder, CommandInteraction, InteractionResponse, EmbedBuilder, Colors } = require('discord.js');
const { BOT_IMG_URL, DEFAULT_AVATAR_SIZE } = require('@constants')
const { Green } = Colors;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Get the avatar URL of the selected user, or your own avatar.')
		.addUserOption(option =>
            option
            .setName('member')
            .setDescription('The member\'s avatar to show'))
        .addIntegerOption(option => 
            option
            .setName('size')
            .setDescription('Choose an output size')
            .addChoices([
                { 'name': 'small', 'value': 128 },
                { 'name': 'medium', 'value': 256 },
                { 'name': 'large', 'value': 512 },
            ])
        ),
	/**
     * 
     * @param {CommandInteraction} interaction 
     * @returns {Promise<InteractionResponse>}
     */
        async execute(interaction) {
        const user = interaction.options.getUser('member') ?? interaction.member;
        const size = interaction.options.getInteger('size') ?? DEFAULT_AVATAR_SIZE;

        const embed = new EmbedBuilder()
			.setColor(Green)
			.setTitle(`${user.displayName}'s avatar:`)
            .setImage(`${user.displayAvatarURL({ extension: 'png', size })}`)
            .setFooter({ text: 'Magical Cards Bot', iconURL: BOT_IMG_URL });

        return interaction.reply({ content: null, embeds: [embed] });
	},
};