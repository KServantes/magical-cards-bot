const { MessageEmbed } = require('discord.js');
const { modalForm } = require('../forms/modal');
const { getMemCards } = require('../data/models');

const fs = require('node:fs/promises');
const { access, constants } = require('node:fs');
const path = require('node:path');

const isButton = interaction => {
	return interaction.isButton();
};

const cardInfoModal = async interaction => {

	// bring up the app for info
	if (interaction.customId === 'yes') {
		try {
			const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Creating')
				.setDescription('Please wait...');
			await modalForm(interaction);
			return await interaction.message.edit({ embeds: [embed], components: [] });
		}
		catch (error) {
			return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
		}
	}

	// remove any buttons with reply
	if (interaction.customId === 'no') {
		try {
			return await interaction.update({ content: 'Okay. See you!', components: [] });
		}
		catch (error) {
			return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
		}
	}
	return ;
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

	// card info modal
	cardInfoModal(interaction);
	// library message
	if (interaction.customId === 'show_cards') {
		const cards = await getMemCards();

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
			const dbNew = require(`../data/cards/${member}/cdbConfig`);
			await dbNew.migrate.latest();
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