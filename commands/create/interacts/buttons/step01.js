const { MessageEmbed, MessageActionRow, MessageSelectMenu, ButtonInteraction, MessageButton } = require('discord.js');
const Form = require('../../forms');
const Utils = require('../../utils');
const { Races, Types, Attributes,
	BOT_IMG_URL, UID_CARD_ATT, UID_CARD_RACE, UID_CARD_TYPE,
} = require('../../utils/constants');


/**
 * Registers Card Data
 * Then brings up the Select Menus
 * (Race, Type, Attribute)
 * @param {ButtonInteraction} interaction Button Interaction
 * @returns {Promise<void>} the interaction message updated
 */
const bcNext = async interaction => {

	const { cache } = interaction.client;
	const { member } = interaction;
	Utils.RegisterCacheCard(cache, member);

	const getOptions = coll => {
		const options = coll.reduce((acc, _, r) => {
			const option = {
				label: r,
				value: r,
			};

			return acc.concat(option);
		}, []);

		return options;
	};

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
				.setStyle('SECONDARY'),
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

	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Select this Card\'s  ')
		.setDescription('Please select this card\'s Race | Type | Attribute')
		.setThumbnail(BOT_IMG_URL);

	return await interaction.update({ components: optionRows, embeds: [embed], files: [] });
};

/**
 * Brings up the Info Form again
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

module.exports = {
	bcEdit,
	bcNext,
};