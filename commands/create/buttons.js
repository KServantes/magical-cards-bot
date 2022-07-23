const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { infoForm } = require('./forms/info');
const { statsForm } = require('./forms/stats');

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

	const raceRow = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId(UID_CARD_RACE)
				.setPlaceholder('Zombie')
				.addOptions([
					{
						label: 'Zombie',
						value: 'Zombie',
					},
					{
						label: 'Warrior',
						value: 'Warrior',
					},
				]),
		);

	const typeRow = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId(UID_CARD_TYPE)
				.setPlaceholder('Monster')
				.setMinValues(2)
				// .setMaxValues(6)
				.addOptions([
					{
						label: 'Monster',
						description: 'Monster Card',
						value: 'Monster',
						emoji: '337135382833659906',
					},
					{
						label: 'Effect',
						description: 'Effect Monster',
						value: 'Effect',
					},
					{
						label: 'Normal',
						description: 'Normal (Monster/Spell/Trap)',
						value: 'Normal',
					},
				]),
		);

	const attributeRow = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId(UID_CARD_ATT)
				.setPlaceholder('DARK')
				.setMinValues(1)
				.addOptions([
					{
						label: 'DARK',
						value: 'DARK',
					},
				]),
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
		const prevCard = interaction.client.cache.get('curr card');
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

const bcNextSp3 = async interaction => {
	try {
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

module.exports = {
	bcEdit,
	bcHalt,
	bcStart,
	bcNext,
	bcEdit2,
	bcEdit3,
	bcNextSp3,
};