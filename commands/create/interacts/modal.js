const { MessageActionRow, MessageButton, MessageEmbed, ModalSubmitInteraction, Message } = require('discord.js');
const db = require('../../../data/models');
const Helper = require('../utils/cache');
const Canvas = require('../utils/canvas');

const { BOT_DEFAULT_PASS } = db;
const {
	UID_EDIT_STEP1,
	UID_NEXT_STEP2,
	UID_EDIT_STEP3,
	UID_NEXT_STEP4,
} = require('../utils/constants');

const { InfoFormData } = require('../utils/types');

const STEP_ONE = 1;
const STEP_THREE = 3;

/**
 * @typedef {object} errorObjectMsg
 * @property {MessageEmbed[]} embeds embeds to pass
 * @property {MessageActionRow[]} components buttons to pass
 * @property {[]} files files to be wiped
 */

/**
 * @typedef {object} errorObject
 * @property {boolean} error true if failed the check
 * @property {errorObjectMsg} [msg] available if failed the check
 */

/**
 * Checks if the card already exists and
 * returns an error object with error message
 * @param {number} card_id Card's passcode to check
 * @returns {errorObject} an object with the results
 */
const checkOldCard = async card_id => {
	const exists = await db.getCard(card_id);
	if (exists) {
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Card Exists Already')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png')
			.setDescription(`>>> I'm afraid ${card_id} already exists!\n
Please enter a different card id`);

		const editButton = new MessageButton()
			.setCustomId(UID_EDIT_STEP1)
			.setLabel('Edit')
			.setStyle('SECONDARY');
		const row = new MessageActionRow().addComponents(editButton);

		return { error: true,
			msg: { embeds: [embed], components: [row], files: [] },
		};
	}

	return { error: false };
};

/**
 * Checks if the string passed is a valid number
 * If failed then auto picks a number from the bot default range
 * @param {number|string} card_id card's passcode string to be checked/converted
 * @returns {number} a new number id from default range
 */
const checkConvertType = async card_id => {
	let cardCode = card_id;
	if (isNaN(cardCode)) {
		const botCards = await db.checkDefaultCards(BOT_DEFAULT_PASS);
		const botCardCt = botCards.length;
		const nextId = botCardCt + BOT_DEFAULT_PASS;
		botCardCt < 1 ?
			cardCode = BOT_DEFAULT_PASS :
			cardCode = nextId;
	}

	return cardCode;
};

/**
 * Submit Function for the Info Modal Form
 * @param {ModalSubmitInteraction} interaction Info Form Modal
 * @returns {Promise<void>|Promise<Message>} Either updates message with confirm or error message
 */
const cardInfoSubmit = async interaction => {
	const { member, client, fields } = interaction;
	const { cache } = client;

	/**
	 * @param {string} input stringer
	 * @returns {string} slightly shorter func name
	 */
	const getInputVal = input => fields.getTextInputValue(input);

	try {
		const cardName = getInputVal('nameInput');
		const cardPEff = getInputVal('pendInput');
		const cardDesc = getInputVal('effectInput');
		let cardCode = getInputVal('idInput');
		cardCode = parseInt(cardCode);

		// if 'bad' string
		// replace with default rng
		cardCode = await checkConvertType(cardCode);

		// Check Card Exists
		const errorMessage = await checkOldCard(cardCode);

		const formatText = `[Pendulum Effect]
${cardPEff}
----------------------------------------
[Card Text]
${cardDesc}`;

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Thank You')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png')
			.setImage('attachment://temp.png')
			.setFooter({ text: member.nickname, iconURL: member.user.displayAvatarURL() })
			.setDescription(`>>> 
*Card Recorded as:*

**${cardName}**
${!cardPEff ? cardDesc : formatText}
${cardCode}`);

		const editButton = new MessageButton()
			.setCustomId(UID_EDIT_STEP1)
			.setLabel('Edit')
			.setStyle('SECONDARY');

		const nextButton = new MessageButton()
			.setCustomId(UID_NEXT_STEP2)
			.setLabel('Next')
			.setStyle('PRIMARY');

		const row = new MessageActionRow().addComponents(editButton, nextButton);

		// cache actions
		/**
		 * @type {InfoFormData} Info from the info form
		 */
		const currentCard = { cardName, cardPEff, cardDesc, cardCode };
		Helper.setDataCache({ member, cache, args: currentCard, step: STEP_ONE });

		// current card image
		const memInfo = Helper.getMemberInfo(cache, member);
		const messageFiles = [];
		if (memInfo.preview) {
			const cardImage = await Canvas.createCard({ member, cache, step: STEP_ONE });
			messageFiles.push(cardImage);
		}

		if (errorMessage.error) {
			return await interaction.update(errorMessage.msg);
		}

		await interaction.update({ embeds: [embed], components: [row], files: messageFiles });
	}
	catch (error) {
		console.log(error);
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
		let cardDEF = 0;
		const cardLVL = getInputVal('lvlInput');
		let cardLScale = '';
		let cardRScale = '';

		const stats = {
			'ATK': cardATK,
			'LVL': cardLVL,
		};

		const { cache } = interaction.client;
		const { member } = interaction;
		const card = Helper.getCardCache(cache, member);
		const { isLink, isPendy } = card.temp;
		if (!isLink) {
			cardDEF = getInputVal('defInput');

			stats['DEF'] = cardDEF;
		}
		if (isPendy) {
			cardLScale = getInputVal('lsInput');
			cardRScale = getInputVal('rsInput');

			stats['lscale'] = cardLScale;
			stats['rscale'] = cardRScale;
		}


		// form validation
		const errStr = [];
		const fields = [];
		// eslint-disable-next-line prefer-const
		for (let [stat, val] of Object.entries(stats)) {
			const notInt = isNaN(parseInt(val));
			if (notInt) {
				errStr.push(stat);
			}

			if (val === '') val = '0';
			let truStat = stat;
			const arrStat = Object.keys(stats);
			if (arrStat.length === 2 && stat === 'LVL') truStat = 'LINK';
			const field = {
				name: truStat,
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
		Helper.setDataCache({ member, cache, args: fields, step: STEP_THREE });

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