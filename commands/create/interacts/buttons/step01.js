const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const Form = require('../../forms');
const Utils = require('../../utils');
const { Races, Types, Attributes,
	BOT_IMG_URL, UID_CARD_ATT, UID_CARD_RACE, UID_CARD_TYPE,
} = require('../../constants');


/**
 * Registers Card Data
 * Then brings up the Select Menus
 * (Race, Type, Attribute)
 */
const bcNext = Utils.MiddleWrapper(async interaction => {

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

	const raceOptions = getOptions(Races);
	const raceRow = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId(UID_CARD_RACE)
				.setPlaceholder('Zombie')
				.addOptions(raceOptions),
		);


	const typeOptions = getOptions(Types);
	const typeRow = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId(UID_CARD_TYPE)
				.setPlaceholder('Monster')
				.setMinValues(2)
				// .setMaxValues(6)
				.addOptions(typeOptions),
		);


	const attOptions = getOptions(Attributes);
	const attributeRow = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId(UID_CARD_ATT)
				.setPlaceholder('DARK')
				.setMinValues(1)
				.addOptions(attOptions),
		);

	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Select this Card\'s  ')
		.setDescription('Please select this card\'s Race | Type | Attribute')
		.setThumbnail(BOT_IMG_URL);

	return await interaction.update({ components: [raceRow, typeRow, attributeRow], embeds: [embed], files: [] });
});

/**
 * Brings up the Info Form again
 */
const bcEdit = Utils.MiddleWrapper(async interaction => {
	await Form.info(interaction);
	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Editing Card')
		.setDescription('Please wait...')
		.setThumbnail(BOT_IMG_URL);
	return await interaction.message.edit({ embeds: [embed], components: [], files: [] });
});

module.exports = { bcEdit, bcNext };