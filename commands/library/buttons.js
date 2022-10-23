const fs = require('node:fs/promises');
const { access, constants } = require('node:fs');
const wait = require('node:timers/promises').setTimeout;
const path = require('node:path');

const Cache = require('./cache');
const Helper = require('./msgHelper');
const Cards = require('../../data/models');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { getCardExtra, addCardExtra } = require('../../data/cards/extraModels');


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
		const cards = await Cards.getMemCards(memberId);
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
	const { page } = memInfo;
	if (!memInfo.cardInfo) return await defaultError(interaction);
	const { id: card_id } = memInfo.cardInfo;

	const card = await Cards.getCard(card_id);
	const owner = await Cards.getCardAuthor(card_id);

	const memberName = await (async () => {
		if (!owner) return '??????';
		const { name } = await Cards.getMember(owner.member_id);

		return name;
	})();

	const msgDesc = Helper.getCardDesc(card);

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
		const { maxPage, msg } = await Helper.getEmbedMsg({ cache, member });

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

const updateControlRow = (row, p, maxP) => {
	const { components: buttons } = row;
	for (const index of buttons.keys()) {
		const button = buttons[index];
		const { label } = button;
		if (label === '>>') button.setDisabled(p === maxP ? true : false);
		if (label === '<<') button.setDisabled(p === 1 ? true : false);
	}
	// 3 default buttons
	// removes modify/delete
	buttons.length = 3;
};

const bcNextPage = async interaction => {
	const { member, message, client, user } = interaction;
	const { cache } = client;

	const memInfo = Cache.getMemberInfo(cache, member);
	memInfo.page = 2;
	const { page } = memInfo;
	const cards = await Cards.getAllCards();

	Helper.setPageInfo({ cache, member, cards });

	const { maxPage, msg } = await Helper.getEmbedMsg({ cache, member });
	const url = user.displayAvatarURL();

	const cardsEmbed = new MessageEmbed()
		.setColor('#7ec460')
		.setTitle('Library')
		.setDescription(msg)
		.setThumbnail('https://i.imgur.com/ebtLbkK.png')
		.setFooter({ text: `Page ${page} of ${maxPage}`, iconURL: url });

	const cardCount = memInfo.pageInfo.length;
	const srows = Helper.getButtonRows(cardCount);

	const { components: comp } = message;
	const controlRow = comp[0];

	updateControlRow(controlRow, page, maxPage);

	return await interaction.update({ embeds: [cardsEmbed], components: [controlRow, ...srows] });
};

const bcPrevPage = async interaction => {
	const { member, message, client, user } = interaction;
	const { cache } = client;

	const memInfo = Cache.getMemberInfo(cache, member);
	memInfo.page = 1;
	const { page } = memInfo;
	const cards = await Cards.getAllCards();

	Helper.setPageInfo({ cache, member, cards });

	const { maxPage, msg } = await Helper.getEmbedMsg({ cache, member });
	const url = user.displayAvatarURL();

	const cardsEmbed = new MessageEmbed()
		.setColor('#7ec460')
		.setTitle('Library')
		.setDescription(msg)
		.setThumbnail('https://i.imgur.com/ebtLbkK.png')
		.setFooter({ text: `Page ${page} of ${maxPage}`, iconURL: url });

	const cardCount = memInfo.pageInfo.length;
	const srows = Helper.getButtonRows(cardCount);

	const { components: comp } = message;
	const controlRow = comp[0];

	updateControlRow(controlRow, page, maxPage);

	return await interaction.update({ embeds: [cardsEmbed], components: [controlRow, ...srows] });
};

module.exports = {
	bcExportCards,
	bcNextPage,
	bcPrevPage,
	bcDetails,
};