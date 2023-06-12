/**
 * @typedef {Object} TempObject
 * @property {string} cardPEff
 * @property {string} cardDesc
 * @property {boolean} isPendy
 * @property {boolean} isLink
 * @property {boolean} isTrell
 * @property {number} stepNo
 */

/**
 * @typedef {Object} CardCache
 * @property {number} id
 * @property {number} ot
 * @property {number} alias
 * @property {number} setcode
 * @property {number} type
 * @property {number} atk
 * @property {number} def
 * @property {number} level
 * @property {number} race
 * @property {number} attribute
 * @property {number} category
 * @property {string} name
 * @property {string} desc
 * @property {TempObject} temp
 */

/**
 * @typedef {Object} MemberInfo
 * @property {string} name
 * @property {string} avatar
 * @property {string} iconURL
 * @property {string} username
 * @property {boolean} preview
 * @property {Collection.<number,object>} apps
 * @property {number} current
 * @property {number} currentOf
 * @property {boolean} showPreview
 * @property {Collection.<number,object} newApp
 * @property {object} appInfo
 */

/**
 * @typedef {Object} PageInfo
 * @property {number} page
 * @property {Collection} set
 * @property {boolean} prefill
 * @property {boolean} wipe
 * @property {Collection} switchSet
 * @property {number} pageOf
 */

module.exports = {};