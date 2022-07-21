const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { infoForm } = require('./forms/info');

// button ids
// local
const UID_CARD_TYPE = 'card type';
const UID_CARD_RACE = 'card race';
const UID_CARD_ATT = 'card att';
// selections
const UID_EDIT_STEP2 = 'edit2';
const UID_NEXT_STEP3 = 'step3';
// modal
const UID_EDIT_STEP1 = 'edit1';
const UID_NEXT_STEP2 = 'step2';

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

const bcEdit2 = async interaction => {
	try {
		return await bcNext(interaction);
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
	UID_CARD_ATT,
	UID_CARD_RACE,
	UID_CARD_TYPE,
	UID_EDIT_STEP2,
	UID_NEXT_STEP3,
	UID_EDIT_STEP1,
	UID_NEXT_STEP2,
};