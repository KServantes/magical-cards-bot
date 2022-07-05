const { MessageEmbed } = require('discord.js');

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

		await interaction.update({ embeds: [embed] });
		const cards = [{ cardName, cardDesc, cardCode }];
		console.log(cards);
	}

};

module.exports = {
	name: 'modal',
	type: isModalSubmit,
	interact: interactionModalSubmit,
};