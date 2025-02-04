const { Colors, channelMention, ButtonStyle, Collection, GuildMember, 
    ButtonBuilder, EmbedBuilder, PrivateThreadChannel, Guild, GuildBasedChannel,
    ActionRowBuilder, ChatInputCommandInteraction, APIInteractionGuildMember } = require("discord.js");
const { Danger, Secondary } = ButtonStyle;
const { Blue  } = Colors;

const { BOT_IMG_URL, UID_HALT_DELETE, UID_DELETE_ALL } = require('@constants')

/**
 * Builds the embed to pass through. If coll is passed, it is because there's
 * more than 1 channel with threads that are deletable. Only thread channels made with the bot will be deleted.
 * @private
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

/**
 * Admin command to present the buttons to delete all thread made by the bot. Will tell you how many threads total and the parent channel(s) of those threads.
 * @private
 * @param {ChatInputCommandInteraction} interaction
 * @returns {{ embeds: EmbedBuilder[], components: ActionRowBuilder[]}}
 */
const deleteAll = interaction => {

    const { member, guild } = interaction;

    const threadChannels = getBotThreadChannels(guild);

    // If no channels to scrub
    if (threadChannels.size === 0 ) {
        const desc = 'It\'s squeaky clean in here! There are no threads to delete.'
        const embed = buildEmbed(member,desc)

        return { embeds: [embed], components: [] };
    }

    const parentChannels = threadChannels.reduce((acc, tc) => {
        const { parentId } = tc;
        acc.set(parentId,tc)
        
        return acc;
    }, new Collection());
   
    const parentString = parentChannels.size === 1 ? channelMention(parentChannels.firstKey()) : parentChannels.size === 0 ? 'channel' : `${parentChannels.size} channels`;

    const description = `You are about to delete ${threadChannels.size} **threads** in ${parentString} \n\n **Continue?**`;
    const halt = new ButtonBuilder()
        .setCustomId(UID_HALT_DELETE)
        .setLabel('No - Keep')
        .setStyle(Secondary);
    const fire = new ButtonBuilder()
        .setCustomId(UID_DELETE_ALL)
        .setLabel('Yes - Delete')
        .setStyle(Danger);

    const embed = parentChannels.size < 2 ? buildEmbed(member, description) : buildEmbed(member,description,parentChannels)
    const row = new ActionRowBuilder().addComponents(halt, fire);

    return { embeds: [embed], components: [row] };
};

/**
 * @constant {Collection<object,callback>} DEFAULT_ADMIN_COMMANDS
 */
const DEFAULT_ADMIN_COMMANDS = new Collection([
    [{ name: 'Delete all threads', value: 'delete all' }, deleteAll],
    // [{ name: 'Delete all archived threads', value: 'delete all archived'}, ],
    // [{ name: 'Delete threads by Duelist', value: 'delete duelist'}, ]
]); 

module.exports = {
    default_commands: DEFAULT_ADMIN_COMMANDS,
    getBotThreadChannels
};