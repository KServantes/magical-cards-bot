const {
	Message,
	Collection,
	MessageEmbed,
	MessageButton,
	EmbedFieldData,
	MessageActionRow,
	ButtonInteraction,
	MessageSelectMenu,
	MessageSelectOptionData,
} = require('discord.js');
const Form = require('../../forms');
const Utils = require('../../utils');
const { Races, Types, Attributes,
	BOT_IMG_URL, UID_CARD_ATT, UID_CARD_RACE, UID_CARD_TYPE,
} = require('../../utils/constants');


/**
 * Gets options array
 * Filter to be added
 * @param {Collection.<string, number>} coll option collection
 * @param {Function} sf filter function
 * @returns {MessageSelectOptionData[]} options to be added
 */
const getOptions = (coll, sf) => {
	let startColl = coll;

	// spell function filter
	if (sf && typeof sf === 'function') {
		startColl = coll.filter(sf);
	}

	const options = startColl.reduce((acc, _, r) => {
		/**
		 * @type {MessageSelectOptionData}
		 */
		const option = {
			label: r,
			value: r,
		};

		return acc.concat(option);
	}, []);

	return options;
};

/**
 * Registers Card Data
 * Then brings up the Select Menus
 * (Race, Type, Attribute)
 * @param {ButtonInteraction} interaction Button Interaction
 * @returns {Promise<void>} the interaction message updated
 */
const bcNext = async interaction => {

	const { message, client, member } = interaction;
	const { footer } = message.embeds[0];
	const { cache } = client;

	Utils.RegisterCacheCard(cache, member);

	const selectRace =
		new MessageSelectMenu()
			.setCustomId(UID_CARD_RACE)
			.setPlaceholder('Zombie');
		// .addOptions(raceOptions);

	const selectType =
		new MessageSelectMenu()
			.setCustomId(UID_CARD_TYPE)
			.setPlaceholder('Monster')
			.setMinValues(2);
	// .setMaxValues(6);
	// .addOptions(typeOptions);

	const selectAtt =
		new MessageSelectMenu()
			.setCustomId(UID_CARD_ATT)
			.setPlaceholder('DARK')
			.setMinValues(1);
		// .addOptions(attOptions);

	/**
	 * @typedef {object} OptionsObject
	 * @property {[Collection, MessageSelectMenu]} Races races array
	 * @property {[Collection, MessageSelectMenu]} Types types array
	 * @property {[Collection, MessageSelectMenu]} Attributes att array
	 */

	/**
	 * @type {OptionsObject}
	 */
	const optionObject = {
		Races: [Races, selectRace],
		Types: [Types, selectType],
		Attributes: [Attributes, selectAtt],
	};

	const buttonRow = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('Spell|Trap')
				.setLabel('Spell/Trap')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('Monster')
				.setLabel('Monsters')
				.setStyle('SUCCESS'),
			new MessageButton()
				.setCustomId('Tokenize')
				.setLabel('Token')
				.setStyle('SECONDARY'),
		);

	const optionRows = [buttonRow];

	Object.values(optionObject).forEach(optionArray => {
		const [rowtype, selectmenu] = optionArray;
		const options = getOptions(rowtype);
		selectmenu.addOptions(options);
		const newRow = new MessageActionRow().addComponents(selectmenu);
		optionRows.push(newRow);
	});

	const fallbackFooter = { text: 'Magical Card\'s Bot', iconURL: BOT_IMG_URL };
	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Select this Card\'s  ')
		.setDescription('Please select this card\'s Race | Type | Attribute')
		.setFooter(footer ?? fallbackFooter)
		.setThumbnail(BOT_IMG_URL);

	return await interaction.update({ components: optionRows, embeds: [embed], files: [] });
};

/**
 * Brings up the Info Form again
 * @param {ButtonInteraction} interaction button interaction
 * @returns {Promise<Message>} the edited msg plus info form
 */
const bcEdit = async interaction => {
	await Form.info(interaction);
	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Editing Card')
		.setDescription('Please wait...')
		.setThumbnail(BOT_IMG_URL);
	return await interaction.message.edit({ embeds: [embed], components: [], files: [] });
};

/**
 * Filters the types down to only
 * @param {ButtonInteraction} interaction button interaction
 * @returns {Promise<void>} the updated message
 */
const bcSpellTrap = async interaction => {
	const { message } = interaction;
	const { embeds, components } = message;

	const msgEmbed = embeds[0];
	const { fields } = msgEmbed;
	if (fields.length > 0) msgEmbed.setFields([]);

	/**
	 * @type {MessageActionRow[]}
	 */
	const [actionRow, ...selectRows] = components;
	/**
	 * First button in action row "Preview"
	 * @type {MessageButton[]}
	 */
	const buttons = actionRow.components;
	// [spellBtn, monBtn, tokenBtn]

	// select spell/trap btn
	buttons.forEach(button => {
		if (button.customId != 'Spell|Trap') {
			button.setStyle('SECONDARY');
			return ;
		}
		button.setStyle('SUCCESS');
	});

	/**
	 * @type {MessageActionRow[]}
	 */
	const [typeRow] = selectRows.filter(row => row.components[0]?.customId === UID_CARD_TYPE);
	/**
	 * @type {MessageSelectMenu[]}
	 */
	const [typeMenu] = typeRow.components;

	/**
	 * @param {number} spellTypes combined spell types
	 * @returns {Function} a filter function
	 */
	const filterFun = spellTypes => val => (val & spellTypes) != 0;

	const TYPES_SPELL = new Collection([
		['Normal', 0x10],
		['Quickplay', 0x10000],
		['Continuous', 0x20000],
		['Field', 0x80000],
		['Counter', 0x100000],
	]).reduce((acc, num) => acc + num, 0);

	const spellOptions = getOptions(Types, filterFun(TYPES_SPELL));

	typeMenu.setPlaceholder('Quick-Play');
	typeMenu.setMinValues(1);
	typeMenu.setMaxValues(1);
	typeMenu.spliceOptions(0, 24, spellOptions);

	/**
	 * @type {EmbedFieldData[]}
	 */
	const preFill = [
		{
			name: 'Type',
			value: 'Spell',
			inline: true,
		},
	];
	msgEmbed.setFields(preFill);

	return await interaction.update({ embeds, components });
};

module.exports = {
	bcEdit,
	bcNext,
	bcSpellTrap,
};