const Cards = require('../../data/models');
const Cache = require('./cache');
const CardsEx = require('../../data/cards/extraModels');

const path = require('node:path');
const fs = require('node:fs/promises');
const { constants } = require('node:fs');
const wait = require('node:timers/promises').setTimeout;

const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { Archetypes, Types, Races, Attributes } = require('../../commands/create/constants');


// view cards
const setPageInfo = cacheObject => {
	const { cache, member, cards } = cacheObject;

	const memInfo = Cache.getMemberInfo(cache, member);
	memInfo.pageInfo.cards = cards;

	const { page } = memInfo;

	if (memInfo && page !== 1) {
		const end = page * 10;
		const start = end - 10;
		const pageCards = cards.slice(start, end);
		const paged = pageCards.reduce((acc, card) => {
			const { id, name } = card;

			return acc.concat({ id, name });
		}, []);
		memInfo.pageInfo.slice = paged;
	}
	else {

		const fpage = cards.slice(0, 10);
		const paged = fpage.reduce((acc, card) => {
			const { id, name } = card;

			return acc.concat({ id, name });
		}, []);
		memInfo.pageInfo.slice = paged;
	}
};

const getEmbedMsg = async cacheObject => {
	const { cache, member, cards: nextCards } = cacheObject;

	// eslint-disable-next-line no-inline-comments
	const cards = nextCards ?? []; // await Cards.getAllCards();
	const servers = await Cards.getAllServers();
	const servCount = servers.length;
	const cardCount = cards.length;
	const math = Math.ceil(cards.length / 10);
	const maxPage = math === 0 ? 1 : math;
	const memInfo = Cache.getMemberInfo(cache, member);
	const { select } = memInfo;

	const extraS = count => count > 1 ? 's' : '';
	const msg = `I have a total of ${cardCount} card${extraS(cardCount)} in ${servCount} server${extraS(servCount)}.`;

	const descStrings = memInfo.pageInfo.slice.reduce((acc, card) => {
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

const ViewCards = async args => {
	const { member, client, user, options } = args;
	const userOp = options?.user;

	const allC = await (async () => {
		const allCards = await Cards.getAllCards();
		const trim = allCards.reduce((acc, card) => {
			const { id, name } = card;

			return acc.concat({ id, name });
		}, []);

		return trim;
	})();

	const memC = await (async () => {
		// get cards for specific member
		if (!userOp) return undefined;
		const { id: memberID } = userOp;
		const memCards = await Cards.getMemCards(memberID);

		// trim mem cards down
		const trim = memCards.reduce((acc, card) => {
			const { id, name } = card;

			return acc.concat({ id, name });
		}, []);

		return trim;
	})();

	// all or member's cards above
	const cards = memC && memC.length ? memC : allC;


	const { cache } = client;
	setPageInfo({ cache, member, cards });

	const memInfo = Cache.getMemberInfo(cache, member);

	// check no cards in db
	if (cards.length >= 1) {
		try {
			const { msg, maxPage } = await getEmbedMsg({ cache, member, cards });
			const url = user.displayAvatarURL();
			const username = userOp?.username;
			const headsUp = `**${username}** does not have any cards index within the Library\n\n`;

			const cardsEmbed = new MessageEmbed()
				.setColor('#7ec460')
				.setTitle('Library')
				.setDescription(`${userOp && memC.length === 0 ? headsUp : '' } ${msg}`)
				.setThumbnail('https://i.imgur.com/ebtLbkK.png')
				.setFooter({ text: `Page 1 of ${maxPage}`, iconURL: url });

			const prevPage = new MessageButton()
				.setCustomId('lib prev page')
				.setLabel('<<')
				.setDisabled(true)
				.setStyle('PRIMARY');
			const nextPage = new MessageButton()
				.setCustomId('lib next page')
				.setLabel('>>')
				.setDisabled(maxPage === 1 ? true : false)
				.setStyle('PRIMARY');
			const exportCards = new MessageButton()
				.setCustomId('export cards')
				.setLabel('Export')
				.setDisabled(true)
				.setStyle('SUCCESS');

			const row = new MessageActionRow().addComponents(prevPage, nextPage, exportCards);
			const srows = getButtonRows(memInfo.pageInfo.slice.length);

			return { embeds: [cardsEmbed], components: [row, ...srows] };
		}
		catch (err) {
			return { error: { content: 'Something went wrong.' } };
		}
	}
	else {
		const msg = 'I\'m  afraid I don\'t have any cards ';
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Library')
			.setDescription(msg)
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');

		return { error: { embeds: [embed] } };
	}
};


// export cards
const defaultConfig = member => {
	const str = `const knex = require('knex');

module.exports = knex({
	client: 'better-sqlite3',
	useNullAsDefault: true,
	migrations: { directory: './data/cards/migrations' },
	connection: {
		filename: './data/cards/${member}/cards.cdb',
	},
});`;
	return str;
};

const makeDir = async p => {
	try {
		// check directory
		await fs.access(p, constants.F_OK);
	}
	catch {
		// make directory
		await fs.mkdir(p);
	}
};

const makeConfig = async (p, member) => {
	try {
		// check db config file
		await fs.access(p, constants.F_OK);
	}
	catch {
		// make db config file
		await fs.writeFile(p, defaultConfig(member));
	}
};

const errorHandler = async (interaction, error) => {
	const msg = {};
	for (const prop in error) {
		msg[prop] = error[prop];
	}

	await interaction.reply(msg);
	await wait(4000);
	return interaction.deleteReply();
};

const ExportCards = async args => {
	const { member: memC, options } = args;
	// Export cards to database
	// Creates new dir for new members
	const { user: userOp } = options;
	console.log(userOp);
	const member = userOp ? userOp.username : memC.displayName;

	try {
		// make/check dir
		const dirPath = path.join(__dirname, `../../data/cards/${member}`);
		await makeDir(dirPath);

		// make/check config file
		const fileDir = path.join(dirPath, 'cdbConfig.js');
		await makeConfig(fileDir, member);

		// connect and migrate new db
		await wait(1000);
		const dbNew = await require(`../../data/cards/${member}/cdbConfig`);
		await dbNew.migrate.latest();

		const { id: memberId } = userOp ? userOp : memC;
		const cards = await Cards.getMemCards(memberId);
		cards.forEach(async card => {
			const oldCard = await CardsEx.checkCard({
				db: dbNew,
				id: card.id,
				newCard: card,
			});
			if (!oldCard) await CardsEx.addCard(dbNew, card);
		});

		const dbFile = path.join(dirPath, 'cards.cdb');

		return {
			components: [],
			embeds: [],
			files: [{
				attachment: dbFile,
				name: `${member}.cdb`,
				description: `${member}'s card database.`,
			}],
		};
	}
	catch (err) {
		return ({ components: [], embeds: [], error: { content: 'there was a failure.' } });
	}
};

// next pages
const updateControlRow = (row, p, maxP) => {
	const { components: buttons } = row;
	for (const button of buttons) {
		const { label } = button;
		if (label === '>>') button.setDisabled(p === maxP ? true : false);
		if (label === '<<') button.setDisabled(p === 1 ? true : false);
	}
	// 3 default buttons
	// removes modify/delete
	buttons.length = 3;
};

const updateEmbedMsg = async interaction => {
	const { member, message, client, user } = interaction;
	const { cache } = client;

	const memInfo = Cache.getMemberInfo(cache, member);
	const { pageInfo } = memInfo;

	const { page } = memInfo;
	const cards = pageInfo &&
		pageInfo.cards ? pageInfo.cards :
		await Cards.getAllCards();

	setPageInfo({ cache, member, cards });

	const { maxPage, msg } = await getEmbedMsg({ cache, member, cards });
	const url = user.displayAvatarURL();

	const cardsEmbed = new MessageEmbed()
		.setColor('#7ec460')
		.setTitle('Library')
		.setDescription(msg)
		.setThumbnail('https://i.imgur.com/ebtLbkK.png')
		.setFooter({ text: `Page ${page} of ${maxPage}`, iconURL: url });

	const cardCount = memInfo.pageInfo.slice.length;
	const srows = getButtonRows(cardCount);

	const { components: comp } = message;
	const controlRow = comp[0];

	updateControlRow(controlRow, page, maxPage);

	return await interaction.update({ embeds: [cardsEmbed], components: [controlRow, ...srows] });

};

const defaultError = async interaction => {
	const embed = new MessageEmbed()
		.setColor('#dd0f0f')
		.setTitle('Library')
		.setDescription('There was an error executing this.\nPlease try the command again.')
		.setThumbnail('https://i.imgur.com/ebtLbkK.png');

	await interaction.update({ embeds: [embed], components: [] });
	await wait(4000);
	return await interaction.deleteReply();
};

const showDetails = async interaction => {
	const { member, message, client, user, customId } = interaction;
	const { embeds } = message;
	const { cache } = client;

	const memInfo = Cache.getMemberInfo(cache, member);
	const { page, pageInfo, cardInfo } = memInfo;

	// checks if cards
	// checks if mismatch card count in embed
	const { cards } = pageInfo;
	const con = embeds[0].description.match(/\d{1,5}/)[0];
	if (!memInfo.cardInfo || con != cards.length) return { embeds: [], components: [], error: 1 };

	const { id: card_id } = cardInfo;
	const card = await Cards.getCard(card_id);
	const owner = await Cards.getCardAuthor(card_id);

	const memberName = await (async () => {
		if (!owner) return '??????';
		const { name } = await Cards.getMember(owner.member_id);

		return name;
	})();

	const msgDesc = getCardDesc(card);

	const url = user.displayAvatarURL();
	const detailEmbed = new MessageEmbed()
		.setColor('#7ec460')
		.setThumbnail('https://i.imgur.com/Rbx9Li0.png')
		.setTitle(card.name)
		.setDescription(msgDesc)
		.setFields([
			{
				name: 'Creator',
				value: memberName,
				inline: true,
			},
			{
				name: 'Indexed in',
				value: 'Kedy\'s Kafé\n9/22/22',
				inline: true,
			},
			{
				name: 'Card Sets',
				value: 'Reborn Pepe\nKedy Zombie Support',
				inline: true,
			},
		]);


	// if creator / admin
	const modify = new MessageButton()
		.setCustomId('card modify')
		.setLabel('Modify')
		.setStyle('SECONDARY');
	const delCard = new MessageButton()
		.setCustomId('card delete')
		.setLabel('Delete')
		.setStyle('DANGER');

	const { components } = message;

	const topRow = components[0];
	const tbtnRow = components[1];
	const bbtnRow = components[2];

	const { components: tbtns } = tbtnRow;
	const bbtns = bbtnRow?.components;

	const btns = bbtnRow ? [ ...tbtns, ...bbtns] : tbtns;
	const [deetsBtn] = btns.filter(btn => btn.customId === customId);

	// check owner/admin
	const isAbleToModify = interaction.member.id == owner?.member_id;

	const updateSelect = async embedsArray => {
		// update embed msg
		const { maxPage, msg } = await getEmbedMsg({ cache, member, cards });

		const infoEmbed = embedsArray[0];
		infoEmbed
			.setDescription(msg)
			.setFooter({ text: `Page ${page} of ${maxPage}`, iconURL: url });
	};

	if (memInfo.details) {
		// current button re-clicked
		// return to original state
		if (deetsBtn.style === 'PRIMARY') {
			memInfo.details = false;
			memInfo.selectOn = 10;
			embeds.length = 1;
			topRow.spliceComponents(3, 2);
			deetsBtn.setStyle('SECONDARY');

			await updateSelect(embeds);
			return { embeds, components };
		}

		// different button clicked
		embeds[1] = detailEmbed;
		deetsBtn.setStyle('PRIMARY');

		// if owner/admin
		if (isAbleToModify) {
			const { components: currComp } = topRow;
			currComp.length = 3;
			topRow.addComponents(modify, delCard);
		}
		// old buttons removed if any
		else {
			topRow.spliceComponents(3, 2);
		}

		// set buttons to default state
		btns.forEach(btn => {
			if (btn !== deetsBtn) {
				btn.setStyle('SECONDARY');
			}
		});

		await updateSelect(embeds);
		return { embeds, components };
	}

	// show details of selection
	memInfo.details = true;
	embeds.push(detailEmbed);
	deetsBtn.setStyle('PRIMARY');
	if (isAbleToModify) topRow.addComponents(modify, delCard);

	await updateSelect(embeds);

	return { embeds, components };
};

module.exports = {
	getCardDesc,
	setPageInfo,
	errorHandler,
	getEmbedMsg,
	getButtonRows,
	showDetails,
	defaultError,
	updateEmbedMsg,
	ViewCards,
	ExportCards,
};
