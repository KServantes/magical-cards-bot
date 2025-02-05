const { Colors, channelMention, Collection, GuildMember, EmbedBuilder, PrivateThreadChannel, Guild, GuildBasedChannel, APIInteractionGuildMember } = require("discord.js");
const { Blue } = Colors;

const { BOT_IMG_URL } = require('@constants');

/**
 * Builds the embed to pass through. If coll is passed, it is because there's
 * more than 1 channel with threads that are deletable. Only thread channels made with the bot will be deleted.
 * @param {GuildMember|APIInteractionGuildMember} member guild member
 * @param {string} description embed description
 * @param {Collection<string,PrivateThreadChannel>} coll channel collection <parentID,threadChannel>
 * @returns { EmbedBuilder }
 */
const buildEmbed = (member, description, coll) => {

    const { displayName: name } = member;

    let embed = new EmbedBuilder()
        .setColor(Blue)
        .setTitle('Admin Panel')
        .setDescription(description)
        .setFooter({ text: name, iconURL: member.displayAvatarURL() })
        .setThumbnail(BOT_IMG_URL)
        .setTimestamp();

    if (coll) {
        const fields = [];

        for (const id of coll.keys()) {
            fields.push({
                name:'Channel',
                value: channelMention(id),
                inline: true
            });
        };

        embed.addFields(fields);
    }

    return embed;
};

/**
 * Gets the thread channels in a guild.
 * @param {Guild} guild server to search
 * @returns {Collection<string,GuildBasedChannel>}
 */
const getBotThreadChannels = guild => {
    const threadChannels = guild.channels.cache.filter(channel => channel.isThread() && channel.ownerId === process.env.CLIENT_ID);
    
    return threadChannels;
};

module.exports = {
    buildEmbed,
    getBotThreadChannels
};