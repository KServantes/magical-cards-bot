const { MessageEmbed } = require('discord.js');
const { modalForm } = require('../forms/modal');

const isButton = interaction => {
	return interaction.isButton();
};

const interactionButton = async (interaction) => {

	// bring up the app for info
	if (interaction.customId === 'yes') {
		try {
			const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Creating')
				.setDescription('Please wait...');
			await modalForm(interaction);
			await interaction.message.edit({ embeds: [embed], components: [] });
		}
		catch (error) {
			await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
		}
	}
	// remove any buttons with reply
	if (interaction.customId === 'no') {
		try {
			await interaction.update({ content: 'Okay. See you!', components: [] });
		}
		catch (error) {
			await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
		}
	}
};

module.exports = {
	name: 'button',
	type: isButton,
	interact: interactionButton,
};