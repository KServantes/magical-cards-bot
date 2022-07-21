const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const db = require('../../data/models');
const { bcStart, bcHalt, bcEdit, bcNext } = require('./buttons');

const { BOT_DEFAULT_PASS } = db;

// modal submit interactions
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

const selectionType = async interaction => {
	const types = interaction.values;
	const { components } = interaction.message;
	console.log('components', components);
	// message components = [ MessageActionRow{type, comp}, MessageActionRow{type, comp} ]
	// components MessageActionRow = [ SelectMenuBuilder {...} ]
	console.log(components.length);
	if (components.length === 1) {
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Selections')
			.setDescription('Final Selections')
			.addFields([
				{
					name: 'Types',
					value: 'Types\nList\nHere',
					inline: true,
				},
				{
					name: 'Race',
					value: 'Zombie',
					inline: true,
				},
				{
					name: 'Attribute',
					value: 'DARK',
					inline: true,
				},
			]);
		return await interaction.update({ embeds: [embed], components: [] });
	}
	const rest = components.filter(actionRow => {
		// ass of v13 actionRow can only have 1 SelectMenuBuilder
		const selectMenu = actionRow.components[0];
		return selectMenu.customId != 'card type';
	});

	const str = types.reduce((acc, t) => {
		return acc.concat(t + '\n');
	}, '');


	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Selections')
		.setDescription('Current Selection')
		.addFields([
			{
				name: 'Types',
				value: str,
				inline: true,
			},
		]);

	return await interaction.update({ embeds: [embed], components: rest });
};

const interactButton = new Map([
	['start', bcStart],
	['halt', bcHalt],
	['edit1', bcEdit],
	['step2', bcNext],
]);

const interactModalSubmit = new Map([
	['card info', cardInfoSubmit],
]);

const interactSelectMenu = new Map([
	['card type', selectionType],
]);


module.exports = {
	button: interactButton,
	modalSubmit: interactModalSubmit,
	selectMenu: interactSelectMenu,
};