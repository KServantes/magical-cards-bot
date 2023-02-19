const { MessageEmbed } = require('discord.js');
const Form = require('./../../forms/index');
const wait = require('node:timers/promises').setTimeout;

const {
	CheckOwner,
	LogDefault,
	ErrorReplyDefault,
	BOT_IMG_URL,
} = require('./index');

// start
// modal (name, peff, desc, id)
const bcStart = async interaction => {
	try {
		const { message } = interaction;
		const { footer } = message.embeds[0];

		const check = await CheckOwner(interaction);
		if (!check) return ;

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Creating')
			.setDescription('> Please wait...')
			.setFooter(footer)
			.setThumbnail(BOT_IMG_URL);


		await Form.info(interaction);

		return await interaction.message.edit({ embeds: [embed], components: [] });
	}
	catch (error) {
		LogDefault(error);
		return await ErrorReplyDefault(interaction, error);
	}
};

const bcHalt = async interaction => {
	try {
		const check = await CheckOwner(interaction);
		if (!check) return ;

		await interaction.update({ content: 'Until next time...', components: [], embeds: [] });
		await wait(4000);
		return await interaction.message.delete();
	}
	catch (error) {
		LogDefault(error);
		return await ErrorReplyDefault(interaction, error);
	}
};

module.exports = { bcStart, bcHalt };