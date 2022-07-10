const { MessageEmbed } = require('discord.js');
const { modalForm } = require('../../forms/modal');
const { addCardToBase } = require('../../data/models');
const wait = require('node:timers/promises').setTimeout;


// button interactions
const bcYes = async interaction => {
	try {
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Creating')
			.setDescription('Please wait...');
		await modalForm(interaction);
		return await interaction.message.edit({ embeds: [embed], components: [] });
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const bcNo = async interaction => {
	try {
		await interaction.update({ content: 'Okay. See you!', components: [], embeds: [] });
		await wait(4000);
		return await interaction.message.delete();
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};


// modal submit interactions
const cardInfoSubmit = async interaction => {
	try {
		const cardName = interaction.fields.getTextInputValue('nameInput');
		const cardDesc = interaction.fields.getTextInputValue('effectInput');
		const cardCode = interaction.fields.getTextInputValue('idInput');

		// some type of validation
		const verCode = parseInt(cardCode);
		if (typeof verCode != 'number') {
			const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Whoa')
				.setDescription(`I'm afraid I can't take that submission!
			${cardCode} isn't a number!`);
			await interaction.update({ embeds: [embed] });
			await wait(4000);
			return await interaction.message.delete();
		}

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Thank You')
			.setDescription(`
				Card Recorded as: ${cardName}\n
				${cardDesc}\n
				${cardCode}`);

		const { member } = interaction;
		const params = { cardName, cardDesc, cardCode };
		const card = await addCardToBase(member, params);
		console.log(card);
		if (card.error === undefined) {
			await interaction.update({ embeds: [embed] });
			await wait(4000);
			return await interaction.message.delete();
		}

		const failEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Whoa')
			.setDescription(`There was a problem!\n
			${card.error}`);

		return interaction.update({ embeds: [failEmbed] });
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const interactButton = new Map([
	['yes', bcYes],
	['no', bcNo],
]);

const interactModalSubmit = new Map([
	['card info', cardInfoSubmit],
]);


module.exports = {
	button: interactButton,
	modalSubmit: interactModalSubmit,
};