const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const Helper = require('./cache');
const { infoForm } = require('./forms/info');
const { statsForm } = require('./forms/stats');
const { Races, Types, Attributes } = require('./constants');

const { UID_CARD_ATT, UID_CARD_RACE, UID_CARD_TYPE } = require('./constants');

// start
const bcStart = async interaction => {
	try {
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Creating')
			.setDescription('Please wait...')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');
		await infoForm(interaction);
		return await interaction.message.edit({ embeds: [embed], components: [] });
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const bcHalt = async interaction => {
	try {
		await interaction.update({ content: 'Okay. See you!', components: [], embeds: [] });
		await wait(4000);
		return await interaction.message.delete();
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};


// step 1 => step 2
const bcNext = async interaction => {

	const { cache } = interaction.client;
	const cardRec = Helper.setCardCache(cache);
	console.log('Recorded as: ', cardRec);

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
		.setTitle('Select this Card\'s Stats')
		.setDescription('Please select this card\'s Race | Type | Attribute')
		.setThumbnail('https://i.imgur.com/ebtLbkK.png');

	return await interaction.update({ components: [raceRow, typeRow, attributeRow], embeds: [embed] });
};

const bcEdit = async interaction => {
	try {
		const { cache } = interaction.client;
		const prevCard = Helper.getStepCache(cache, 1);
		if (prevCard === 'undefined') return await interaction.update({ content: 'there was an error.', components: [] });
		await infoForm(interaction);
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Editing Card')
			.setDescription('Please wait...')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');
		return await interaction.message.edit({ embeds: [embed], components: [] });
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};


// step 2 => step 3
const bcEdit2 = async interaction => {
	try {
		return await bcNext(interaction);
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const bcNext3 = async interaction => {
	try {

		const { cache } = interaction.client;
		const cardRec = Helper.setCardCache(cache);
		console.log('Recorded as: ', cardRec);

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Creating')
			.setDescription('Step 3 of 6...')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');
		await statsForm(interaction);
		return await interaction.message.edit({ embeds: [embed], components: [] });
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};


// step 3 => step 4
const bcEdit3 = async interaction => {
	try {
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Editing')
			.setDescription('Step 3 of 6...')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');
		await statsForm(interaction);
		return await interaction.message.edit({ embeds: [embed], components: [] });
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const bcNext4 = async interaction => {
	try {
		const { cache } = interaction.client;
		const cardRec = Helper.setCardCache(cache);
		console.log('Recorded as: ', cardRec);
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};


module.exports = {
	bcStart,
	bcHalt,
	bcEdit,
	bcNext,
	bcEdit2,
	bcNext3,
	bcEdit3,
	bcNext4,
};