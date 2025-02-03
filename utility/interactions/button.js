/**
 * button
 * @module ButtonController
 * 
 * @author Keddy
 * @version 0.1.0
 * @description This module executes the button interaction handler associated with it's unique ID.
 * */

const Create = require('@commands/create/index.js');
const { ButtonInteraction } = require('discord.js');

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
	const buttonInteract = Create.button.get(customId)

	if(!buttonInteract) return;

	try {
		await buttonInteract(interaction);
	}
	catch (error) {
		console.log('button error', error);
		// await interaction.channel.send({ content: 'There was an error while executing this command!', flags:'SuppressNotifications' });
	}

};

module.exports = {
	name: 'button',
	type: isButton,
	interact: interactionButton,
};