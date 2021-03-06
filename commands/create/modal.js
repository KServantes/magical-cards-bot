const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const db = require('../../data/models');
const Helper = require('./cache');

const { BOT_DEFAULT_PASS } = db;
const {
	UID_EDIT_STEP1,
	UID_NEXT_STEP2,
	UID_EDIT_STEP3,
	UID_NEXT_STEP4,
} = require('./constants');

const STEP_NO = 1;

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
			.setThumbnail('https://i.imgur.com/ebtLbkK.png')
			.setDescription(`
				*Card Recorded as:*

				**${cardName}**
				${!cardPEff ? cardDesc : formatText}
				${cardCode}`);

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(UID_EDIT_STEP1)
					.setLabel('Edit')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(UID_NEXT_STEP2)
					.setLabel('Next')
					.setStyle('PRIMARY'),
			);

		// const { member } = interaction;
		// const params = { cardName, cardDesc, cardCode };
		// const card = await db.addCardToBase(member, params);
		const currentCard = { cardName, cardPEff, cardDesc, cardCode };
		const { cache } = interaction.client;
		Helper.setDataCache(cache, currentCard, STEP_NO);
		await interaction.update({ embeds: [embed], components: [row] });
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const cardStatsSubmit = async interaction => {

	// Embeds and Buttons for da msg update
	const mkEmbed = fields => {
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Card Stats')
			.setDescription('Card entered as: ')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png')
			.addFields(fields);

		return embed;
	};

	const editBtn = new MessageButton()
		.setCustomId(UID_EDIT_STEP3)
		.setLabel('Edit')
		.setStyle('SECONDARY');

	const nextBtn = new MessageButton()
		.setCustomId(UID_NEXT_STEP4)
		.setLabel('Next')
		.setStyle('PRIMARY');


	// actual interaction
	try {
		const getInputVal = input => interaction.fields.getTextInputValue(input);

		const cardATK = getInputVal('atkInput');
		const cardDEF = getInputVal('defInput');
		const cardLVL = getInputVal('lvlInput');
		let cardLScale = '';
		let cardRScale = '';

		const stats = {
			'ATK': cardATK,
			'DEF': cardDEF,
			'LVL': cardLVL,
		};

		const { cache } = interaction.client;
		const card = Helper.getCardCache(cache);
		if (card.temp.isPendy) {
			cardLScale = getInputVal('lsInput');
			cardRScale = getInputVal('rsInput');

			stats['lscale'] = cardLScale;
			stats['rscale'] = cardRScale;
		}


		// form validation
		// not counting lscale or rscale atm
		// later refactor to check card
		// if pend then input received
		// if not pend then no input in the modal (undefined)
		const errStr = [];
		const fields = [];
		// eslint-disable-next-line prefer-const
		for (let [stat, val] of Object.entries(stats)) {
			const notInt = isNaN(parseInt(val));
			if (notInt) {
				errStr.push(stat);
			}

			if (val === '') val = '0';
			const field = {
				name: stat,
				value: val,
				inline: true,
			};

			fields.push(field);
		}

		// edit
		// form errors
		if (errStr.length >= 1) {
			const str = errStr.reduce((acc, stat) => {
				return acc + `${stat} `;
			}, '');

			const embed = mkEmbed(fields);
			const reEmbed = embed
				.setColor('#dd0f0f')
				.setFields(fields)
				.setFooter({
					'text': `Please enter a number value for ${str}`,
					'iconURL': 'https://i.imgur.com/ebtLbkK.png',
				});


			const reEdit = editBtn.setStyle('DANGER');
			const reNext = nextBtn.setDisabled(true);
			const row = new MessageActionRow().addComponents(reEdit, reNext);
			return await interaction.update({ embeds: [reEmbed], components: [row] });
		}

		// set card data - step 3
		Helper.setDataCache(cache, fields, 3);

		// message update
		const embed = mkEmbed(fields);
		const row = new MessageActionRow().addComponents(editBtn, nextBtn);
		return await interaction.update({ embeds: [embed], components: [row] });
	}
	catch (error) {
		if (error.name === 'TypeError') {
			const embed = mkEmbed([]);
			const reEmbed = embed
				.setColor('#dd0f0f')
				.setDescription('Hmm, seems there was an error.')
				.setFooter({
					'text': 'Type Error: eg. Cannot enter "1000" as "1,000".\n Please try again.',
					'iconURL': 'https://i.imgur.com/ebtLbkK.png',
				});

			const reEdit = editBtn.setStyle('DANGER');
			const reNext = nextBtn.setDisabled(true);
			const row = new MessageActionRow().addComponents(reEdit, reNext);
			return await interaction.reply({ embeds: [reEmbed], components: [row] });
		}

		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

module.exports = {
	cardInfoSubmit,
	cardStatsSubmit,
};