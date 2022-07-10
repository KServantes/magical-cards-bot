const Create = require('../commands/create/index');
const { getMemCards } = require('../data/models');
const { getCardExtra, addCardExtra } = require('../data/cards/extraModels');

const fs = require('node:fs/promises');
const { access, constants } = require('node:fs');
const wait = require('node:timers/promises').setTimeout;
const path = require('node:path');

const isButton = interaction => {
	return interaction.isButton();
};

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

const interactionButton = async (interaction) => {
	Create.button.forEach((fun, key) => {
		if (interaction.customId === key) {
			fun(interaction);
		}
	});
	// library message
	if (interaction.customId === 'show_cards') {
		const userOp = interaction.client.cache.get('libUser');
		const { id: memberID } = userOp ? userOp : interaction.member;
		const cards = await getMemCards(memberID);
		console.log(cards);

		const msg = cards.reduce((acc, c, i) => {
			let str = `[${i + 1}] [${c.id}] - ${c.name}`;
			if (i + 1) { str = str.concat(' \n');}

			return acc.concat(`${str}`);
		}, '');

		const msgFormat = ` \`\`\`${msg}\`\`\` `;

		await interaction.update({ content: msgFormat, components: [], embeds: [] });
	}

	if (interaction.customId === 'export_cards') {
		const member = interaction.member.displayName;
		const dirPath = path.join(__dirname, `../data/cards/${member}`);
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
			const dbNew = await require(`../data/cards/${member}/cdbConfig`);
			await dbNew.migrate.latest();
			const cards = await getMemCards(interaction.member.id);
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
		}
		catch (err) {
			return console.log({ err });
		}
	}

};

module.exports = {
	name: 'button',
	type: isButton,
	interact: interactionButton,
};