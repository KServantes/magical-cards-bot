const { Collection, SlashCommandBuilder } = require('discord.js');

const Constants = require('./constants')
Constants.GUILD_CACHE

/**
 * @namespace BotCollections
 */

/**
 * ### Global Cache Collection
 * 
 * #### Client.cache
 * 
 * This collection has many collections tied to it.
 * 'member cache' - /Create Command Collection
 * 'library cache' - /Library Command Collection
 * 'guild cache' - Keeps individual guild settings. (e.g. forum channel id)
 * @memberof BotCollections
 * @typedef {Collection<string,GuildCache>} GlobalCache
 */

/**
 * ### Guild Cache
 * Holds the server settings per id.
 * @memberof BotCollections
 * @typedef {Collection<string,ServerSets>} GuildCache
 * @example <caption>Example usage and what to expect</caption>
 * // get guild cache by it's string id
 * const guildCache = client.cache.get('guild cache')
 * // returns ServetSets object
 * const { guildId } = interaction;
 * const ServerSets = guildCache.get(guildId)
 */

/**
 * ### Client.interactions
 * @memberof BotCollections
 * @typedef {Collection<string,Interaction>} InteractionCollection
*/

/**
 * ### Client.commands
 * @memberof BotCollections
 * @typedef {Collection<string,Command>} CommandCollection
 */

/**
 * @typedef {Object} ServerSets Server's settings object
 * @prop {string} [forum_channel] designated forum channel for the bot to use
 * @prop {Collection} blacklist list of banned guild users
 */

/**
 * @typedef {Object} Command Command data
 * @prop {SlashCommandBuilder} data - Slash command
 * @prop {Function} execute chat input handler to execute
 */

/**
 * @typedef {Object} Interaction Interaction data
 * @prop {string} name Name of the interaction
 * @prop {Function} type Bool check of the interaction type
 * @prop {Function} interact Interact handler to execute
 */

module.exports = {};