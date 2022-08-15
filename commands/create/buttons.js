const { MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton, Collection } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const Helper = require('./cache');
const { infoForm } = require('./forms/info');
const { statsForm } = require('./forms/stats');
const { stringsForm } = require('./forms/strings');
const {
	Races,
	Types,
	Attributes,
	Archetypes,
	UID_CARD_ATT,
	UID_CARD_RACE,
	UID_CARD_TYPE,
	UID_SKIP,
	UID_NEXT_STEP5,
	UID_FINISH_LINE,
	UID_PREV_PAGE,
	UID_NEXT_PAGE,
	UID_NEXT_STEP6,
	UID_ANITOM,
	UID_NEW_SET,
	UID_CLEAR,
} = require('./constants');

// start
// modal (name, peff, desc, id)
const bcStart = async interaction => {
	try {
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Creating')
			.setDescription('> Please wait...')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');
		await infoForm(interaction);
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


// step 1 => step 2
// selections (race, att, type)
const bcNext = async interaction => {

	const { cache } = interaction.client;
	const cardRec = Helper.setCardCache(cache);
	console.log('Recorded as: ', cardRec);

	const getOptions = coll => {
		const options = coll.reduce((acc, _, r) => {
			const option = {
				label: r,
				value: r,
			};

			return acc.concat(option);
		}, []);

		return options;
	};

	const raceOptions = getOptions(Races);
	const raceRow = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId(UID_CARD_RACE)
				.setPlaceholder('Zombie')
				.addOptions(raceOptions),
		);


	const typeOptions = getOptions(Types);
	const typeRow = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId(UID_CARD_TYPE)
				.setPlaceholder('Monster')
				.setMinValues(2)
				// .setMaxValues(6)
				.addOptions(typeOptions),
		);


	const attOptions = getOptions(Attributes);
	const attributeRow = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId(UID_CARD_ATT)
				.setPlaceholder('DARK')
				.setMinValues(1)
				.addOptions(attOptions),
		);

	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Select this Card\'s Stats')
		.setDescription('Please select this card\'s Race | Type | Attribute')
		.setThumbnail('https://i.imgur.com/ebtLbkK.png');

	return await interaction.update({ components: [raceRow, typeRow, attributeRow], embeds: [embed] });
};

