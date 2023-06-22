const { Message, GuildMember, MessageEmbed, MessageComponentInteraction } = require('discord.js');
const { BOT_IMG_URL } = require('./constants');
const wait = require('node:timers/promises').setTimeout;
const Cache = require('./cache');

const { ClientCache, CacheObject, DefaultError, Module } = require('./types');


/**
 * Checks the footer icon url to double check that the member
 * that is interacting with the current embeds/buttons is the same
 * member that is working on their card.
 *
 * Prevents other members from interfering with others' card making process.
 * @param {MessageComponentInteraction} interaction Interaction to be checked
 * @throws {DefaultError}
 * @returns {boolean} Either a pass (true) or throws an error with embedded message.
 */
const CheckOwner = interaction => {
	const { member, message } = interaction;
	const { footer } = message.embeds[0];
	const avatarString = member.user.displayAvatarURL({ dynamic: true });
	if (!footer || footer.iconURL !== avatarString) {
		const embed = new MessageEmbed()
			.setColor('#dd0f0f')
			.setTitle('Trap Card, Activate!')
			.setDescription('>>> Sorry. You didn\'t type this command.\nPlease type the /create command to make a card of your own.')
			.setThumbnail(BOT_IMG_URL);

		const newError = new Error('Member could not be verified');
		newError.embedMessage = {
			embeds: [embed],
			components: [],
			files: [],
			ephemeral: true,
		};
		throw newError;
	}

	return true;
};

/**
 * Prints the error name, trace, and time of the error to stdout
 * @param {DefaultError} error Error object
 * @returns {void} console.log()
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
		error: `${error.message || error.name}`,
		trace: traceStr,
		time:  timeStr,
	});
};

/**
 * @param {CacheObject} cacheObject Object sent to be cached.
 * @returns {void}
 */
const RegisterCacheData = cacheObject => {
	Cache.setDataCache(cacheObject);
	return console.log(cacheObject);
};

/**
 * @param {ClientCache} cache Global cache collection from client.
 * @param {GuildMember} member Member object in the guild.
 * @throws {DefaultError}
 * @returns {void}
 */
const RegisterCacheCard = (cache, member) => {
	const { nickname, user } = member;
	const { username } = user;

	// check if no entered info
	const data = Cache.getDataCache(cache, member);
	if (!data || data.size === 0) {
		/**
		 * @type {DefaultError}
		 */
		const cacheError = new Error('Cache Error');
		const embed = new MessageEmbed()
			.setColor('RED')
			.setTitle('Cache Data Error')
			.setThumbnail(BOT_IMG_URL)
			.setDescription(`There was no cache data found under member: ${member.nickname ?? member.user.username}
			Please create a new card.`)
			.setFooter({ text: 'Cache Error',
				iconURL: member.user.displayAvatarURL({ dynamic: true }),
			});
		cacheError['embedMessage'] = { components: [], embeds: [embed], ephemeral: true, files: [] };
		throw cacheError;
	}

	// record and log
	const record = Cache.setCardCache(cache, member);

	return console.log({
		member: nickname ?? username,
		record,
	});
};

/**
 * @param {MessageComponentInteraction} interaction Interaction to reply or update.
 * @param {DefaultError} error Error object.
 * @returns {Promise<void>|Promise<Message<boolean>>} Either replies with a generic error or with the specific error message.
 */
const ErrorReplyDefault = async (interaction, error) => {
	const { user, message } = interaction;
	const displayAvatarURL = options => user.displayAvatarURL(options);
	const errorType = error.name ?? 'Hand Traps';

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

	// default behavior
	if (error.embedMessage === undefined) {
		const replyMsg = { embeds: [errorEmbed], ephemeral: true };
		return await interaction.reply(replyMsg);
	}

	const { embedMessage } = error;
	await interaction.update(embedMessage);
	await wait(4000);
	return await message.delete();
};

/**
 * Middleware of sorts that does two things
 *
 * 1. Checks the origin of the message owner
 * 2. Try catch function wrapper
 * @param {Promise<Message>} buttonChoice Function for the button option.
 * @returns {Promise<Message<boolean>>} Function for the button wrapped in checker functions.
 */
const MiddleWrapper = buttonChoice => {
	// TODO update avatar/icon url cache if different

	return async (...args) => {
		try {
			/**
			 * @todo add back in when function interacts are up-to-date
			 */
			// CheckOwner(...args);
			return await buttonChoice(...args);
		}
		catch (error) {
			LogDefault(error);
			return await ErrorReplyDefault(...args, error);
		}
	};
};


/**
 * Applies the wrapper middleware
 * @param {Module} module module exports object.
 * @returns {Module} same object but with check functions in each exported function
 */
const ModularWrapper = module => {
	const newModule = Object.create(module);
	for (const [key, val] of Object.entries(module)) {
		newModule[key] = MiddleWrapper(val);
	}

	return newModule;
};

module.exports = {
	CheckOwner,
	LogDefault,
	MiddleWrapper,
	ModularWrapper,
	RegisterCacheCard,
	RegisterCacheData,
	ErrorReplyDefault,
};