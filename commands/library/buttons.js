const fs = require('node:fs/promises');
const { access, constants } = require('node:fs');
const wait = require('node:timers/promises').setTimeout;
const path = require('node:path');

const Cache = require('./cache');
const Helper = require('./msgHelper');
const Cards = require('../../data/models');
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

const bcDetails = async interaction => {
	const { member, client, customId } = interaction;
	const { cache } = client;

	const memInfo = Cache.getMemberInfo(cache, member);
	memInfo.selectOn = parseInt(customId.at(-1));

	const { embeds, components, error } = await Helper.showDetails(interaction);

	if (error) return await Helper.defaultError(interaction);
	return await interaction.update({ embeds, components });
};

const bcNextPage = async interaction => {
	const { member, client } = interaction;
	const { cache } = client;

	const memInfo = Cache.getMemberInfo(cache, member);
	memInfo.npage = 1;

	return await Helper.updateMSGInteraction(interaction);
};

const bcPrevPage = async interaction => {
	const { member, client } = interaction;
	const { cache } = client;

	const memInfo = Cache.getMemberInfo(cache, member);
	memInfo.ppage = 1;

	return await Helper.updateMSGInteraction(interaction);
};

module.exports = {
	bcExportCards,
	bcNextPage,
	bcPrevPage,
	bcDetails,
};