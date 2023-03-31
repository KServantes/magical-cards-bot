const { MessageEmbed, MessageActionRow, MessageButton, SelectMenuInteraction, MessageActionRowComponent } = require('discord.js');
const Helper = require('../cache');
const Canvas = require('../canvas');
const {
	UID_CARD_TYPE,
	UID_CARD_RACE,
	UID_CARD_ATT,
	UID_EDIT_STEP2,
	UID_NEXT_STEP3,
	Archetypes,
} = require('../constants');

/**
 * 
 * @param {MessageActionRowComponent} components
 * @param {string} uid
 * @returns {MessageActionRowComponent}
 */
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
			.setImage('attachment://temp.png')
			.setFooter({
				'text': 'Cannot process the types you entered.\nPlease edit them.',
				'iconURL': 'https://i.imgur.com/ebtLbkK.png',
			});
	}

	return embed;
};

/**
 * @param {SelectMenuInteraction} interaction
 * @param {string} type
 * @param {string} value
 * @param {string} uid
 * @returns {Promise<APIMessage | Message<boolean>>}
 */
const selection = async (interaction, type, value, uid) => {
	const { member } = interaction;
	const { components } = interaction.message;

	const { embeds: msgEmbed } = interaction.message;
	const msgEmbFields = msgEmbed[0].fields;
	const newField = {
		name: type,
		value,
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
	Helper.setDataCache({ member, cache, args: newField, step: 2 });

	// message update
	// add member in to set footer data
	const embed = getEmbed([...msgEmbFields, newField], isEmptyRest);
	const msg = { embeds: [embed], components: rest };
	if (rest[0]?.components[0]?.type === 'BUTTON') {
		const cardImage = await Canvas.createCard({ member, cache, step: 2 });
		msg.files = [cardImage];
	}
	return await interaction.update(msg);
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
	try {
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

		// remove if duplicate
		for (const f of fields) {
			const { name } = f;
			if (msgEmbFields.some(field => field.name === name)) {
				mergedFields = mergedFields.filter(field => field.name !== name);
			}
		}

		// message update
		const embed = embeds[0].setFields(mergedFields);
		return await interaction.update({ embeds: [embed], components: components });
	}
	catch (error) {
		console.log(error);
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

module.exports = {
	selectionType,
	selectionRace,
	selectionAtt,
	selectionArch,
};