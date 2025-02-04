/**
 * Constants
 * 
 * @author Keddy
 * @version 0.1.0
 * @description  Magical Cards Bots main constants file. In this file are the constants for basic bot assets
 * (e.g. emote ids to use, img url), unique string ids for the bot's interactions (button, selectmenu, and modal),
 * possibly bot reply messages (rare), and tokenized fuctions immediately invoked.
 * 
 * */


/**
 * @memberof ChannelID
 * @constant {string} BOT_FORUM_CHANNEL (Only use in Testing) the channel id of the forum channel to populate card apps
 * If set by the server owner, it will ask to populate an existing forum channel.
 * If not made, then the bot will make it with default permissions. (e.g. members cannot create )
 */
const BOT_FORUM_CHANNEL = process.env.FORUM_CHANNEL_ID || '';


// -------------
// EMOTE IDs
// -------------

/** @constant {string} EMOTE_HATS hats emote id */
const EMOTE_HATS = '1133616860294823946';

/** @constant {string} EMOTE_FACEDOWN facedown card emote id */ 
const EMOTE_FACEDOWN = '1133624918488133773';


// -------------
// BOT IMG URLS
// -------------

/** @constant {string} BOT_IMG_URL imgur link to the bot's img url */
const BOT_IMG_URL = 'https://i.imgur.com/ebtLbkK.png';


// -------------
// NUMBER CONSTANTS
// -------------

/** @constant {number} DEFAULT_AVATAR_SIZE default avatar size by pixel*/
const DEFAULT_AVATAR_SIZE = 128


/**
 * @namespace Button_Constants
 */

// buttons
/**
 * @memberof Button_Constants
 * @constant {string} UID_START phase 00 - In DMs brings up the Info Modal
 */
const UID_START = 'start';

/**
 * @memberof Button_Constants
 * @constant {string} UID_START_THREAD phase 00 - In Servers, creates a new thread/forum post. Also sends the 
 */
const UID_START_THREAD = 'start_thread';

/** 
 * @memberof Button_Constants
 * @constant {string} UID_START phase 00 - Deletes the inital reply
 */
const UID_HALT = 'halt';

/**
 * @namespace Admin_Button_Constants
 */

/**
 * @memberof Admin_Button_Constants
 * @constant {string} UID_DELETE_ALL deletes all threads
 */
const UID_DELETE_ALL = 'delete all'

/**
 * @memberof Admin_Button_Constants
 * @constant {string} UID_HALT_DELETE halts delete
 */
const UID_HALT_DELETE = 'halt delete'

module.exports = {
    EMOTE_HATS,
    EMOTE_FACEDOWN,
    BOT_IMG_URL,
    UID_START,
    UID_HALT,
    UID_DELETE_ALL,
    UID_HALT_DELETE,
    UID_START_THREAD,
    DEFAULT_AVATAR_SIZE,
    BOT_FORUM_CHANNEL
}
