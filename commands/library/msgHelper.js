const Cards = require('../../data/models');
const Cache = require('./cache');
const { MessageButton, MessageActionRow } = require('discord.js');
const { Archetypes, Types, Races, Attributes } = require('../../commands/create/constants');


const setPageInfo = cacheObject => {
	const { cache, member, cards } = cacheObject;

	const memInfo = Cache.getMemberInfo(cache, member);
	const { page } = memInfo;

	if (memInfo && page !== 1) {
		const end = page * 10;
		const start = end - 10;
		const pageCards = cards.slice(start, end);
		const paged = pageCards.reduce((acc, card) => {
			const { id, name } = card;

			return acc.concat({ id, name });
		}, []);
		memInfo.pageInfo = paged;
	}
	else {
		const fpage = cards.slice(0, 10);
		const paged = fpage.reduce((acc, card) => {
			const { id, name } = card;

			return acc.concat({ id, name });
		}, []);
		memInfo.pageInfo = paged;
	}
};

const getEmbedMsg = async cacheObject => {
	const { cache, member } = cacheObject;

	const cards = await Cards.getAllCards();
	const servers = await Cards.getAllServers();

	const cardCount = cards.length;
	const servCount = servers.length;
	const maxPage = Math.ceil(cards.length / 10);

	const memInfo = Cache.getMemberInfo(cache, member);
	const { select } = memInfo;

	const extraS = count => count > 1 ? 's' : '';
	const msg = `I have a total of ${cardCount} card${extraS(cardCount)} in ${servCount} server${extraS(servCount)}.`;

	const descStrings = memInfo.pageInfo.reduce((acc, card) => {
		const stringAs = `[${card.id}] - ${card.name} `;
		return acc.concat(stringAs);
	}, []);

	const desc = descStrings.reduce((acc, str, i) => {
		let format = `[${i + 1}] | ` + str;
		if (i === select) {
			format = `**${format}**`;
		}

		return acc + `${format} \n`;
	}, '');

	return { maxPage,
		msg: '>>> ' + msg + '\n\n' + desc,
	};
};

const getCardDesc = card => {
	const {
		id,
		desc,
		type: types,
		attribute: att,
		level,
		race,
		atk,
		def,
		setcode,
	} = card;


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

	// Type
	const tcoll = Types.reverse();
	const tStr = tcoll.reduce((acc, v, t) => {
		if ((types & v).toString(16) != 0) {
			return acc.concat(t + ' ');
		}
		return acc;
	}, '').replace(/\s\b/g, ' / ');

	const isType = type => {
		return tStr.includes(type);
	};
	// Attribute
	const attStr = Attributes.findKey(v => v === att);
	// Race
	const raceStr = Races.findKey(v => v === race);
	// Rating/Rank/Level
	let lvlType = isType('Xyz') ? 'Rank' : 'Level';
	lvlType = isType('Link') ? 'LINK' : lvlType;
	// Level
	let lvlActual = level;
	let lscale = null;
	let rscale = null;
	if (isType('Pendulum')) {
		const { level: lvl, pendulum: pendy } = extractLVLScales(level);
		lvlActual = lvl;
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

	return `>>> **Type**: ${tStr}
        **Attribute** ${attStr} | **${lvlType}**: ${lvlActual} | **Race**: ${raceStr}
        **ATK** ${atk} ${isType('Link') ? '' : `**DEF** ${def}`}
        ${placeholder}
        ${desc}
        **${id}**`;
};

const getButtonRows = count => {
	const array = new Array(count);
	for (const index of array.keys()) {
		array[index] = new MessageButton()
			.setCustomId(`card ${index}`)
			.setLabel(`${ 1 + index }`)
			.setStyle('SECONDARY');
	}

	const top = array.slice(0, 5);
	const sec = array.slice(5);
	const row1 = new MessageActionRow().addComponents(top);
	const row2 = new MessageActionRow().addComponents(sec);

	const rows = !sec.length ? [row1] : [row1, row2];
	return rows;
};

module.exports = {
	getCardDesc,
	setPageInfo,
	getEmbedMsg,
	getButtonRows,
};
