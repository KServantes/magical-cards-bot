const { MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const Helper = require('./cache');
const { infoForm } = require('./forms/info');
const { statsForm } = require('./forms/stats');
const { Races, Types, Attributes } = require('./constants');

const { UID_CARD_ATT, UID_CARD_RACE, UID_CARD_TYPE } = require('./constants');

// start
const bcStart = async interaction => {
	try {
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Creating')
			.setDescription('Please wait...')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');
		await infoForm(interaction);
		return await interaction.message.edit({ embeds: [embed], components: [] });
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const bcHalt = async interaction => {
	try {
		await interaction.update({ content: 'Okay. See you!', components: [], embeds: [] });
		await wait(4000);
		return await interaction.message.delete();
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};


// step 1 => step 2
const bcNext = async interaction => {

	const { cache } = interaction.client;
	const cardRec = Helper.setCardCache(cache);
	console.log('Recorded as: ', cardRec);

	const getOptions = coll => {
		const options = coll.reduce((acc, _, r) => {
			const option = {
				label: r,
				value: r,
			};

			return acc.concat(option);
		}, []);

		return options;
	};

	const raceOptions = getOptions(Races);
	const raceRow = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId(UID_CARD_RACE)
				.setPlaceholder('Zombie')
				.addOptions(raceOptions),
		);


	const typeOptions = getOptions(Types);
	const typeRow = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId(UID_CARD_TYPE)
				.setPlaceholder('Monster')
				.setMinValues(2)
				// .setMaxValues(6)
				.addOptions(typeOptions),
		);


	const attOptions = getOptions(Attributes);
	const attributeRow = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId(UID_CARD_ATT)
				.setPlaceholder('DARK')
				.setMinValues(1)
				.addOptions(attOptions),
		);

	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Select this Card\'s Stats')
		.setDescription('Please select this card\'s Race | Type | Attribute')
		.setThumbnail('https://i.imgur.com/ebtLbkK.png');

	return await interaction.update({ components: [raceRow, typeRow, attributeRow], embeds: [embed] });
};

const bcEdit = async interaction => {
	try {
		await infoForm(interaction);
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Editing Card')
			.setDescription('Please wait...')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');
		return await interaction.message.edit({ embeds: [embed], components: [] });
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};


// step 2 => step 3
const bcEdit2 = async interaction => {
	try {
		return await bcNext(interaction);
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const bcNext3 = async interaction => {
	try {

		const { cache } = interaction.client;
		const cardRec = Helper.setCardCache(cache);
		console.log('Recorded as: ', cardRec);

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Creating')
			.setDescription('Step 3 of 6...')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');
		await statsForm(interaction);
		return await interaction.message.edit({ embeds: [embed], components: [] });
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};


// step 3 => step 4
const bcEdit3 = async interaction => {
	try {
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Editing')
			.setDescription('Step 3 of 6...')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');
		await statsForm(interaction);
		return await interaction.message.edit({ embeds: [embed], components: [] });
	}
	catch (error) {
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const createLinkButtons = () => {
	const tLBtn = new MessageButton()
		.setCustomId('↖️')
		.setLabel('↖️')
		.setStyle('SECONDARY');
	const tMBtn = new MessageButton()
		.setCustomId('⬆️')
		.setLabel('⬆️')
		.setStyle('SECONDARY');
	const tRBtn = new MessageButton()
		.setCustomId('↗️')
		.setLabel('↗️')
		.setStyle('SECONDARY');

	const lMBtn = new MessageButton()
		.setCustomId('⬅️')
		.setLabel('⬅️')
		.setStyle('SECONDARY');
	const mMBtn = new MessageButton()
		.setCustomId('🔵')
		.setLabel('🔵')
		.setStyle('SECONDARY')
		.setDisabled(true);
	const rMBtn = new MessageButton()
		.setCustomId('➡️')
		.setLabel('➡️')
		.setStyle('SECONDARY');

	const pLBtn = new MessageButton()
		.setCustomId('↙️')
		.setLabel('↙️')
		.setStyle('SECONDARY');
	const pMBtn = new MessageButton()
		.setCustomId('⬇️')
		.setLabel('⬇️')
		.setStyle('SECONDARY');
	const pRBtn = new MessageButton()
		.setCustomId('↘️')
		.setLabel('↘️')
		.setStyle('SECONDARY');

	return {
		top: [ tLBtn, tMBtn, tRBtn ],
		center: [ lMBtn, mMBtn, rMBtn ],
		pie: [ pLBtn, pMBtn, pRBtn ],
	};
};

const bcNext4 = async interaction => {
	try {
		// const { cache } = interaction.client;
		// const cardRec = Helper.setCardCache(cache);
		// console.log('Recorded as: ', cardRec);

		// If Link
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Link Markers')
			.setDescription('Please select the link markers for this card:')
			.setThumbnail('https://i.imgur.com/ebtLbkK.png');

		const { top: t, center: c, pie: p } = createLinkButtons();
		const topRow = new MessageActionRow().addComponents(t);
		const midRow = new MessageActionRow().addComponents(c);
		const pieRow = new MessageActionRow().addComponents(p);
		return await interaction.update({ embeds: [embed], components: [topRow, midRow, pieRow] });

		// Skip to Archetype
		// haven't made it yet kekw
	}
	catch (error) {
		console.log(error);
		return await interaction.reply({ content: 'There was an error executing this.', ephemeral: true });
	}
};

const LinkButtons = async interaction => {
	const buttons = ['↖️', '⬆️', '↗️', '⬅️', '🔵', '➡️', '↙️', '⬇️', '↘️'];

	const [selected] = buttons.filter(btn => interaction.customId === btn);
	const index = buttons.indexOf(selected) + 1;
	// rows {}
	const [top, center, pie] = interaction.message.components;
	const { embeds: e } = interaction.message;
	let fields = e[0].fields;

	const editFields = (select, style) => {
		const newField = s => {
			return {
				name: 'Select',
				value: s,
				inline: true,
			};
		};

		if (style === 'PRIMARY') {
			const field = newField(select);

			fields.push(field);
		}
		else {
			const rest = fields.filter(f => f.value !== select);
			fields = rest;
		}
	};

	const newStyle = comp => {
		const style = comp.style === 'SECONDARY' ? 'PRIMARY' : 'SECONDARY';
		return style;
	};

	const setRowComps = row => {
		let i = index;
		const iDict = { 4: 0, 5: 1, 6: 2, 7: 0, 8: 1, 9: 2 };
		i = i > 3 ? iDict[i] : i - 1;

		const btn = row.components[i];
		const style = newStyle(btn);
		const newBtn = btn.setStyle(style);

		row.components[i] = newBtn;

		const newComp = row.components;

		editFields(selected, style);
		row.setComponents(newComp);
	};

	if (index <= 3) setRowComps(top);
	if (index >= 4 && index <= 6) setRowComps(center);
	if (index >= 7) setRowComps(pie);

	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Link Markers')
		.setDescription('Please select the link markers for this card:')
		.setFields(fields)
		.setThumbnail('https://i.imgur.com/ebtLbkK.png');
	return await interaction.update({ embeds: [embed], components: [top, center, pie] });
};

module.exports = {
	bcStart,
	bcHalt,
	bcEdit,
	bcNext,
	bcEdit2,
	bcNext3,
	bcEdit3,
	bcNext4,
	LinkButtons,
};