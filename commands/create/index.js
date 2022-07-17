const { MessageEmbed } = require('discord.js');
const { modalForm } = require('../../forms/modal');
const db = require('../../data/models');
const wait = require('node:timers/promises').setTimeout;

const { BOT_DEFAULT_PASS } = db;

// button interactions
const bcStart = async interaction => {
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


// modal submit interactions
const cardInfoSubmit = async interaction => {
	try {
		const cardName = interaction.fields.getTextInputValue('nameInput');
		const cardDesc = interaction.fields.getTextInputValue('effectInput');
		let cardCode = interaction.fields.getTextInputValue('idInput');

		// some type of validation
		// defaults to next in range
		cardCode = parseInt(cardCode);
		if (isNaN(cardCode)) {
			const botCards = await db.checkCard(BOT_DEFAULT_PASS);
			const botCardCt = botCards.length;
			const nextId = botCardCt + BOT_DEFAULT_PASS;
			botCardCt < 1 ?
				cardCode = BOT_DEFAULT_PASS :
				cardCode = nextId;
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
		const card = await db.addCardToBase(member, params);
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
	['start', bcStart],
	['halt', bcHalt],
]);

const interactModalSubmit = new Map([
	['card info', cardInfoSubmit],
]);


module.exports = {
	button: interactButton,
	modalSubmit: interactModalSubmit,
};