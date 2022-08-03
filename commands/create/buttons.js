const { MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton, Collection } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const Helper = require('./cache');
const { infoForm } = require('./forms/info');
const { statsForm } = require('./forms/stats');
const { Races, Types, Attributes, Archetypes } = require('./constants');

const { UID_CARD_ATT, UID_CARD_RACE, UID_CARD_TYPE } = require('./constants');

// start
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
const bcEdit2 = async interaction => {
	try {
		return await bcNext(interaction);
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

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


	**Next Steps:**`)
			.setThumbnail('https://i.imgur.com/ebtLbkK.png')
			.setFooter({
				'text': '<- to Strings  |  to Archetype Select ->',
			});

		const none = new MessageButton()
			.setCustomId('no setcard')
			.setLabel('Skip')
			.setStyle('PRIMARY');
		const hero = new MessageButton()
			.setCustomId('step5')
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
			index: 0,
			section: '',
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
// or from Link Step 3
const bcNext5 = async interaction => {
	// set page info for cache
	// object for later info?
	const { cache } = interaction.client;
	if (!cache.has('page info')) {
		cache.set('page info', { page: 1 });
	}

	try {
		const pageInfo = cache.get('page info');
		const { page: pgNo } = pageInfo;

		// decide what page info to use
		const map = new Collection([
			[1, 'pg_one'],
			[2, 'pg_two'],
			[3, 'pg_three'],
			[4, 'pg_four'],
			[5, 'pg_five'],
			[6, 'pg_six'],
		]);

		const slice = map.get(pgNo);
		const page = Archetypes.get(slice);

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
			.setCustomId('prev page')
			.setLabel('PREV PG')
			.setDisabled(pgNo === 1 ? true : false)
			.setStyle('SECONDARY');
		const next = new MessageButton()
			.setCustomId('next page')
			.setLabel('NEXT PG')
			.setDisabled(pgNo === 6 ? true : false)
			.setStyle('SECONDARY');

		// Next
		const nextStep = new MessageButton()
			.setCustomId('step6')
			.setLabel('Next Step')
			.setDisabled(true)
			.setStyle('PRIMARY');

		// customs & anime page
		const animtom = new MessageButton()
			.setCustomId('anitom')
			.setLabel('Anime/Custom')
			.setDisabled(true)
			.setStyle('PRIMARY');

		// new archetype
		const newArch = new MessageButton()
			.setCustomId('new arch')
			.setLabel('New Archetype')
			.setDisabled(false)
			.setStyle('SUCCESS');
		const row5 = new MessageActionRow().addComponents(prev, next, nextStep, animtom, newArch);

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

		// msg update
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Archetype')
			.setDescription(embedMsg)
			.setThumbnail('https://i.imgur.com/ebtLbkK.png')
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
		const { page: pgNo } = cache.get('page info');

		cache.set('page info', { page: pgNo + 1 });
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
		const { page: pgNo } = cache.get('page info');

		cache.set('page info', { page: pgNo - 1 });
		return await bcNext5(interaction);
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
	nextPage,
	prevPage,
	LinkButtons,
};