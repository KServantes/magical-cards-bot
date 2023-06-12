const { Modal, TextInputComponent, MessageActionRow } = require('discord.js');
const { UID_CARD_STATS } = require('../utils/constants');
const { getCardCache } = require('../utils/cache');

const statsForm = async (interaction) => {
	const { cache } = interaction.client;
	const { member } = interaction;
	const card = getCardCache(cache, member);
	const { isLink, isPendy } = card.temp;

	const modal = new Modal()
		.setCustomId(UID_CARD_STATS)
		.setTitle('Card Stats');
	const atkInput = new TextInputComponent()
		.setCustomId('atkInput')
		.setLabel('What\'s this card\'s ATK?')
		.setStyle('SHORT')
		.setPlaceholder('ATK')
		.setMaxLength(7)
		.setRequired(true);
	const defInput = new TextInputComponent()
		.setCustomId('defInput')
		.setLabel('What\'s this card\'s DEF?')
		.setStyle('SHORT')
		.setPlaceholder('DEF')
		.setMaxLength(7)
		.setRequired(true);
	const rating = {
		label: isLink ? 'Link Rating' : 'LVL',
		holder: isLink ? 'LINK' : 'LVL',
		long: isLink ? 1 : 2,
	};
	const lvlInput = new TextInputComponent()
		.setCustomId('lvlInput')
		.setLabel(`What is this card's ${rating.label}?`)
		.setStyle('SHORT')
		.setPlaceholder(`${rating.holder}`)
		.setMaxLength(rating.long)
		.setRequired(true);
	const lsInput = new TextInputComponent()
		.setCustomId('lsInput')
		.setLabel('What is this card\'s Left Pendulum Scale?')
		.setStyle('SHORT')
		.setMaxLength(2)
		.setPlaceholder('Left Scale');
	const rsInput = new TextInputComponent()
		.setCustomId('rsInput')
		.setLabel('What is this card\'s Right Pendulum Scale?')
		.setStyle('SHORT')
		.setMaxLength(2)
		.setPlaceholder('Right Scale');

	const atkActionRow = new MessageActionRow().addComponents(atkInput);
	const defActionRow = new MessageActionRow().addComponents(defInput);
	const lvlActionRow = new MessageActionRow().addComponents(lvlInput);
	const lscaleActionRow = new MessageActionRow().addComponents(lsInput);
	const rscaleActionRow = new MessageActionRow().addComponents(rsInput);

	modal.addComponents(atkActionRow);
	if (!isLink) modal.addComponents(defActionRow);
	modal.addComponents(lvlActionRow);
	if (isPendy) modal.addComponents(lscaleActionRow, rscaleActionRow);

	interaction.showModal(modal);
};

module.exports = { statsForm };