const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Helper = require('./cache');
const {
	UID_CARD_TYPE,
	UID_CARD_RACE,
	UID_CARD_ATT,
	UID_EDIT_STEP2,
	UID_NEXT_STEP3,
	Archetypes,

} = require('./constants');

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
				.setCustomId(UID_EDIT_STEP2)
				.setLabel('Edit')
				.setStyle('SECONDARY'),
		)
		.addComponents(
			new MessageButton()
				.setCustomId(UID_NEXT_STEP3)
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
		// if bad types
		// changes color
		// add footer 'error'
		embed = new MessageEmbed()
			.setColor('#dd0f0f')
			.setTitle('Selections Complete')
			.setDescription('Final Selection')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png')
			.addFields(fields)
			.setFooter({
				'text': 'Cannot process the types you entered.\nPlease edit them.',
				'iconURL': 'https://i.imgur.com/ebtLbkK.png',
			});
	}

	return embed;
};

const selection = async (interaction, type, value, uid) => {
	const { components } = interaction.message;

	const { embeds: msgEmbed } = interaction.message;
	const msgEmbFields = msgEmbed[0].fields;
	const newField = {
		name: type,
		value: value,
		inline: true,
	};

	// last selection to make
	// add buttons for next step
	const rest = getRestArray(components, uid);
	const isEmptyRest = rest.length === 0;
	if (isEmptyRest) {
		addButtonRow(rest);
	}

	// set in cache
	const { cache } = interaction.client;
	Helper.setDataCache(cache, newField, 2);

	// message update
	const embed = getEmbed([...msgEmbFields, newField], isEmptyRest);
	return await interaction.update({ embeds: [embed], components: rest });
};

const selectionRace = async interaction => {
	const [race] = interaction.values;
	return await selection(interaction, 'Race', race, UID_CARD_RACE);
};

const selectionType = async interaction => {
	const types = interaction.values;

	const str = types.reduce((acc, t) => {
		return acc.concat(t + '\n');
	}, '');

	return await selection(interaction, 'Type', str, UID_CARD_TYPE);
};

const selectionAtt = async interaction => {
	const [att] = interaction.values;
	return await selection(interaction, 'Attribute', att, UID_CARD_ATT);
};

const selectionArch = async interaction => {
	const arcs = interaction.values;

	const { components, embeds } = interaction.message;
	const msgEmbFields = embeds[0].fields;
	// const footerPage = embeds[0].footer.text.split(' ').at(-1);

	const fields = arcs.reduce((acc, a) => {
		const val = Archetypes.get(a);
		const str = `Dec: ${val}
		Hex: ${parseInt(val).toString(16)}`;

		const field = {
			name: a,
			value: str,
			inline: true,
		};

		return acc.concat(field);
	}, []);


	let mergedFields = [...msgEmbFields, ...fields];
	for (const f of fields) {
		const { name } = f;
		if (msgEmbFields.some(field => field.name === name)) {
			mergedFields = mergedFields.filter(field => field.name !== name);
		}
	}

	// message update
	const embed = embeds[0].setFields(mergedFields);
	return await interaction.update({ embeds: [embed], components: components });
};

module.exports = {
	selectionType,
	selectionRace,
	selectionAtt,
	selectionArch,
};