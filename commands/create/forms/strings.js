const { Modal, TextInputComponent, MessageActionRow, Collection } = require('discord.js');

const stringsForm = async (interaction, count = 1) => {
	// const { cache } = interaction.client;
	// const card = getCardCache(cache);

	const modal = new Modal()
		.setCustomId('strings')
		.setTitle('Card Strings');
	const str1 = new TextInputComponent()
		.setCustomId('strOne')
		.setLabel('Description String One')
		.setStyle('PARAGRAPH')
		.setPlaceholder('str1');
	const str2 = new TextInputComponent()
		.setCustomId('strTwo')
		.setLabel('Description String Two')
		.setStyle('PARAGRAPH')
		.setPlaceholder('str2');
	const str3 = new TextInputComponent()
		.setCustomId('strThree')
		.setLabel('Description String Three')
		.setStyle('PARAGRAPH')
		.setPlaceholder('str3');
	const str4 = new TextInputComponent()
		.setCustomId('strFour')
		.setLabel('Description String Four')
		.setStyle('PARAGRAPH')
		.setPlaceholder('str4');
	const str5 = new TextInputComponent()
		.setCustomId('strFive')
		.setLabel('Description String Five')
		.setStyle('PARAGRAPH')
		.setPlaceholder('str5');

	const firstRow = new MessageActionRow().addComponents(str1);
	const secondRow = new MessageActionRow().addComponents(str2);
	const thirdRow = new MessageActionRow().addComponents(str3);
	const fourthRow = new MessageActionRow().addComponents(str4);
	const fifthRow = new MessageActionRow().addComponents(str5);

	const mapper = new Collection([
		[1, firstRow],
		[2, secondRow],
		[3, thirdRow],
		[4, fourthRow],
		[5, fifthRow],
	]);

	for (const [strCt, row] of mapper.entries()) {
		if (strCt <= count) modal.addComponents(row);
	}

	interaction.showModal(modal);
};

module.exports = { stringsForm };