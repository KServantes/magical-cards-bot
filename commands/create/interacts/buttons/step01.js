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
const { Races, Types, TYPES_SPELL, Attributes,
	BOT_IMG_URL, UID_CARD_ATT, UID_CARD_RACE, UID_CARD_TYPE,
	UID_SPELL_FIRE, UID_TRAP_ACTIVATE, UID_MONSTER_SUMMON, UID_CARD_TOKENIZE,
} = require('../../utils/constants');


/**
 * @typedef {object} OptionsObject
 * @property {[Collection, MessageSelectMenu]} Races races array
 * @property {[Collection, MessageSelectMenu]} Types types array
 * @property {[Collection, MessageSelectMenu]} Attributes att array
 */


/**
 * Gets options array
 * Filter to be added
 * @param {Collection.<string, number>} coll option collection
 * @param {number} fillTypes filter value function
 * @returns {MessageSelectOptionData[]} options to be added
 */
const getOptions = (coll, fillTypes) => {
	let startColl = coll;

	/**
	 * @param {number} ftypes combined spell types
	 * @returns {Function} a filter function
	 */
	const filterFun = ftypes => val => (val & ftypes) != 0;

	// spell function filter
	if (fillTypes && typeof fillTypes === 'number') {
		const sf = filterFun(fillTypes);
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

const createSelectMenus = () => {
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
	 * @type {OptionsObject}
	 */
	const optionObject = {
		Races: [Races, selectRace],
		Types: [Types, selectType],
		Attributes: [Attributes, selectAtt],
	};

	return optionObject;
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

	const buttonRow = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId(UID_SPELL_FIRE)
				.setLabel('Spell')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId(UID_TRAP_ACTIVATE)
				.setLabel('Trap')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId(UID_MONSTER_SUMMON)
				.setLabel('Monster')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId(UID_CARD_TOKENIZE)
				.setLabel('Token')
				.setStyle('SECONDARY'),
		);

	const optionRows = [buttonRow];

	const optionObject = createSelectMenus();

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

// helper functions
/**
 * @param {MessageActionRow<MessageButton>} actionRow button action row
 * @returns {string} the button's style toggled
 */
const bhToggleActive = actionRow => {
	const buttons = actionRow.components;
	// [spellBtn, trapBtn, monBtn, tokenBtn]

	// select spell/trap btn */
	const spellBtn = buttons[0];
	const { style } = spellBtn;
	spellBtn.setStyle(style == 'SECONDARY' ? 'PRIMARY' : 'SECONDARY');

	return spellBtn.style;
};

/**
 * Run after the button is toggled
 * Resets to original state/wipes state
 * @param {MessageActionRow[]} components message components to edit
 */
const bhResetSelectMenu = components => {
	// readd rows if removed
	const [actBtnRow] = components;

	/** @type {MessageButton[]} */
	const buttons = actBtnRow.components;
	if (buttons.every(b => b.style === 'SECONDARY')) {
		// reset
		components.length = 0;
		components.push(actBtnRow);

		// eslint-disable-next-line no-unused-vars
		const OptionsObject = createSelectMenus();
		Object.values(OptionsObject).forEach(optionArray => {
			const [rowtype, selectmenu] = optionArray;
			const options = getOptions(rowtype);
			selectmenu.addOptions(options);
			const newRow = new MessageActionRow().addComponents(selectmenu);
			components.push(newRow);
		});
	}
};

/**
 * Sets the options for the select menu row
 * filtered down to spell/trap
 * @param {MessageActionRow<MessageSelectMenu>} typeRow types select menu row
 * @param {MessageSelectOptionData[]} options type data options
 */
const filterTypesRow = (typeRow, options) => {
	const [typeMenu] = typeRow.components;

	typeMenu.setPlaceholder('Normal');
	typeMenu.setMinValues(1);
	typeMenu.setMaxValues(1);
	typeMenu.spliceOptions(0, 24, options);
};

/**
 * Filters the types down to only
 * @param {ButtonInteraction} interaction button interaction
 * @returns {Promise<void>} the updated message
 */
const bcSpell = async interaction => {
	const { message } = interaction;
	const { embeds, components } = message;
	const msgEmbed = embeds[0];

	/** @type {MessageActionRow[]} */
	const [actionRow] = components;

	const spellBtnStyle = bhToggleActive(actionRow);

	// Unselect button
	if (spellBtnStyle === 'SECONDARY') {
		// Remove "Trap" or old "Spell" fields
		/** @todo remove either or fields from embed */
		const { fields } = msgEmbed;
		const res = [
			fields.length > 0,
			fields.some(f => f.value.includes('Spell')),
		];
		if (res.every(Boolean)) {
			const filterFields = fields.filter(f => !f.value.includes('Spell'));
			msgEmbed.setFields(filterFields);
		}

		// bhResetSelectMenu(components);
		bhResetSelectMenu(components);

		return await interaction.update({ embeds, components });
	}

	// Select button
	/** @type {MessageButton[]} */
	const [{ style: monStyle }] = actionRow.components.filter(btn => btn.customId === UID_MONSTER_SUMMON);

	/** * @type {MessageActionRow[]} */
	const [typeRow] = components.filter(row => row.components[0]?.customId === UID_CARD_TYPE);

	// monster button inactive
	monStyle !== 'PRIMARY' ?
		(() => {
			const spellTypes = TYPES_SPELL.reduce((acc, num) => acc + num, 0);
			const spellOptions = getOptions(Types, spellTypes);
			filterTypesRow(typeRow, spellOptions);

			// remove other menus
			const [ar] = components;
			components.length = 0;
			components.push(ar, typeRow);

			/** @type {EmbedFieldData[]} */
			const preFill = [
				{
					name: 'Type',
					value: 'Spell',
					inline: true,
				},
			];
			msgEmbed.setFields(preFill);
		})() :
		(() => {
			const cont_count = 'Continuous Counter';
			const smTypes = Types.filter((_, key) => !RegExp(key).test(cont_count));
			const mOptions = getOptions(smTypes);
			filterTypesRow(typeRow, mOptions);
		})();


	return await interaction.update({ embeds, components });
};

const bcMonster = async interaction => {
	const { message } = interaction;
	const { embeds, components } = message;
	const msgEmbed = embeds[0];

	/** @type {MessageActionRow[]} */
	const [actionRow, ...selectRows] = components;

	// toggle active button
	const spellBtnStyle = bhToggleActive(actionRow);
};

module.exports = {
	bcEdit,
	bcNext,
	bcSpell,
};