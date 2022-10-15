const fs = require('node:fs/promises');
const { access, constants } = require('node:fs');
const wait = require('node:timers/promises').setTimeout;
const path = require('node:path');

const Cache = require('./cache');
const Helper = require('./msgHelper');
const { getMemCards, getCard, getCardAuthor, getMember } = require('../../data/models');
const { MessageEmbed, MessageButton } = require('discord.js');
const { getCardExtra, addCardExtra } = require('../../data/cards/extraModels');

const { Types, Attributes, Races, Archetypes } = require('../../commands/create/constants');


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

const bcExportCards = async interaction => {

	// Export cards to database
	// Creates new dir for new members
	const userOp = interaction.client.cache.get('libUser');
	const member = userOp ? userOp.username : interaction.member.displayName;
	const dirPath = path.join(__dirname, `../../data/cards/${member}`);
	try {
		// make directory
		await access(dirPath, constants.F_OK, async err => {
			if (err) {
				// if doesn't exist
				await fs.mkdir(dirPath, err => {
					if (err) {
						console.log({ err, error: 'There was a problem!' });
					}
					return { msg: 'Directory has been created.' };
				});
				// if exists
				return { msg: 'This directory already exists' };
			}
		});

		// make db config file
		const fileDir = path.join(dirPath, 'cdbConfig.js');
		await access(fileDir, constants.F_OK, async err => {
			if (err) {
				const newFilePath = path.join(dirPath, 'cdbConfig.js');
				await fs.writeFile(newFilePath, defaultConfig(member), err => {
					if (err) {
						console.log({ err, error: 'This is a hol\' up!' });
					}
				});
			}
			return { msg: 'This file already exists!' };
		});

		// connect and migrate new db
		await wait(2000);
		const dbNew = await require(`../../data/cards/${member}/cdbConfig`);
		await dbNew.migrate.latest();
		const { id: memberId } = userOp ? userOp : interaction.member;
		const cards = await getMemCards(memberId);
		// console.log(cards);
		cards.forEach(async card => {
			const newCard = { id: card.id, name: card.name, desc: card.desc };
			const oldCard = await getCardExtra(dbNew, card.id);
			if (!oldCard) {
				await addCardExtra(dbNew, newCard);
			}
		});
		const dbFile = path.join(dirPath, 'cards.cdb');
		await interaction.update({
			components: [],
			embeds: [],
			files: [{
				attachment: dbFile,
				name: `${member}.cdb`,
				description: `${member}'s card database.`,
			}],
		});
		if (interaction.client.cache.has('libUser')) interaction.client.cache.delete('libUser');
	}
	catch (err) {
		if (interaction.client.cache.has('libUser')) interaction.client.cache.delete('libUser');
		return console.log({ err });
	}
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

const bcDetails = async interaction => {
	const { member, message, client, user, customId } = interaction;
	const { embeds } = message;
	const { cache } = client;

	const memInfo = Cache.getMemberInfo(cache, member);
	memInfo.selectOn = parseInt(customId.at(-1));
	if (!memInfo.cardInfo) return await defaultError(interaction);
	const { id: card_id } = memInfo.cardInfo;

	const card = await getCard(card_id);
	const owner = await getCardAuthor(card_id);

	const memberName = await (async () => {
		if (!owner) return '??????';
		const { name } = await getMember(owner.member_id);

		return name;
	})();

	const {
		id,
		name,
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

	const url = user.displayAvatarURL();
	const detailEmbed = new MessageEmbed()
		.setColor('#7ec460')
		.setThumbnail('https://i.imgur.com/Rbx9Li0.png')
		.setTitle(name)
		.setDescription(`>>> **Type**: ${tStr}
        **Attribute** ${attStr} | **${lvlType}**: ${lvlActual} | **Race**: ${raceStr}
        **ATK** ${atk} ${isType('Link') ? '' : `**DEF** ${def}`}
        ${placeholder}
        ${desc}
        **${id}**`)
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
		.setCustomId('server cards')
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
	const { components: bbtns } = bbtnRow;

	const btns = [ ...tbtns, ...bbtns];
	const [deetsBtn] = btns.filter(btn => btn.customId === customId);

	// check owner/admin
	const isAbleToModify = interaction.member.id == owner?.member_id;

	const updateSelect = async embedsArray => {
		// update embed msg
		const { maxPage, msg } = await Helper.getEmbedMsg({ cache, member });

		const infoEmbed = embedsArray[0];
		infoEmbed
			.setDescription(msg)
			.setFooter({ text: `Page 1 of ${maxPage}`, iconURL: url });
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
			return await interaction.update({ embeds, components });
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
		return await interaction.update({ embeds, components });
	}

	// show details of selection
	memInfo.details = true;
	embeds.push(detailEmbed);
	deetsBtn.setStyle('PRIMARY');
	if (isAbleToModify) topRow.addComponents(modify, delCard);

	await updateSelect(embeds);
	return await interaction.update({ embeds, components });
};

module.exports = {
	bcExportCards,
	bcDetails,
};