const { Collection } = require('discord.js');
const { bcExportCards, bcDetails } = require('./buttons');


const interactButton = new Collection([
	['export_cards', bcExportCards],
	['card 0', bcDetails],
	['card 1', bcDetails],
	['card 2', bcDetails],
	['card 3', bcDetails],
	['card 4', bcDetails],
	['card 5', bcDetails],
	['card 6', bcDetails],
	['card 7', bcDetails],
	['card 8', bcDetails],
	['card 9', bcDetails],
]);

module.exports = { button: interactButton };