const bcEdit = async interaction => {
	try {
		await infoForm(interaction);
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Editing Card')
			.setDescription('Please wait...')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');
		return await interaction.message.edit({ embeds: [embed], components: [] });
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};


// step 2 => step 3
// redo selections
const bcEdit2 = async interaction => {
	try {
		return await bcNext(interaction);
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};
// modal (atk, def, lvl, lscale, rscale)
const bcNext3 = async interaction => {
	try {

		const { cache } = interaction.client;
		const cardRec = Helper.setCardCache(cache);
		console.log('Recorded as: ', cardRec);

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Creating')
			.setDescription('Step 3 of 6...')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');
		await statsForm(interaction);
		return await interaction.message.edit({ embeds: [embed], components: [] });
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};


// step 3 => step 4
const bcEdit3 = async interaction => {
	try {
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Editing')
			.setDescription('Step 3 of 6...')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');
		await statsForm(interaction);
		return await interaction.message.edit({ embeds: [embed], components: [] });
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const createLinkButtons = () => {
	const tLBtn = new MessageButton()
		.setCustomId('↖️')
		.setLabel('↖️')
		.setStyle('SECONDARY');
	const tMBtn = new MessageButton()
		.setCustomId('⬆️')
		.setLabel('⬆️')
		.setStyle('SECONDARY');
	const tRBtn = new MessageButton()
		.setCustomId('↗️')
		.setLabel('↗️')
		.setStyle('SECONDARY');

	const lMBtn = new MessageButton()
		.setCustomId('⬅️')
		.setLabel('⬅️')
		.setStyle('SECONDARY');
	const mMBtn = new MessageButton()
		.setCustomId('🔵')
		.setLabel('🔵')
		.setStyle('SECONDARY')
		.setDisabled(true);
	const rMBtn = new MessageButton()
		.setCustomId('➡️')
		.setLabel('➡️')
		.setStyle('SECONDARY');

	const pLBtn = new MessageButton()
		.setCustomId('↙️')
		.setLabel('↙️')
		.setStyle('SECONDARY');
	const pMBtn = new MessageButton()
		.setCustomId('⬇️')
		.setLabel('⬇️')
		.setStyle('SECONDARY');
	const pRBtn = new MessageButton()
		.setCustomId('↘️')
		.setLabel('↘️')
		.setStyle('SECONDARY');

	return {
		top: [ tLBtn, tMBtn, tRBtn ],
		center: [ lMBtn, mMBtn, rMBtn ],
		pie: [ pLBtn, pMBtn, pRBtn ],
	};
};

const bcNext4 = async interaction => {
	try {
		const { cache } = interaction.client;
		const cardRec = Helper.setCardCache(cache);
		console.log('Recorded as: ', cardRec);

		const card = Helper.getCardCache(cache);
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
	}
	catch (error) {
		console.log(error);
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const LinkButtons = async interaction => {
	try {
		const [top, center, pie] = interaction.message.components;
		const { embeds: e } = interaction.message;
		let fields = e[0].fields;

		const { cache } = interaction.client;
		const card = Helper.getCardCache(cache);
		const { lvl } = card;

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

		const newField = s => {
			return {
				name: 'Selection',
				value: `\\${s}`,
				inline: true,
			};
		};

		const newStyle = comp => {
			const style = comp.style === 'SECONDARY' ? 'PRIMARY' : 'SECONDARY';
			return style;
		};

		const editFields = (select, style) => {
			if (style === 'PRIMARY') {
				const field = newField(select);

				fields.push(field);
			}
			else {
				const rest = fields.filter(f => f.value !== `\\${select}`);
				fields = rest;
			}
		};

		const setRowComps = row => {
			const btn = row.components[index];
			const style = newStyle(btn);
			const newBtn = btn.setStyle(style);

			row.components[index] = newBtn;

			const newComp = row.components;

			editFields(selected, style);
			row.setComponents(newComp);
		};

		const section = Buttons.section;
		setRowComps(Buttons[section].row);


		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Link Markers')
			.setDescription(`>>> Please select the link markers for this card:
			Link Rating: ${lvl}`)
			.setFields(fields)
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');

		if (fields.length === lvl) {
			const reEmbed = embed
				.setDescription(`> Please confirm the Link Markers (${lvl}) and click Next`);

			const nextBtn = new MessageButton()
				.setCustomId('step5')
				.setLabel('Next')
				.setStyle('SUCCESS');

			pie.addComponents(nextBtn);
			return await interaction.update({ embeds: [reEmbed], components: [top, center, pie] });
		}

		const { components: comp } = pie;
		if (comp.length === 4) {
			const [t, c, p] = comp;
			pie.setComponents(t, c, p);
		}
		return await interaction.update({ embeds: [embed], components: [top, center, pie] });
	}
	catch (error) {
		console.log(error);
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};


// step 4 => step 5
// or from no Link Step 3
const bcNext5 = async interaction => {
	try {
		// set page info for cache
		// object for later info?
		const { cache } = interaction.client;
		const pageInfo = Helper.getPageInfo(cache);
		const { page: pgNo, set: pageSet, preFill, wipe } = pageInfo;
		const MAX_PAGE = Math.floor((pageSet.size / 100) + 1);

		// decide what page info to use
		const getPageFromArcs = (coll = new Collection(), start_index = 0, end_index = 100) => {
			const page = new Collection();
			if (coll.keyAt(end_index)) {
				for (let i = start_index; i < end_index; i++) {
					const set = coll.keyAt(i);
					const code = coll.get(set);
					page.set(set, code);
				}

				return page;
			}

			for (let i = start_index; i < coll.size; i++) {
				const set = coll.keyAt(i);
				const code = coll.get(set);
				page.set(set, code);
			}

			return page;
		};

		const page = getPageFromArcs(pageSet, ((pgNo * 100) - 100), (pgNo * 100));
		const addToRows = p => {
			const rows = {
				1: [],
				2: [],
				3: [],
				4: [],
			};

			let count = 0;
			let i = 1;

			for (const arch of p.keys()) {
				const row = rows[i];
				rows[i] = row.concat(arch);
				count += 1;
				if (count === 25) {
					i = i + 1;
					count = 0;
				}
			}

			return rows;
		};

		// rows correspond to message action rows
		// only 5 allowed so the first 4 are select menu
		const rows = addToRows(page);

		const getOptions = coll => {
			const options = coll.reduce((acc, i) => {
				const option = {
					label: i,
					value: i,
				};

				return acc.concat(option);
			}, []);

			return options;
		};

		const getMessageRow = row_no => {
			const rOptions = getOptions(rows[row_no]);
			const lastIndex = !rOptions.length === true ? 'Archetype' : rOptions.at(-1).label;
			const row = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
						.setCustomId(`row${row_no}`)
						.setPlaceholder(lastIndex)
						.addOptions(rOptions),
				);


			return row;
		};

		const row1 = getMessageRow(1);
		const row2 = getMessageRow(2);
		const row3 = getMessageRow(3);
		const row4 = getMessageRow(4);

		// last row
		const prev = new MessageButton()
			.setCustomId(UID_PREV_PAGE)
			.setLabel('PREV PG')
			.setDisabled(pgNo === 1 ? true : false)
			.setStyle('SECONDARY');
		const next = new MessageButton()
			.setCustomId(UID_NEXT_PAGE)
			.setLabel('NEXT PG')
			.setDisabled(pgNo === MAX_PAGE ? true : false)
			.setStyle('SECONDARY');

		// Next
		const nextStep = new MessageButton()
			.setCustomId(UID_NEXT_STEP6)
			.setLabel('Next Step')
			.setStyle('PRIMARY');

		// customs & anime page
		const animtom = new MessageButton()
			.setCustomId(UID_ANITOM)
			.setLabel('Anime/Custom')
			.setDisabled(true)
			.setStyle('PRIMARY');

		// clear
		const clear = new MessageButton()
			.setCustomId(UID_CLEAR)
			.setLabel('Clear')
			.setDisabled(false)
			.setStyle('DANGER');
		const row5 = new MessageActionRow().addComponents(prev, next, nextStep, animtom, clear);

		// if any row is empty
		// lack of entries
		// skip them || error
		const comp = [];
		const mapper = new Collection([[1, row1], [2, row2], [3, row3], [4, row4]]);

		for (const [index, row] of mapper.entries()) {
			if (rows[index].length > 0) comp.push(row);
		}

		// displays first option and last option
		const { components: menu_a } = mapper.get(1);
		const { components: menu_z } = mapper.get(comp.length);

		const { options: op_a } = menu_a[0];
		const { options: op_z } = menu_z[0];

		const sectionA = op_a[0].value;
		const sectionZ = op_z.at(-1).value;

		const embedMsg = `>>> Select the Archetype(s) for this card:
		
		If you do not find the archetype, select the next page
		
		Archetypes on this page: **${sectionA}** - **${sectionZ}**`;


		// pre archs populate
		const { embeds } = interaction.message;
		const { fields: eFields } = embeds[0];
		const isOldFields = eFields.length > 0 && eFields[0].name != 'Selection';
		// if has fields from last step
		// in state of wiping the fields
		console.log('page info[wipe]: ', wipe);
		const fields = isOldFields ? (!wipe ? eFields : []) : [];
		if (wipe) pageInfo.wipe = false;
		console.log('on falsify = page info[wipe]: ', wipe);

		const card = Helper.getCardCache(cache);
		if (card && !preFill) {
			const { name } = card;
			const strfy = val => {
				return `Dec: ${val}
		Hex: ${parseInt(val).toString(16)}`;
			};

			for (const [set, code] of pageSet.entries()) {
				if (name.includes(set)) {
					const f = new Object();
					f.name = set;
					f.value = strfy(code);
					f.inline = true;

					fields.push(f);
				}
			}

			pageInfo.preFill = true;
		}

		// msg update
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Archetype')
			.setDescription(embedMsg)
			.setThumbnail('https://i.imgur.com/ebtLbkK.png')
			.setFields(fields)
			.setFooter({
				'text': `Archetypes Page: ${pgNo}`,
				'iconURL': 'https://i.imgur.com/ebtLbkK.png',
			});

		return await interaction.update({ embeds: [embed], components: [...comp, row5] });
	}
	catch (error) {
		console.log(error);
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const nextPage = async interaction => {
	try {
		const { cache } = interaction.client;
		const pageInfo = Helper.getPageInfo(cache);
		const { page: pgNo } = pageInfo;

		pageInfo.pageOf = pgNo + 1;

		return await bcNext5(interaction);
	}
	catch (error) {
		console.log(error);
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const prevPage = async interaction => {
	try {
		const { cache } = interaction.client;
		const pageInfo = Helper.getPageInfo(cache);
		const { page: pgNo } = pageInfo;

		pageInfo.pageOf = pgNo - 1;

		return await bcNext5(interaction);
	}
	catch (error) {
		console.log(error);
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const clearFields = async interaction => {
	try {
		const { cache } = interaction.client;
		const pageInfo = Helper.getPageInfo(cache);

		pageInfo.wipe = true;

		return await bcNext5(interaction);
	}
	catch (error) {
		console.log(error);
		return await interaction.reply({ content: 'There was an error clearing the fields.', ephemeral: true });
	}
};

// step 6
// strings modals ()
const bcNext6 = async interaction => {
	try {
		const { cache } = interaction.client;
		const { embeds } = interaction.message;
		const { fields } = embeds[0];
		const data = Helper.setDataCache(cache, fields, 5);
		console.log('data entered: ', data);

		const cardRec = Helper.setCardCache(cache);
		console.log('Recorded as: ', cardRec);


		// finish the app
		const skip = new MessageButton()
			.setCustomId(UID_FINISH_LINE)
			.setLabel('Skip')
			.setStyle('PRIMARY');

		// strings no to add
		const one = new MessageButton()
			.setCustomId('add one')
			.setLabel('1')
			.setStyle('PRIMARY');
		const two = new MessageButton()
			.setCustomId('add two')
			.setLabel('2')
			.setStyle('PRIMARY');
		const three = new MessageButton()
			.setCustomId('add three')
			.setLabel('3')
			.setStyle('PRIMARY');
		const four = new MessageButton()
			.setCustomId('add four')
			.setLabel('4')
			.setStyle('PRIMARY');
		const five = new MessageButton()
			.setCustomId('add five')
			.setLabel('5')
			.setStyle('PRIMARY');

		// msg update
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Strings')
			.setDescription(`>>> [Scripting]
		Description messages used in YGOPro.
		Suggestions: 'Destroy', 'Draw', 'Facedown'

		**Skip to complete the process or choose the number of strings you want to add**
		
		**Next Steps:**`)
			.setThumbnail('https://i.imgur.com/ebtLbkK.png')
			.setFooter({
				'text': '<- Complete  |  Strings to add (max 16) ->',
			});

		const skipRow = new MessageActionRow().addComponents(skip);
		const strRow = new MessageActionRow().addComponents(one, two, three, four, five);
		return await interaction.update({ embeds: [embed], components: [skipRow, strRow] });
	}
	catch (error) {
		console.log(error);
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const Strings = async interaction => {
	try {
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Strings')
			.setDescription('>>> **Adding in strings...**')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');

		await stringsForm(interaction);
		return await interaction.message.edit({ embeds: [embed], components: [] });
	}
	catch (error) {
		console.log(error);
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const bcFinish = async interaction => {
	try {
		const { cache } = interaction.client;
		const card = Helper.getCardCache(cache);
		if (!card) throw new Error('No Card Cache data found!');

		const {
			id,
			name,
			type: types,
			attribute: att,
			lvl,
			race,
			atk,
			def,
			setcode,
		} = card;

		const descFormat = c => {
			let str = '';
			const template = {
				pendulum: (pend, des) => {
					return `[Pendulum Effect]
				${pend}
				----------------------------------------
				[Card Text]
				${des}`;
				},
				regular: des => {
					return des;
				},
			};

			const { cardPEff, cardDesc } = c.temp;
			if (cardPEff) {str = template.pendulum(cardPEff, cardDesc);}
			else { str = template.regular(cardDesc); }
			return str;
		};

		// extract lvl and scales
		const extractLVLScales = val => {
			let truLvl = 0;
			const hex = parseInt(val).toString(16);
			truLvl = parseInt(hex.slice(-1), 16);
			const lscale = parseInt(hex.at(0), 16);
			const rscale = parseInt(hex.at(2), 16);
			return {
				level: truLvl,
				pendulum: {
					lscale,
					rscale,
				},
			};
		};


		// Desc
		const desc = descFormat(card);
		// Type
		const tcoll = Types.reverse();
		const tStr = tcoll.reduce((acc, v, t) => {
			if ((types & v).toString(16) != 0) {
				return acc.concat(t + ' ');
			}
			return acc;
		}, '').replace(/\s\b/g, ' / ');
		// Attribute
		const attStr = Attributes.findKey(v => v === att);
		// Race
		const raceStr = Races.findKey(v => v === race);
		// Rating/Rank/Level
		let lvlType = tStr.includes('Xyz') ? 'Rank' : 'Level';
		lvlType = tStr.includes('Link') ? 'LINK' : lvlType;
		// Level
		let lvlActual = lvl;
		let lscale = null;
		let rscale = null;
		if (card.temp.isPendy) {
			const { level, pendulum: pendy } = extractLVLScales(lvl);
			lvlActual = level;
			lscale = pendy.lscale;
			rscale = pendy.rscale;
		}
		// Archetypes
		let arcsStr = '';
		if (setcode) {
			const arc = Archetypes.findKey(v => v === setcode);
			if (arc) arcsStr = arc;
		}
		// Pendulum
		const pendyInfo = `**Left Scale**: ${lscale} | **Right Scale**: ${rscale}`;
		// Extra Info
		let placeholder = '';
		if (rscale) placeholder += `${pendyInfo}` + '\n';
		if (arcsStr) placeholder += `**Archetypes**: ${arcsStr}` + '\n';

		const systemEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Complete')
			.setDescription(`>>> Thank you!
			Your card has been added to the Library:`)
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');
		const resultEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setDescription(`>>> 
			**${name}**
			**Type**: ${tStr}
			**Attribute** ${attStr} | **${lvlType}**: ${lvlActual} | **Race**: ${raceStr}
			**ATK** ${atk} **DEF** ${def}
			${placeholder}
			${desc}
			**${id}**`)
			.setThumbnail('https://i.imgur.com/PSlH5Nl.png');
		return await interaction.message.edit({ embeds: [systemEmbed, resultEmbed], components: [] });
	}
	catch (error) {
		console.log(error);
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

module.exports = {
	bcStart,
	bcHalt,
	bcEdit,
	bcNext,
	bcEdit2,
	bcNext3,
	bcEdit3,
	bcNext4,
	bcNext5,
	bcNext6,
	nextPage,
	prevPage,
	clearFields,
	bcFinish,
	Strings,
	LinkButtons,
};