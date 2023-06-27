const { Modal, TextInputComponent, MessageActionRow, ButtonInteraction } = require('discord.js');
const { BOT_DEFAULT_PASS } = require('../../../data/models');
const { UID_CARD_INFO } = require('../utils/constants');
const { StepDataInfo } = require('../utils/types');
const Helper = require('../utils/cache');

/**
 * #### Info Modal Function
 *
 * Takes info for name, pendulum effect, effect desc, and passcode
 * The name and id is to be short with the id being limited to 10 characters.
 * Upon validation the id will be converted to a number
 * if the id exists or is not a number it will be exchanged for the next id in the list.
 * @param {ButtonInteraction} interaction Button that called it
 */
const infoForm = async (interaction) => {
	const { member, client } = interaction;
	const { cache } = client;
	/**
	 * @type {StepDataInfo}
	 */
	const prev = Helper.getStepCache({ cache, member, step: 1 });

	const modal = new Modal()
		.setCustomId(UID_CARD_INFO)
		.setTitle('Card Info');
	let nameInput = new TextInputComponent()
		.setCustomId('nameInput')
		.setLabel('What\'s the name of this card?')
		.setStyle('SHORT')
		.setPlaceholder('Name')
		.setRequired(true);
	let pendInput = new TextInputComponent()
		.setCustomId('pendInput')
		.setLabel('If any, this card\'s Pendulum Effect text?')
		.setStyle('PARAGRAPH')
		.setPlaceholder('Pendulum Effect');
	let effectInput = new TextInputComponent()
		.setCustomId('effectInput')
		.setLabel('What is this card\'s effect text?')
		.setStyle('PARAGRAPH')
		.setPlaceholder('Effect')
		.setRequired(true);
	let idInput = new TextInputComponent()
		.setCustomId('idInput')
		.setLabel('What is this card\'s password? (Number only).')
		.setStyle('SHORT')
		.setMaxLength(10)
		.setRequired(true)
		.setPlaceholder(`e.g. 36021814 - Limit 10. (Default ${BOT_DEFAULT_PASS})`);
	if (prev) {
		nameInput = nameInput.setValue(prev.name);
		pendInput = pendInput.setValue(prev.temp.cardPEff);
		effectInput = effectInput.setValue(prev.temp.cardDesc);
		idInput = idInput.setValue(`${prev.id}`);
	}
	const nameActionRow = new MessageActionRow().addComponents(nameInput);
	const pendActionRow = new MessageActionRow().addComponents(pendInput);
	const effectActionRow = new MessageActionRow().addComponents(effectInput);
	const idActionRow = new MessageActionRow().addComponents(idInput);

	modal.addComponents(nameActionRow, pendActionRow, effectActionRow, idActionRow);

	interaction.showModal(modal);
};

module.exports = { infoForm };