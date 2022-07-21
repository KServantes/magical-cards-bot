const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const db = require('../../data/models');

const { BOT_DEFAULT_PASS } = db;

const cardInfoSubmit = async interaction => {
	try {
		// const checkCard = interaction.client.cache.get('curr card');

		const cardName = interaction.fields.getTextInputValue('nameInput');
		const cardPEff = interaction.fields.getTextInputValue('pendInput');
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

		const formatText = `[Pendulum Effect]
${cardPEff}
----------------------------------------
[Card Text]
${cardDesc}`;

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Thank You')
			.setDescription(`
				*Card Recorded as:*

				**${cardName}**
				${!cardPEff ? cardDesc : formatText}
				${cardCode}`);

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('edit1')
					.setLabel('Edit')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('step2')
					.setLabel('Next')
					.setStyle('PRIMARY'),
			);

		// const { member } = interaction;
		// const params = { cardName, cardDesc, cardCode };
		// const card = await db.addCardToBase(member, params);
		const currentCard = { cardName, cardPEff, cardDesc, cardCode };
		interaction.client.cache.set('curr card', currentCard);
		await interaction.update({ embeds: [embed], components: [row] });
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

module.exports = { cardInfoSubmit };