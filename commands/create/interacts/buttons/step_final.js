const { MessageEmbed } = require('discord.js');
const Helper = require('../../utils/cache');
const { addCardToBase } = require('../../../../data/models');
const { Archetypes, Races, Types, Attributes, BOT_IMG_URL } = require('../../utils/constants');

const bcFinish = async interaction => {
	const { cache } = interaction.client;
	const { member } = interaction;
	const card = Helper.getCardCache(cache, member);
	if (!card) throw new Error('No Card Cache data found!');

	const {
		id,
		name,
		type: types,
		attribute: att,
		level,
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
[${tStr.includes('normal') ? 'Flavor Text' : 'Monster Effect'}]
${des}`;
			},
			regular: des => des,
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
	let lvlActual = level;
	let lscale = null;
	let rscale = null;
	if (card.temp.isPendy) {
		const { level: lvl, pendulum: pendy } = extractLVLScales(level);
		lvlActual = lvl;
		lscale = pendy.lscale;
		rscale = pendy.rscale;
	}
	// Archetypes
	// todo: multi archetypes
	let arcsStr = '';
	if (setcode) {
		const arc = Archetypes.findKey(v => v === setcode);
		if (arc) arcsStr = arc;
	}
	// Desc
	const desc = descFormat(card);
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
		.setThumbnail(BOT_IMG_URL);
	const resultEmbed = new MessageEmbed()
		.setColor('#0099ff')
		.setDescription(`>>> 
			**${name}**
			**Type**: ${tStr}
			**Attribute** ${attStr} | **${lvlType}**: ${lvlActual} | **Race**: ${raceStr}
			**ATK** ${atk} ${card.temp.isLink ? '' : `**DEF** ${def}`}
			${placeholder}
			${desc}
			**${id}**`)
		.setThumbnail('https://i.imgur.com/PSlH5Nl.png');

	// db enter && clear cache
	const memInfo = Helper.getMemberInfo(cache, member);
	// eslint-disable-next-line no-unused-vars
	const { temp, ...rest } = card;
	const { name: memName, avatar } = memInfo;
	const { server } = memInfo.appInfo;

	const payday = {
		card: { ...rest, desc },
		member: { id: member.id, name: memName, avatar },
		server,
	};

	const dbCard = await addCardToBase(payday);
	console.log('card added to db', dbCard);
	if (dbCard)	Helper.clearCardCache(cache, member);
	// reply
	return await interaction.message.edit({ embeds: [systemEmbed, resultEmbed], components: [] });
};

module.exports = { bcFinish };