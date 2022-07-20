const { Modal, TextInputComponent, MessageActionRow } = require('discord.js');
const { BOT_DEFAULT_PASS } = require('../data/models');

const infoForm = async (interaction) => {
	const prev = interaction.client.cache.get('curr card');

	const modal = new Modal()
		.setCustomId('card info')
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
		nameInput = nameInput.setValue(prev.cardName);
		pendInput = pendInput.setValue(prev.cardPEff);
		effectInput = effectInput.setValue(prev.cardDesc);
		idInput = idInput.setValue(`${prev.cardCode}`);
	}
	const nameActionRow = new MessageActionRow().addComponents(nameInput);
	const pendActionRow = new MessageActionRow().addComponents(pendInput);
	const effectActionRow = new MessageActionRow().addComponents(effectInput);
	const idActionRow = new MessageActionRow().addComponents(idInput);

	modal.addComponents(nameActionRow, pendActionRow, effectActionRow, idActionRow);

	interaction.showModal(modal);
};

module.exports = {
	infoForm,
};