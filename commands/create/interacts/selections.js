/* eslint-disable no-unused-vars */
const Helper = require('../utils/cache');
const Canvas = require('../utils/canvas');
const {
	MessageEmbed,
	MessageActionRow,
	MessageButton,
	EmbedField,
	SelectMenuInteraction,
	MessageActionRowComponent,
	MessageSelectMenu,
} = require('discord.js');
const {
	UID_CARD_TYPE,
	UID_CARD_RACE,
	UID_CARD_ATT,
	UID_EDIT_STEP2,
	UID_NEXT_STEP3,
	BOT_IMG_URL,
	Archetypes,
} = require('../utils/constants');

const { MemberInfo } = require('../utils/types');

/**
 * Checks for legal values
 *
 * @param {EmbedField[]} fields
 * @param {MemberInfo} memberInfo
 * @returns {MessageEmbed}
 */
const checkTypes = (fields, memberInfo) => {
	const { name, iconURL } = memberInfo;
	const finishEmbed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Selections Complete')
		.setDescription('Final Selection')
		.setThumbnail(BOT_IMG_URL)
		.addFields(fields)
		.setImage('attachment://temp.png')
		.setFooter({ text: name, iconURL });
	// todo
	// if (bad) {
	// 	// if bad types
	// 	// changes color
	// 	// add footer 'error'

	// 	const errorEmbed = new MessageEmbed()
	// 		.setColor('#dd0f0f')
	// 		.setTitle('Selections Complete')
	// 		.setDescription('Final Selection')
	// 		.setThumbnail(BOT_IMG_URL)
	// 		.addFields(fields)
	// 		.setImage('attachment://temp.png')
	// 		.setFooter({
	// 			iconURL,
	// 			text: 'Cannot process the types you entered.\nPlease edit them.',
	// 		});

	// 	return errorEmbed;
	// }

	return finishEmbed;
};

/**
 * @param {SelectMenuInteraction} interaction Card Type Select Menu
 * @param {string} type (race, att, type)
 * @param {string} value value of type
 * @param {string} uid row's unique id
 * @returns {Promise<void>}
 */
const selection = async (interaction, type, value, uid) => {
	const { client, member, message } = interaction;
	const { components, embeds: msgEmbed } = message;
	const msgEmbFields = msgEmbed[0].fields;
	/**
	 * @type {EmbedField}
	 */
	const newField = {
		name: type,
		value,
		inline: true,
	};

	// remove select menu row from message
	// link to flow chart
	/**
	 * @type {MessageActionRow[]}
	 */
	const rest = components.filter(actionRow => actionRow.components[0].customId != uid);

	// add buttons for next step
	const isLastRow = rest.length === 1;
	if (isLastRow) {
		// Remove filter buttons
		rest.length = 0;

		const editBtn = new MessageButton()
			.setCustomId(UID_EDIT_STEP2)
			.setLabel('Edit')
			.setStyle('SECONDARY');
		const nextBtn = new MessageButton()
			.setCustomId(UID_NEXT_STEP3)
			.setLabel('Next')
			.setStyle('PRIMARY');

		const row = new MessageActionRow().addComponents(editBtn, nextBtn);
		rest.push(row);
	}

	// set in cache
	const { cache } = client;
	Helper.setDataCache({ member, cache, args: newField, step: 2 });

	// Merge fields
	const mergedFields = [];

	const { name: newName, value: newValue } = newField;
	if (msgEmbFields.some(f => f.name === newName)) {
		for (const field of msgEmbFields) {
			const { name: n } = field;
			if (n === newName) {
				field.value += `\n${newValue}`;
			}
			mergedFields.push(field);
		}
	}

	const embedFields = mergedFields.length ? mergedFields : [...msgEmbFields, newField];

	// message embed
	const currentEmbed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Selections')
		.setDescription('Current Selection')
		.setThumbnail(BOT_IMG_URL)
		.addFields(embedFields);

	const memberInfo = Helper.getMemberInfo(cache, member);
	// might not need checkTypes anymore?
	// returns final embed after
	// checks fields before review embed
	// I remember now it's for when card has invalid or wonky type info
	// Monster/Quickplay
	const embeds = isLastRow ? [checkTypes(embedFields, memberInfo)] : [currentEmbed];

	// draw results
	const button_row = rest[0];

	/** @type {MessageButton[]} */
	const buttons = button_row.components;
	const [first_button] = buttons;
	const dataSet = memberInfo.appInfo.data.at(2);
	if (first_button.customId === UID_EDIT_STEP2 && dataSet && dataSet.step === 2 && memberInfo.preview) {
		const cardImage = await Canvas.createCard({ member, cache, step: 2 });
		msg.files = [cardImage];
	}

	// Disable buttons if select menus interacted with first
	const setComponents = (_ => {
		const disButtons = buttons.reduce((acc, b) => {
			const { customId: id } = b;
			if (id === UID_EDIT_STEP2 || id === UID_NEXT_STEP3) {
				return acc.concat(b);
			}
			b.setDisabled(true);
			return acc.concat(b);
		}, []);
		button_row.setComponents(disButtons);

		return true;
	})();

	const res = [
		// not last row/selections complete
		first_button.customId !== UID_EDIT_STEP2,
		// no active buttons
		buttons.every(b => b.disabled === false),
	];

	// return either regular rest row array (buttons enabled) or
	// disabled buttons with rest row array (buttons disabled)
	const [_, ...selects] = rest;
	const restComponents = !res.every(Boolean) ? rest :
		setComponents && [button_row, ...selects];

	// final msg object
	const msg = { embeds, components: restComponents };

	return await interaction.update(msg);
};

/**
 * @async
 * @param {SelectMenuInteraction} interaction race interact sm
 * @returns {Promise<void>}
 */
const selectionRace = async interaction => {
	const [race] = interaction.values;
	return await selection(interaction, 'Race', race, UID_CARD_RACE);
};

/**
 * @async
 * @param {SelectMenuInteraction} interaction type interact sm
 * @returns {Promise<void>}
 */
const selectionType = async interaction => {
	const types = interaction.values;

	const str = types.reduce((acc, t) => {
		return acc.concat(t + '\n');
	}, '');

	return await selection(interaction, 'Type', str, UID_CARD_TYPE);
};

/**
 * @param {SelectMenuInteraction} interaction att interact sm
 * @returns {Promise<void>}
 */
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