const { MessageEmbed } = require('discord.js');
const { modalForm } = require('../forms/modal');
const { getMemCards } = require('../data/models');

const isButton = interaction => {
	return interaction.isButton();
};

const cardInfoModal = async interaction => {

	// bring up the app for info
	if (interaction.customId === 'yes') {
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
	}

	// remove any buttons with reply
	if (interaction.customId === 'no') {
		try {
			return await interaction.update({ content: 'Okay. See you!', components: [] });
		}
		catch (error) {
			return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
		}
	}
	return ;
};

const interactionButton = async (interaction) => {

	// card info modal
	cardInfoModal(interaction);
	// library message
	if (interaction.customId === 'show_cards') {
		const cards = await getMemCards();

		const msg = cards.reduce((acc, c, i) => {
			let str = `[${i + 1}] [${c.id}] - ${c.name}`;
			if (i + 1) { str = str.concat(' \n');}

			return acc.concat(`${str}`);
		}, '');

		const msgFormat = ` \`\`\`${msg}\`\`\` `;

		await interaction.update({ content: msgFormat, components: [], embeds: [] });
	}

};

module.exports = {
	name: 'button',
	type: isButton,
	interact: interactionButton,
};