const { Modal, TextInputComponent, MessageActionRow } = require('discord.js');

const modalForm = async interaction => {

	const modal = new Modal()
		.setCustomId('card info')
		.setTitle('Card Info');
	const nameInput = new TextInputComponent()
		.setCustomId('nameInput')
		.setLabel('What\'s the name of this card?')
		.setStyle('SHORT');
	const effectInput = new TextInputComponent()
		.setCustomId('effectInput')
		.setLabel('What is this card\'s effect text?')
		.setStyle('PARAGRAPH');
	const idInput = new TextInputComponent()
		.setCustomId('idInput')
		.setLabel('What is this card\'s unique card code?')
		.setStyle('SHORT');
	const nameActionRow = new MessageActionRow().addComponents(nameInput);
	const effectActionRow = new MessageActionRow().addComponents(effectInput);
	const idActionRow = new MessageActionRow().addComponents(idInput);

	modal.addComponents(nameActionRow, effectActionRow, idActionRow);

	interaction.showModal(modal);
};

module.exports = {
	modalForm,
};