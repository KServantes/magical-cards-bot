const { Modal, TextInputComponent, MessageActionRow } = require('discord.js');
const { UID_CARD_STATS } = require('../constants');

const statsForm = async (interaction) => {

	const modal = new Modal()
		.setCustomId(UID_CARD_STATS)
		.setTitle('Card Stats');
	const atkInput = new TextInputComponent()
		.setCustomId('atkInput')
		.setLabel('What\'s this card\'s ATK?')
		.setStyle('SHORT')
		.setPlaceholder('ATK')
		.setRequired(true);
	const defInput = new TextInputComponent()
		.setCustomId('defInput')
		.setLabel('What\'s this card\'s DEF?')
		.setStyle('SHORT')
		.setPlaceholder('DEF')
		.setRequired(true);
	const lvlInput = new TextInputComponent()
		.setCustomId('lvlInput')
		.setLabel('What is this card\'s LVL?')
		.setStyle('SHORT')
		.setPlaceholder('LVL')
		.setRequired(true);
	const lsInput = new TextInputComponent()
		.setCustomId('lsInput')
		.setLabel('What is this card\'s Left Pendulum Scale?')
		.setStyle('SHORT')
		.setPlaceholder('Left Scale');
	const rsInput = new TextInputComponent()
		.setCustomId('rsInput')
		.setLabel('What is this card\'s Right Pendulum Scale?')
		.setStyle('SHORT')
		.setPlaceholder('Right Scale');

	const atkActionRow = new MessageActionRow().addComponents(atkInput);
	const defActionRow = new MessageActionRow().addComponents(defInput);
	const lvlActionRow = new MessageActionRow().addComponents(lvlInput);
	const lscaleActionRow = new MessageActionRow().addComponents(lsInput);
	const rscaleActionRow = new MessageActionRow().addComponents(rsInput);

	modal.addComponents(
		atkActionRow,
		defActionRow,
		lvlActionRow,
		lscaleActionRow,
		rscaleActionRow,
	);

	interaction.showModal(modal);
};

module.exports = { statsForm };