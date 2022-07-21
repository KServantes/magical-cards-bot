const { MessageActionRow, MessageSelectMenu, MessageEmbed, Message } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { infoForm } = require('../../forms/info');

const bcStart = async interaction => {
	try {
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Creating')
			.setDescription('Please wait...');
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
				.setCustomId('card race')
				.setPlaceholder('Zombie')
				.addOptions([
					{
						label: 'Zombie',
						value: 'race_zombie',
					},
					{
						label: 'Warrior',
						value: 'race_warrior',
					},
				]),
		);

	const typeRow = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId('card type')
				.setPlaceholder('Monster')
				.setMinValues(2)
				// .setMaxValues(6)
				.addOptions([
					{
						label: 'Monster',
						description: 'Card Type',
						value: 'monster',
						emoji: '337135382833659906',
					},
					{
						label: 'Effect',
						description: 'Effect Monster',
						value: 'effect',
					},
					{
						label: 'Normal',
						description: 'Normal Monster/Spell/Trap',
						value: 'normal',
					},
				]),
		);

	const attributeRow = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId('card att')
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
		.setTitle('Enter the Card\'s type')
		.setDescription('What\'s this card\'s type?');

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
			.setDescription('Please wait...');
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
};