const { MessageEmbed, Collection, MessageActionRow, MessageSelectMenu, MessageButton, ButtonInteraction,  } = require('discord.js');
const { UID_ANIME, UID_CLEAR, UID_NEXT_PAGE, UID_NEXT_STEP6, UID_PREV_PAGE } = require('../../constants');
const Helper = require('../../cache');

// step 4 => step 5
// or from no Link Step 3
/**
 * @param {ButtonInteraction} interaction
 * @returns {Promise<void>}
 */
const bcNext5 = async interaction => {
	// set page info for cache
	// object for later info?
	const { client, message, member } = interaction;
	const { cache } = client;
	const { embeds } = message;
	const { fields: eFields } = embeds[0];

	// register link info (if any)
	// gotta put this here for now
	const card = Helper.getCardCache(cache, member);
	if (card.temp.isLink && eFields > 0) {
		Helper.setDataCache({ member, cache, args: eFields, step: 4 });
		Helper.setCardCache(cache, member);
	}

	const pageInfo = Helper.getPageInfo(cache, member);
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

	const [row1, row2, row3, row4] = [1, 2, 3, 4].reduce((acc, n) => {
		const row = getMessageRow(n);
		return acc.concat(row);
	}, []);

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
	const anime = new MessageButton()
		.setCustomId(UID_ANIME)
		.setLabel('Anime/Custom')
		.setDisabled(true)
		.setStyle('PRIMARY');

	// clear
	const clear = new MessageButton()
		.setCustomId(UID_CLEAR)
		.setLabel('Clear')
		.setDisabled(false)
		.setStyle('DANGER');
	const row5 = new MessageActionRow().addComponents(prev, next, nextStep, anime, clear);

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
	const isOldFields = eFields.length > 0 && eFields[0].name != 'Selection';
	// if has fields from last step
	// in state of wiping the fields
	const fields = isOldFields ?
		(!wipe ? eFields : [])
		:
		[];
	if (wipe) pageInfo.wipe = false;

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
};

const nextPage = async interaction => {
	const { cache } = interaction.client;
	const { member } = interaction;
	const pageInfo = Helper.getPageInfo(cache, member);
	const { page: pgNo } = pageInfo;

	pageInfo.pageOf = pgNo + 1;
	return await bcNext5(interaction);
};

const prevPage = async interaction => {
	const { cache } = interaction.client;
	const { member } = interaction;
	const pageInfo = Helper.getPageInfo(cache, member);
	const { page: pgNo } = pageInfo;

	pageInfo.pageOf = pgNo - 1;

	return await bcNext5(interaction);
};

const clearFields = async interaction => {
	const { cache } = interaction.client;
	const { member } = interaction;
	const pageInfo = Helper.getPageInfo(cache, member);

	pageInfo.wipe = true;

	return await bcNext5(interaction);
};

module.exports = { bcNext5, nextPage, prevPage, clearFields };