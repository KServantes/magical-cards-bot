/**
 * button
 * @module ButtonController
 * 
 * @author Keddy
 * @version 0.1.0
 * @description This module executes the button interaction handler associated with it's unique ID.
 * */

const Create = require('@commands/create/index.js');
const Admin = require('@commands/admin/index');

const { ButtonInteraction, MessageFlags } = require('discord.js');
const { SuppressNotifications, Ephemeral } = MessageFlags;

/**
 * @param {ButtonInteraction} interaction 
 */
const isButton = interaction => {
	return interaction.isButton();
};

/**
 * @param {ButtonInteraction} interaction 
 */
const interactionButton = async (interaction) => {

	const { customId } = interaction;
	const buttonCombos = Create.button.concat(Admin.button)
	const buttonInteract = buttonCombos.get(customId)

	if(!buttonInteract) return;

	try {
		await buttonInteract(interaction);
	}
	catch (error) {
		console.log('button error', error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: SuppressNotifications|Ephemeral })
		}
	}
};

module.exports = {
	name: 'button',
	type: isButton,
	interact: interactionButton,
};