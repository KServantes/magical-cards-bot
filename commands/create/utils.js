// eslint-disable-next-line no-unused-vars
const { MessageEmbed, MessageComponentInteraction, GuildMember, Collection } = require('discord.js');
const { BOT_IMG_URL } = require('./constants');

const Cache = require('./cache');


/**
 * Checks the footer icon url to double check that the member
 * that is interacting with the current embeds/buttons is the same
 * member that is working on their card.
 *
 * Prevents other members from interfering with other's cards making process.
 *
 * @param {MessageComponentInteraction} interaction
 * @returns {Error|boolean}
 */
const CheckOwner = interaction => {
	const { member, message } = interaction;
	const { footer } = message.embeds[0];
	const avatarString = member.user.displayAvatarURL({ dynamic: true });
	if (footer.iconURL !== avatarString) {
		const embed = new MessageEmbed()
			.setColor('#dd0f0f')
			.setTitle('Trap Card, Activate!')
			.setDescription('>>> Sorry. You didn\'t type this command.\nPlease type the /create command to make a card of your own.')
			.setThumbnail(BOT_IMG_URL);

		const newError = new Error('Impersonator Error');
		newError.errorMsg = {
			embeds: [embed],
			components: [],
			ephemeral: true,
		};
		throw newError;
	}

	return true;
};

/**
 * Middleware of sorts that does two things
 *
 * 1. Checks the origin of the message owner
 * 2. Try catch function wrapper
 *
 * @param {Promise<Message>} buttonChoice
 * @returns {Promise<function>}
 */
const MiddleWrapper = buttonChoice => {

	// check owner first
	function checker(...args) {
		CheckOwner(...args);
	}

	// todo update avatar/icon url cache if different
	return async (...args) => {
		try {
			checker(...args);
			return await buttonChoice(...args);
		}
		catch (error) {
			LogDefault(error);
			return await ErrorReplyDefault(...args, error);
		}
	};
};

/**
 * Prints the error name, trace, and time of the error to stdout
 * @param {Error} error
 * @returns {void}
 */
const LogDefault = error => {
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

/**
 * @typedef {Object} CacheObject
 * @property {Collection} cache
 * @property {GuildMember} member
 * @property {object} args
 * @property {number} step
 */

/**
 * @param {CacheObject} cacheObject
 * @returns {void}
 */
const RegisterCacheData = cacheObject => {
	Cache.setDataCache(cacheObject);
	return console.log(cacheObject);
};

/**
 * @param {Collection} cache
 * @param {GuildMember} member
 */
const RegisterCacheCard = (cache, member) => {
	const { nickname, user } = member;
	const { username } = user;

	// check if no entered info
	// may or may not need to check for data while passing this
	// const data = Cache.getDataCache(cache, member);
	// const lastStep = data.last() ?? null;
	// if (!data || lastStep) {
	// 	throw new Error();
	// };

	// record and log
	const record = Cache.setCardCache(cache, member);

	return console.log({
		member: nickname ?? username,
		record,
	});
};

/**
 * @param {MessageComponentInteraction} interaction
 * @param {Error} error
 */
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
	const replyMsg = { embeds: [errorEmbed], ephemeral: true };
	return await interaction.reply(error.errorMsg ?? replyMsg);
};

module.exports = {
	CheckOwner,
	LogDefault,
	MiddleWrapper,
	RegisterCacheCard,
	RegisterCacheData,
	ErrorReplyDefault,
};