const {
    MessageFlags,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChatInputCommandInteraction
} = require('discord.js');

const { Ephemeral } = MessageFlags;

const { DEFAULT_ADMIN_COMMANDS: default_commands } = require('./admin/interacts/chatInput');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('admin')
		.setDescription('Admin panel. Erase threads, update database, etc. Must have perms to use!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
        .addStringOption(option =>
            option
                .setName('command')
                .setDescription('The admin command to execute')
                .setRequired(true)
                .addChoices(...default_commands.keys())
        ),
	/**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @returns {Promise<InteractionResponse>}
     */
    async execute(interaction) {

        const { options } = interaction;

        let msg = { flags: Ephemeral };

        for (const [option,handler] of default_commands.entries()) {
            if (option.value === options.getString('command')) {
                msg = {...msg, ...handler(interaction)}
            }
        }

        return await interaction.reply(msg)
    }
};