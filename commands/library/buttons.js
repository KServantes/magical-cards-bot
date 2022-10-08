const fs = require('node:fs/promises');
const { access, constants } = require('node:fs');
const wait = require('node:timers/promises').setTimeout;
const path = require('node:path');

const Cache = require('./cache');
const { getMemCards } = require('../../data/models');
const { MessageEmbed, MessageButton } = require('discord.js');
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

const bcDetails = async interaction => {
	const { member, message, client, user, customId } = interaction;
	const { embeds } = message;
	const { cache } = client;

	const memInfo = Cache.getMemberInfo(cache, member);
	const url = user.displayAvatarURL();

	const detailEmbed = new MessageEmbed()
		.setColor('#7ec460')
		.setThumbnail(url)
		.setTitle('Pendulum Zombie Dragon')
		.setImage('https://i.imgur.com/Rbx9Li0.png')
		.setDescription(`>>> 
**Type**: Monster / Normal / Pendulum
**Attribute** DARK | **Level**: ${4} | **Race**: Zombie
**ATK** 1800 **DEF** 0
**Left Scale**: ${5} | **Right Scale**: ${5}

[ Pendulum Effect ]
When this card is activated: You can add 1 Level 4 or lower Pendulum Monster from your Deck to your hand. If a Zombie-Type monster you control with 2000 or less ATK attacks an opponent's monster: You can reduce the ATK and DEF of the card it battles with to 0. You can only use this effect of "Pendulum Zombie Dragon" once per turn. 
----------------------------------------
[ Flavor Text ]
A dragon revived by sorcery. Its breath is highly corrosive.

(This card's name is always treated as "Dragon Zombie".)

**${1013030}**`)
		.setFields([
			{
				name: 'Creator',
				value: 'Keddy',
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

	if (!memInfo.details) {
		memInfo.details = true;
		embeds.push(detailEmbed);
		topRow.addComponents(modify, delCard);
		deetsBtn.setStyle('PRIMARY');

		return await interaction.update({ embeds, components });
	}

	if (memInfo.details) {
		memInfo.details = false;
		embeds.length = 1;
		topRow.spliceComponents(3, 2);
		deetsBtn.setStyle('SECONDARY');

		return await interaction.update({ embeds, components });
	}
};

module.exports = {
	bcExportCards,
	bcDetails,
};