const { Collection, GuildMember, Message, MessageEmbed } = require('discord.js');


// Collections
/**
 * Member's Collection
 *
 * Keeps track of a member's info (by id) collected through the card process
 * @typedef {Collection.<string,MemberInfo>} MemberCache
 */

/**
 * ### Global Cache Collection
 *
 * The main Collection stemming from the [Client]{@link https://old.discordjs.dev/#/docs/discord.js/main/class/Client}
 *
 * Multiple collections tied to it.

 * *"member cache"* - /Create Command Collection
 *
 * *"library cache"* - /Library Command Collection
 * @typedef {Collection.<string,MemberCache>} ClientCache
 */

/**
 * Steps Collection
 *
 * Found in the data property of @see CardApp
 * @typedef {Collection.<number,StepData>} StepsColl
 */


// Objects

// === === === === === === ===
// == Global Cache Objects ===
// === === === === === === ===
/**
 * @typedef {object} TempObject
 * @property {string} cardPEff Pendulum Effect
 * @property {string} cardDesc Effect/Description
 * @property {boolean} isPendy Is a Pendulum Card
 * @property {boolean} isLink Is a Link Card
 * @property {boolean} isTrell Is either a Spell or Trap
 * @property {number} stepNo Current "step" in the app
 */

/**
 * @typedef {object} CardCache
 * @property {number} id Passcode
 * @property {number} ot TCG/OCG/Anime/Custom
 * @property {number} alias Alias
 * @property {number} setcode Archetype
 * @property {number} type Aggregated type of card (e.g. Monster|Effect)
 * @property {number} atk Text Attack
 * @property {number} def Text Defense
 * @property {number} level Text Level
 * @property {number} race Text Race
 * @property {number} attribute Text Attribute
 * @property {number} category Any associated categories (e.g. Destroy, Send to Hand, etc.)
 * @property {string} name Text Name
 * @property {string} desc Effect/Description
 * @property {TempObject} temp Temp information object
 */

/**
 * @typedef {object} StepData
 * @property {number} step Step number
 * @property {*} [prop_one] Data
 * @property {*} [prop_two] Data
 * @property {*} [prop_tres] Data
 * @property {*} [prop_four] Data
 */

/**
 * @typedef {object} CardApp
 * @property {StepsColl} data Data collection (e.g. [step, { step: 0 }])
 * @property {CardCache} card Card cache object with all the current card info
 * @property {ServerInfo} server Server cache object with the current server info
 * @property {PageInfo} page Page cache object containing info of what page they member is on in the current app
 */

/**
 * @typedef {object} MemberInfo
 * @property {string} name Member's username
 * @property {string|null} avatar Member's avatar
 * @property {string} iconURL Member's icon url (if any)
 * @property {string} username Member's display name
 * @property {boolean} preview Is able to view card preview
 * @property {Collection.<number,CardApp>} apps Member's app collection
 * @property {number} current Current app index in apps collection
 * @property {number} currentOf Set the current app index
 * @property {boolean} showPreview Set the preview value
 * @property {Collection.<number,CardApp>} newApp Add a new card to the app collection
 * @property {CardApp} appInfo Get the current app's info
 */

/**
 * @typedef {object} ServerInfo
 * @property {string} id Server ID
 * @property {string} name Server's name
 * @property {string|null} icon Server icon (if any)
 * @property {string} locale Server's locale
 */

/**
 * @typedef {object} PageInfo
 * @property {number} page Current page number
 * @property {Collection.<string,number>} set Current set collection
 * @property {boolean} prefill Is prefilled with info from earlier steps ("Number")
 * @property {boolean} wipe Is in state of "wipe"
 * @property {Collection.<string,number>} switchSet Set the archetype collection to use for the page
 * @property {number} pageOf Set the page number to use
 */

/**
 * @typedef {object} CacheObject
 * @property {GuildMember} member Guild Member
 * @property {ClientCache} cache Global Collection Cache
 * @property {*} args Any objects, arrays, etc. to be passed in to cache
 * @property {number} step Current Step
 */

/**
 * @typedef {object} ErrorMessage
 * @property {MessageEmbed[]} embeds Embed message to go with the error handling
 * @property {[]} components Components will be wiped
 * @property {[]} files Files will be wiped
 * @property {boolean} ephemeral usually true to keep it to just the error recipient
 */

/**
 * Extended Error Object
 *
 * May have an embedMessage property for a specified error message
 * @typedef {object} ExtraError
 * @property {ErrorMessage} [embedMessage] Error Message to be passed into the ErrorReplyDefault function
 * @augments Error
 */

/**
 * @typedef {Error & ExtraError} DefaultError
 */

/**
 * @typedef {{[key: string]: Promise<Message>}} Module
 */


// === === === === === === ===
// == Step 01 (Info) Objects =
// === === === === === === ===

/**
 * @typedef {object} InfoFormData Input Info from the Info Form
 * @property {string} cardName Card's Name
 * @property {string} cardPEff Card's Pendulum Effect (if any '')
 * @property {string} cardDesc Card's lore/effect
 * @property {number} cardCode Card's Passcode
 */

/**
 * @typedef {object} InfoDataTemp Temp Object from [StepDataInfo]{@link StepDataInfo}
 * @property {string} cardPEff Card's Pendulum Effect
 * @property {string} cardDesc Card's effect/Lore
 */

/**
 * @typedef {object} StepDataInfo Data to be registered from info form
 * @property {number} step Step 1
 * @property {string} name Card's name from info form
 * @property {number} id Card's id from info form
 * @property {InfoDataTemp} temp Temp Object
 */

// === === === === === === ===
// = Step 02 (Types) Objects =
// === === === === === === ===

/**
 * @typedef {object} StepDataType Recursively passed so may not have all or same props at the time
 * @property {number} step Current Step
 * @property {number} [race] Card's Race value in decimal
 * @property {number} [type] Card's Type value in decimal
 * @property {number} [attribute] Card's Attribute value in decimal
 */

// === === === === === === ===
// = Step 03 (Stats) Objects =
// === === === === === === ===

/**
 * @typedef {object} StepDataStats
 * @property {number} step Current Step (3)
 * @property {number} atk ATK Value
 * @property {number} def DEF/Link Value
 * @property {number} level Level/Pendulum Scale
 */

// === === === === === === ===
// = Step 04 (Link) Objects ==
// === === === === === === ===

/**
 * @typedef {object} StepDataLink
 * @property {number} step Current step
 * @property {number} markers Link Marker's aggregate value
 */

// === === === === === === ===
// = Step 05 (Sets) Objects ==
// === === === === === === ===

/**
 * @typedef {object} SetDataSets
 * @property {string[]} sets Archetype set names
 * @property {string[]} codes Archetype set codes
 */

/**
 * @typedef {object} StepDataSets
 * @property {number} step Current Step
 * @property {SetDataSets} archetypes Archetypes Object
 * @property {number} setcode Aggregated setcode data for the db
 */

module.exports = {};