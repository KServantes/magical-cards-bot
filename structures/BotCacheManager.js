const { Collection } = require("discord.js")

const { GuildCache, GlobalCache, ServerSets } = require('@types');
const { GUILD_CACHE } = require("@constants");


module.exports = class BotCacheManager {
    constructor() {
        /** @type {GlobalCache} */
        this.cache = new Collection([
            [GUILD_CACHE, new Collection()],
            ['create cache', new Collection()],
            ['library cache', new Collection()]
        ]);
        // this.constants = Constants;
    }

    /**
     * Gets the cache collection by it's string id
     * @param {'guild cache' | 'member cache' | 'create cache'} uid caches unique id key
     * @returns {Collection<CacheType,GuildCache|CreateCache|LibraryCache>}
     */
    get(uid) {
        return this.cache.at(uid);
    }

    #createSettings() {
        return {
            forum_channel: '',
            blacklist: new Collection(),
        }
    }

    /**
     * 
     * @param {string} guildID guild's id to search
     * @returns {{ forum_channel: string, blacklist: Collection }}
     */
    getGuildSettings(guildID) {
        const gc = this.cache.at(GUILD_CACHE);
        const settings = gc.get(guildID);
        if (!settings) {
            const fIDFromEnv = process.env.FORUM_CHANNEL_ID
            const newSettings = fIDFromEnv !== undefined ? {...this.#createSettings(), forum_channel: fIDFromEnv} : this.#createSettings()
            gc.set(guildID,newSettings);
            return newSettings;
        }

        return settings;
    }
};