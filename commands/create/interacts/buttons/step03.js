// eslint-disable-next-line no-unused-vars
const { MessageEmbed, MessageButton, MessageActionRow, MessageComponentInteraction, ButtonInteraction } = require('discord.js')
const Form = require('../../forms');
const Helper = require('../../cache');
const Utils = require('../../utils');
const { UID_NEXT_STEP5, UID_SKIP, BOT_IMG_URL } = require('../../constants');


// step 3 => step 4
/**
 *
 * @param {MessageComponentInteraction} interaction
 * @returns {Promise<Message>|Promise<void>}
 */
const bcEdit3 = async interaction => {
	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Editing')
		.setDescription('Step 3 of 6...')
		.setThumbnail('https://i.imgur.com/ebtLbkK.png');
	await Form.stats(interaction);
	return await interaction.message.edit({ embeds: [embed], components: [], files: [] });
};

/**
 * @typedef {Object} LinkButtonObject
 * @property {MessageButton[]} top
 * @property {MessageButton[]} center
 * @property {MessageButton[]} pie
 */

/**
 * @returns {LinkButtonObject}
 */
const createLinkButtons = () => {
	const arrows = ['↖️', '⬆️', '↗️', '⬅️', '🔵', '➡️', '↙️', '⬇️', '↘️'];

	const buttons = arrows.reduce((acc, arrow) => {
		const newButton = new MessageButton()
			.setCustomId(arrow)
			.setLabel(arrow)
			.setStyle('SECONDARY');

		return acc.concat(newButton);
	}, []);

	const top = buttons.slice(0, 3);
	const center = buttons.slice(3, 6);
	const pie = buttons.slice(6, 9);

	return { top, center, pie };
};

/**
 * Cross road for either Link Arrows OR
 * skip to the archetypes step 04
 * @param {ButtonInteraction} interaction
 * @returns {Promise<void>}
 */
const bcNext4 = async interaction => {
	const { client, member } = interaction;
	const { cache } = client;
	Utils.RegisterCacheCard(cache, member);

	const card = Helper.getCardCache(cache, member);
	if (card && card.temp.isLink) {
		// If Link
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Link Markers')
			.setDescription('Please select the link markers for this card:')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');

		const { top: t, center: c, pie: p } = createLinkButtons();
		const topRow = new MessageActionRow().addComponents(t);
		const midRow = new MessageActionRow().addComponents(c);
		const pieRow = new MessageActionRow().addComponents(p);
		return await interaction.update({ embeds: [embed], components: [topRow, midRow, pieRow] });
	}

	// Skip to Archetype
	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Archetype')
		.setDescription(`>>> Does this card belong to an Archetype(s)?
	
	** Skip to Strings or Archetype Selection(s) **
	** Next Steps: **`)
		.setThumbnail('https://i.imgur.com/ebtLbkK.png')
		.setFooter({
			'text': '<- to Strings  |  to Archetype Select ->',
		});

	const none = new MessageButton()
		.setCustomId(UID_SKIP)
		.setLabel('Skip')
		.setStyle('PRIMARY');
	const hero = new MessageButton()
		.setCustomId(UID_NEXT_STEP5)
		.setLabel('Continue')
		.setStyle('PRIMARY');
	const row = new MessageActionRow().addComponents(none, hero);
	return await interaction.update({ embeds: [embed], components: [row] });
};

/**
 * @param {ButtonInteraction} interaction
 * @returns {Promise<void>}
 */
const LinkButtons = async interaction => {
	const { message, client, member } = interaction;
	const [top, center, pie] = message.components;
	const { embeds: e } = message;
	let fields = e[0].fields;

	const { cache } = client;
	const card = Helper.getCardCache(cache, member);
	const { level } = card;

	const Buttons = {
		// component's index
		index: 0,
		// section of the object
		section: '',
		// id[selected] = this.index
		top: {
			ids: {
				'↖️': 0,
				'⬆️': 1,
				'↗️': 2,
			},
			get row() {return top;},
		},
		center: {
			ids: {
				'⬅️': 0,
				'🔵': 1,
				'➡️': 2,
			},
			get row() {return center;},
		},
		pie: {
			ids: {
				'↙️': 0,
				'⬇️': 1,
				'↘️': 2,
			},
			get row() {return pie;},
		},
		get array() {
			const r1 = Object.keys(this.top.ids);
			const r2 = Object.keys(this.center.ids);
			const r3 = Object.keys(this.pie.ids);
			return [...r1, ...r2, ...r3];
		},
		/**
			* @param {number} selected
			*/
		set indexOf(selected) {
			const sections = Object.keys(this).filter(k => typeof this[k] === 'object');
			for (const section of sections) {
				if (section === 'array') continue;
				const { ids } = this[section];
				if (selected in ids) {
					this.index = ids[selected];
					this.section = section;
				}
			}
		},
	};

	const buttons = Buttons.array;
	const [selected] = buttons.filter(btn => interaction.customId === btn);
	Buttons.indexOf = selected;
	const index = Buttons.index;

	const newStyle = comp => comp.style === 'SECONDARY' ? 'PRIMARY' : 'SECONDARY';

	/**
		 * @param {string} select
		 * @param {string} style
		 */
	const editFields = (select, style) => {
		if (style === 'PRIMARY') {
			const field = {
				name: 'Selection',
				value: `\\${select}`,
				inline: true,
			};

			fields.push(field);
		}
		else {
			const rest = fields.filter(f => f.value !== `\\${select}`);
			fields = rest;
		}
	};

	/**
	* @param {MessageActionRow} row
	*/
	const setRowComps = row => {
		// gets selected button
		const btn = row.components[index];
		// gets style active or not
		const style = newStyle(btn);
		const newBtn = btn.setStyle(style);
		// update selected button
		row.components[index] = newBtn;
		// get action row array
		const newComp = row.components;
		// toggle fields more like it
		editFields(selected, style);
		row.setComponents(newComp);
	};

	const section = Buttons.section;
	setRowComps(Buttons[section].row);


	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Link Markers')
		.setDescription(`>>> Please select the link markers for this card:
			Link Rating: ${level}`)
		.setFields(fields)
		.setFooter({
			text: member.nickname ?? member.user.username,
			iconURL: member.user.displayAvatarURL({ dynamic: true }) ?? BOT_IMG_URL,
		})
		.setThumbnail(BOT_IMG_URL);

	// exit recursion
	// link number matches up
	// with the 'selected' buttons
	if (fields.length === level) {
		const reEmbed = embed
			.setDescription(`> Please confirm the Link Markers (${level}) and click Next`);

		const nextBtn = new MessageButton()
			.setCustomId(UID_NEXT_STEP5)
			.setLabel('Next')
			.setStyle('SUCCESS');

		pie.addComponents(nextBtn);
		return await interaction.update({ embeds: [reEmbed], components: [top, center, pie] });
	}

	// if you're adjusting buttons
	// drop the 'next' button
	const { components: comp } = pie;
	if (comp.length === 4) {
		const [t, c, p] = comp;
		pie.setComponents(t, c, p);
	}

	return await interaction.update({ embeds: [embed], components: [top, center, pie] });
};

module.exports = { bcEdit3, bcNext4, LinkButtons };