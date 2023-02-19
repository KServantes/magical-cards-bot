const { MessageEmbed } = require('discord.js');

// constants
const BOT_IMG_URL = 'https://i.imgur.com/ebtLbkK.png';

// error embed
const CheckOwner = async interaction => {
	const { member, message } = interaction;
	const { footer } = message.embeds[0];
	if (!footer.text.includes(member.id)) {
		const embed = new MessageEmbed()
			.setColor('#dd0f0f')
			.setTitle('Trap Card, Activate!')
			.setDescription('>>> Sorry. You didn\'t type this command.\nPlease type the /create command to make a card of your own.')
			.setThumbnail(BOT_IMG_URL);

		await interaction.reply({ embeds: [embed], components: [], ephemeral: true });

		return false;
	}

	return true;
};

const LogDefault = (error) => {
	const traceStr = (() => {
		const stack = error?.stack ?? 'Unknown';
		if (stack !== 'Unknown') {
			const path = stack.split('\n')[1].split('\\');
			const res = [-4, -3, -2, -1].reduce((acc, int) => {
				return acc += '/' + (path.at(int) ?? '...');
			}, '');

			return res;
		}
		return stack;
	})();

	const now = new Date();
	const timeStr = Intl.DateTimeFormat('en-us', { dateStyle: 'full', timeStyle: 'long' }).format(now);

	return console.log({
		error: `${error?.name}`,
		trace: traceStr,
		time:  timeStr,
	});
};

const LogCardCache = (username, recData) => {
	return console.log(username, ' Recorded As: ', recData);
};

const ErrorReplyDefault = async (interaction, error) => {
	const { user } = interaction;
	const displayAvatarURL = options => user.displayAvatarURL(options);
	const errorType = error?.name ?? 'Hand Traps';

	const errorEmbed = new MessageEmbed()
		.setColor('#c61717')
		.setTitle('Error')
		.setDescription(`>>> There was an error executing this.

Please retry executing the command.`)
		.setFooter({
			text: `Type: ${errorType}`,
			iconURL: displayAvatarURL({ dynamic: true }) ?? BOT_IMG_URL,
		})
		.setThumbnail(BOT_IMG_URL);

	return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
};

module.exports = {
	CheckOwner,
	LogDefault,
	LogCardCache,
	ErrorReplyDefault,
};