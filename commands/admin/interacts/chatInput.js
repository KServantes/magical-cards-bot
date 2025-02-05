/**
 * chatInput
 * @module ChatInteractionController
 * 
 * @author Keddy
 * @version 0.1.0
 * @description This module executes the chat input interaction handler associated with it's unique ID.
 * These functions are executed with the main admin.js file.
 * */

const { channelMention, ButtonStyle, ButtonBuilder, EmbedBuilder, ActionRowBuilder, Collection } = require('discord.js');
const { Danger, Secondary } = ButtonStyle;

const { getBotThreadChannels, buildEmbed } = require('../util');

const { UID_DELETE_ALL, UID_HALT_DELETE } = require('@constants');

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
 * Admin Command Collection
 * Stores the {SlashCommandStringOptions} Object as a key and the handler callback as the value.
 * @constant {Collection<object,callback>} DEFAULT_ADMIN_COMMANDS
 */
const DEFAULT_ADMIN_COMMANDS = new Collection([
    [{ name: 'Delete all threads', value: 'delete all' }, commandDeleteAll],
    // [{ name: 'Delete all archived threads', value: 'delete all archived'}, ],
    // [{ name: 'Delete threads by Duelist', value: 'delete duelist'}, ]
]);

module.exports = { DEFAULT_ADMIN_COMMANDS };