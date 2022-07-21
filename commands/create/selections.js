const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const { UID_CARD_TYPE, UID_CARD_RACE, UID_CARD_ATT } = require('./buttons');

const getRestArray = (components, uid) => {
	// refers to what left
	// the rest of the array
	const rest = components.filter(actionRow => {
		// ass of v13 actionRow can only have 1 SelectMenuBuilder
		const selectMenu = actionRow.components[0];
		return selectMenu.customId != uid;
	});

	return rest;
};

const addButtonRow = rest => {
	// buttons needed
	// to start next step
	// or edit the input
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('edit2')
				.setLabel('Edit')
				.setStyle('SECONDARY'),
		)
		.addComponents(
			new MessageButton()
				.setCustomId('step3')
				.setLabel('Next')
				.setStyle('PRIMARY'),
		);

	rest.push(row);

	return rest;
};

const getEmbed = (fields, finish) => {

	let embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Selections')
		.setDescription('Current Selection')
		.setThumbnail('https://i.imgur.com/ebtLbkK.png')
		.addFields(fields);

	if (finish) {
		embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Selections Complete')
			.setDescription('Final Selection')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png')
			.addFields(fields);
	}

	return embed;
};

const selectionType = async interaction => {
	const types = interaction.values;
	const { components } = interaction.message;

	const str = types.reduce((acc, t) => {
		return acc.concat(t + '\n');
	}, '');

	const { embeds: msgEmbed } = interaction.message;
	const msgEmbFields = msgEmbed[0].fields;
	const newField = {
		name: 'Types',
		value: str,
		inline: true,
	};

	// last selection to make
	// add buttons for next step
	const rest = getRestArray(components, UID_CARD_TYPE);
	const isEmptyRest = rest.length === 0;
	if (isEmptyRest) {
		addButtonRow(rest);
	}

	const embed = getEmbed([...msgEmbFields, newField], isEmptyRest);
	return await interaction.update({ embeds: [embed], components: rest });
};

const selectionRace = async interaction => {
	const [race] = interaction.values;
	const { components } = interaction.message;

	const { embeds: msgEmbed } = interaction.message;
	const msgEmbFields = msgEmbed[0].fields;
	const newField = {
		name: 'Race',
		value: race,
		inline: true,
	};

	const rest = getRestArray(components, UID_CARD_RACE);
	const isEmptyRest = rest.length === 0;
	if (isEmptyRest) {
		addButtonRow(rest);
	}


	const embed = getEmbed([...msgEmbFields, newField], isEmptyRest);
	return await interaction.update({ embeds: [embed], components: rest });
};

const selectionAtt = async interaction => {
	const [att] = interaction.values;
	const { components } = interaction.message;

	const { embeds: msgEmbed } = interaction.message;
	const msgEmbFields = msgEmbed[0].fields;
	const newField = {
		name: 'Attribute',
		value: att,
		inline: true,
	};

	const rest = getRestArray(components, UID_CARD_ATT);
	const isEmptyRest = rest.length === 0;
	if (isEmptyRest) {
		addButtonRow(rest);
	}

	const embed = getEmbed([...msgEmbFields, newField], isEmptyRest);
	return await interaction.update({ embeds: [embed], components: rest });
};

module.exports = {
	selectionType,
	selectionRace,
	selectionAtt,
};