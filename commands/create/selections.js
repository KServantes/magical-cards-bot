const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const selectionType = async interaction => {
	const types = interaction.values;
	const { components } = interaction.message;

	const str = types.reduce((acc, t) => {
		return acc.concat(t + '\n');
	}, '');

	const { embeds: msgEmbed } = interaction.message;
	const msgEmbFields = msgEmbed[0].fields;
	const newField = {
		name: 'Types',
		value: str,
		inline: true,
	};
	// message components = [ MessageActionRow{type, comp}, MessageActionRow{type, comp} ]
	// components MessageActionRow = [ SelectMenuBuilder {...} ]
	// if (components.length === 1) {
	// 	const race = msgEmbFields.filter(t => t.name === 'Race');
	// 	const att = msgEmbFields.filter(t => t.name === 'Attribute');
	// 	const embed = finalEmbed(str, race, att);
	// 	return await interaction.update({ embeds: [embed], components: [] });
	// }
	const rest = components.filter(actionRow => {
		// ass of v13 actionRow can only have 1 SelectMenuBuilder
		const selectMenu = actionRow.components[0];
		return selectMenu.customId != 'card type';
	});

	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Selections')
		.setDescription('Current Selection')
		.addFields([...msgEmbFields, newField]);

	return await interaction.update({ embeds: [embed], components: rest });
};

const selectionRace = async interaction => {
	const [race] = interaction.values;
	const { components } = interaction.message;

	const { embeds: msgEmbed } = interaction.message;
	const msgEmbFields = msgEmbed[0].fields;
	const newField = {
		name: 'Race',
		value: race,
		inline: true,
	};

	// if (components.length === 1) {
	// 	const type = msgEmbFields.filter(t => t.name === 'Types');
	// 	const att = msgEmbFields.filter(t => t.name === 'Attribute');
	// 	const embed = finalEmbed(type, race, att);
	// 	return await interaction.update({ embeds: [embed], components: [] });
	// }

	const rest = components.filter(actionRow => {
		// ass of v13 actionRow can only have 1 SelectMenuBuilder
		const selectMenu = actionRow.components[0];
		return selectMenu.customId != 'card race';
	});

	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Selections')
		.setDescription('Current Selection')
		.addFields([...msgEmbFields, newField]);

	return await interaction.update({ embeds: [embed], components: rest });
};

const selectionAtt = async interaction => {
	const [att] = interaction.values;
	const { components } = interaction.message;

	const { embeds: msgEmbed } = interaction.message;
	const msgEmbFields = msgEmbed[0].fields;
	const newField = {
		name: 'Attribute',
		value: att,
		inline: true,
	};

	const rest = components.filter(actionRow => {
		// ass of v13 actionRow can only have 1 SelectMenuBuilder
		const selectMenu = actionRow.components[0];
		return selectMenu.customId != 'card att';
	});

	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Selections')
		.setDescription('Current Selection')
		.addFields([...msgEmbFields, newField]);

	if (rest.length === 0) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('edit2')
					.setLabel('Edit')
					.setStyle('SECONDARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('step3')
					.setLabel('Next')
					.setStyle('PRIMARY'),
			);
		rest.push(row);
	}

	return await interaction.update({ embeds: [embed], components: rest });
};

module.exports = {
	selectionType,
	selectionRace,
	selectionAtt,
};