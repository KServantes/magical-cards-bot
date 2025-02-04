const { Colors, ButtonInteraction, EmbedBuilder, Collection, channelMention, bold } = require("discord.js");
const { Gold } = Colors;

const { getBotThreadChannels } = require('./index');

const { UID_DELETE_ALL, BOT_IMG_URL } = require('@constants');

/**
 * 
 * @param {ButtonInteraction} interaction 
 */
const buttonDeleteAll = async interaction => {

	const { message, guild } = interaction;
	const { footer } = message.embeds[0];

    const threadChannels = getBotThreadChannels(guild)

    /** @type {Collection<string,number>} */
    const parentColl = new Collection();

    // organize channels into parent collection
    await threadChannels.reduce(async (accPromise, ch) => {

        const acc = await accPromise
        const deleted = await ch.delete('Deleted by Admin Delete All Command');

        if (deleted) {
            const { parentId } = deleted;
            acc.set(parentId, (acc.get(parentId) || 0) + 1);
        }

        return acc;

    },Promise.resolve(parentColl));

    // description
    let title = 'Poof!'
    let desc = 'No Description';
    switch(parentColl.size) {
        case 1:
            desc = `The cleaning is done! ${bold(parentColl.first())} **threads** were deleted in ${channelMention(parentColl.firstKey())}!`
            break
        case 0:
            title = 'Huh?'
            desc = 'Nothing was deleted? How odd.'
            break
        default:
            let count = 0;
            let pchannels = 0;
            for (const [_,delcount] of parentColl) {
                count += delcount
                pchannels++
            }
            title = 'Thwack!'
            desc = `Wow! ${bold(count)} **threads** were deleted in ${bold(pchannels)} channels! So much room for activities!`
    }

	const embed = new EmbedBuilder()
		.setColor(Gold)
		.setTitle(title)
		.setDescription(desc)
		.setFooter(footer)
		.setThumbnail(BOT_IMG_URL)
        .setTimestamp();

    interaction.update({ content: '', embeds: [embed], components: [] });
};

const interactButton = new Collection([
    [UID_DELETE_ALL, buttonDeleteAll]
]);

module.exports = { button: interactButton }