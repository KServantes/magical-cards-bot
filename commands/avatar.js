const { SlashCommandBuilder, CommandInteraction, InteractionResponse } = require('discord.js');
const DEFAULT_SIZE = 128

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
            .setDescription('Choose the output size')
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
		const user = interaction.options.getUser('member');
        const size = interaction.options.getInteger('size') ?? DEFAULT_SIZE;
		if (user) return interaction.reply(`${user.username}'s avatar: ${user.displayAvatarURL({ extension: 'png', size })}`);
		return interaction.reply(`Your avatar: ${interaction.user.displayAvatarURL({ extension: 'png', size })}`);
	},
};