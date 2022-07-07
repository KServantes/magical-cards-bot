const { MessageEmbed } = require('discord.js');
const { addCardToBase } = require('../data/models');
const wait = require('node:timers/promises').setTimeout;


const isModalSubmit = interaction => {
	return interaction.isModalSubmit();
};

const interactionModalSubmit = async (interaction) => {
	if (interaction.customId === 'card info') {

		const cardName = interaction.fields.getTextInputValue('nameInput');
		const cardDesc = interaction.fields.getTextInputValue('effectInput');
		const cardCode = interaction.fields.getTextInputValue('idInput');

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

};

module.exports = {
	name: 'modal',
	type: isModalSubmit,
	interact: interactionModalSubmit,
};