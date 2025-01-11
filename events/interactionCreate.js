const { Events, CommandInteraction, MessageFlags } = require('discord.js')
const { InteractionCreate } = Events;
const { Ephemeral } = MessageFlags;

module.exports = {
    name: InteractionCreate,
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @returns 
     */
    async execute(interaction) {
        try {
            const { client } = interaction;
		    const { interactions } = client;

            // eslint-disable-next-line no-unused-vars
            for (const [ _, interactType] of interactions.entries()) {
                const { type, interact } = interactType;
                if (type(interaction)) {
                    interact(interaction);
                }
            }
        }
        catch (error) {
            console.log('interaction error', error);
            return await interaction.reply({ content: 'There was an error executing this interaction!', flags: Ephemeral });
        }
    }
};