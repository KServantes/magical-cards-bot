const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Helper = require('../../utils/cache');
const Form = require('../../forms');
const { BOT_IMG_URL, UID_FINISH_LINE } = require('../../utils/constants');

// step 6
// strings modals ()
const bcNext6 = async interaction => {
	const { client, message, member } = interaction;
	const { cache } = client;
	const { embeds } = message;
	const { fields } = embeds[0];

	const data = Helper.setDataCache({ member, cache, args: fields, step: 5 });
	console.log('data entered: ', data);

	const cardRec = Helper.setCardCache(cache, member);
	console.log('Recorded as: ', cardRec);


	// finish the app
	const skip = new MessageButton()
		.setCustomId(UID_FINISH_LINE)
		.setLabel('Skip')
		.setStyle('PRIMARY');

	// strings no to add
	const one = new MessageButton()
		.setCustomId('add one')
		.setLabel('1')
		.setStyle('SECONDARY');
	const two = new MessageButton()
		.setCustomId('add two')
		.setLabel('2')
		.setStyle('SECONDARY');
	const three = new MessageButton()
		.setCustomId('add three')
		.setLabel('3')
		.setStyle('SECONDARY');
	const four = new MessageButton()
		.setCustomId('add four')
		.setLabel('4')
		.setStyle('SECONDARY');
	const five = new MessageButton()
		.setCustomId('add five')
		.setLabel('5')
		.setStyle('SECONDARY');

	// msg update
	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Strings')
		.setDescription(`>>> [Scripting]
		Description messages used in YGOPro.
		Suggestions: 'Destroy', 'Draw', 'Facedown'

		**Skip to complete the process or choose the number of strings you want to add**
		
		**Next Steps:**`)
		.setThumbnail(BOT_IMG_URL)
		.setFooter({
			'text': '<- Complete  |  Strings to add (max 16) ->',
		});

	const skipRow = new MessageActionRow().addComponents(skip);
	const strRow = new MessageActionRow().addComponents(one, two, three, four, five);
	return await interaction.update({ embeds: [embed], components: [skipRow, strRow] });
};

const Strings = async interaction => {
	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Strings')
		.setDescription('>>> **Adding in strings...**')
		.setThumbnail(BOT_IMG_URL);

	await Form.strings(interaction);
	return await interaction.message.edit({ embeds: [embed], components: [] });
};

module.exports = { bcNext6, Strings };