/**
 * chatInput
 * @module ChatInteractionController
 * 
 * @author Keddy
 * @version 0.1.0
 * @description This module executes the chat input interaction handler associated with it's unique ID.
 * These functions are executed with the main admin.js file.
 * */

const { channelMention, ButtonStyle, ButtonBuilder, EmbedBuilder, ActionRowBuilder, Collection, ChannelType, ChatInputCommandInteraction, StringSelectMenuBuilder } = require('discord.js');
const { Danger, Secondary, Primary } = ButtonStyle;
const { GuildForum } = ChannelType;

const { getBotThreadChannels, buildEmbed } = require('../util');

const { UID_DELETE_ALL, UID_HALT_ADMIN } = require('@constants');

const { BotClient } = require('@structures');

/**
 * Admin command to present the buttons to delete all thread made by the bot. Will tell you how many threads total and the parent channel(s) of those threads.
 * @param {ChatInputCommandInteraction} interaction
 * @returns {{ embeds: EmbedBuilder[], components: ActionRowBuilder[]}}
 */
const commandDeleteAll = interaction => {

    const { member, guild } = interaction;

    const threadChannels = getBotThreadChannels(guild);

    // If no channels to scrub
    if (threadChannels.size === 0 ) {
        const desc = 'It\'s squeaky clean in here! There are no threads to delete.'
        const embed = buildEmbed({ member, desc} )

        return { embeds: [embed], components: [] };
    }

    const parentChannels = threadChannels.reduce((acc, tc) => {
        const { parentId } = tc;
        acc.set(parentId,tc)
        
        return acc;
    }, new Collection());
   
    const parentString = parentChannels.size === 1 ? channelMention(parentChannels.firstKey()) : parentChannels.size === 0 ? 'channel' : `${parentChannels.size} channels`;

    const desc = `You are about to delete ${threadChannels.size} **threads** in ${parentString} \n\n **Continue?**`;
    const halt = new ButtonBuilder()
        .setCustomId(UID_HALT_ADMIN)
        .setLabel('No - Keep')
        .setStyle(Secondary);
    const fire = new ButtonBuilder()
        .setCustomId(UID_DELETE_ALL)
        .setLabel('Yes - Delete')
        .setStyle(Danger);

    const embed = parentChannels.size < 2 ? buildEmbed({ member, desc }) : buildEmbed({ member, desc, coll: parentChannels })
    const row = new ActionRowBuilder().addComponents(halt, fire);

    return { embeds: [embed], components: [row] };
};

/**
 * Admin command to present the buttons to delete all thread made by the bot. Will tell you how many threads total and the parent channel(s) of those threads.
 * @param {ChatInputCommandInteraction} interaction
 * @returns {{ embeds: EmbedBuilder[], components: ActionRowBuilder[]}}
 */
const commandForumID = interaction => {

    const { member, guild, guildId } = interaction; 
    /** @type {{ client: BotClient }} */
    const { client } = interaction;

    const { forum_channel } = client.bot.getGuildSettings(guildId);
    const guildForumChannels = guild.channels.cache.filter(ch => ch.type === GuildForum && ch.name !== 'plans');

    let components = [];

    // setting a new forum channel
    if (guildForumChannels.size > 0 && forum_channel === '') {
        //assign forum channel
        const fcc = guildForumChannels.size

        const multiSelectMsg = '\n\n This channel will be where the bot posts all card applications. \n **Please select which channel you\'d like the bot to use.**'
        const singleSelectMsg = `\n\n **Would you like to use** ${guildForumChannels.first()}?`

        const desc = `Looks like there ${fcc > 0 ? 'are' : 'is' } ${fcc} channel${fcc > 0 ? 's' : ''} to use! ${fcc === 1 ? singleSelectMsg : multiSelectMsg}`

        const embed = buildEmbed({ member, title: '| Forum Channel', desc })

        const buttons = [
            new ButtonBuilder()
                .setCustomId(UID_HALT_ADMIN)
                .setLabel('No - Go Back')
                .setStyle(Secondary),
            new ButtonBuilder()
                .setCustomId('set fc')
                .setLabel('Yes - Assign')
                .setStyle(Primary)
        ]

        const options = guildForumChannels.reduce((acc, fc) => {
            acc.push({ label: fc.name, value: fc.id })
            return acc;
        }, []);

        const menu = new StringSelectMenuBuilder()
            .setCustomId('fc select menu')
            .setPlaceholder('magical cards bot')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(options)

    
        const row = new ActionRowBuilder().addComponents(fcc > 1 ? menu : buttons);
        components = [row]

        return { embeds: [embed], components }
    }

    // manage forum channels
    else if (guildForumChannels.get(forum_channel)) {
        const desc = `${channelMention(forum_channel)} is set to be the bot's designated card application forum. \n\n **Would you like to update it or not use it anymore?**`
        const embed = buildEmbed({ member, title: '| Forum Channel', desc })

        return { embeds: [embed], components: [] };
    }

    // guild doesn't support forum
    const embed = buildEmbed({ member, title: '| Forum Channel', desc: 'This server does not support forum channels :/' });
    components = [];

    return { embeds: [embed], components };
};


/**
 * Admin Command Collection
 * Stores the {SlashCommandStringOptions} Object as a key and the handler callback as the value.
 * @constant {Collection<object,callback>} DEFAULT_ADMIN_COMMANDS
 */
const DEFAULT_ADMIN_COMMANDS = new Collection([
    [{ name: 'Delete all threads', value: 'delete all' }, commandDeleteAll],
    [{ name: 'Forum Channel', value: 'forum' }, commandForumID]
    // [{ name: 'Delete all archived threads', value: 'delete all archived'}, ],
    // [{ name: 'Delete threads by Duelist', value: 'delete duelist'}, ]
]);

module.exports = { DEFAULT_ADMIN_COMMANDS };