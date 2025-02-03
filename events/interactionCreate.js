/**
 * interactionCreate
 * @module Event_InteractionCreate
 * 
 * @author Keddy
 * @version 0.1.0
 * @description  This module executes on Event.InteractionCreate the interaction handler associated with it's unique ID.
 * 
 * */

const { Events, Message, MessageFlags, Collection, ChatInputCommandInteraction, InteractionResponse } = require('discord.js')
const { InteractionCreate } = Events;
const { Ephemeral } = MessageFlags;

/** 
 * @callback IsInteractType
 * @param {ChatInputCommandInteraction} interaction
 * @returns {boolean}
 */

/**
 * @callback InteractHandler
 * @param {ChatInputCommandInteraction} interaction
 * @returns {Promise<Message>} 
 */

/**
 * @typedef {Object} InteractionModule
 * @prop {string} name 
 * @prop {IsInteractType} type
 * @prop {InteractHandler} interact
 */


module.exports = {
    name: InteractionCreate,
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @returns {Promise<InteractionResponse>}
     */
    async execute(interaction) {
        try {
            const { client } = interaction;
            /** @type {{ interactions: Collection<string,InteractionModule> }} */
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