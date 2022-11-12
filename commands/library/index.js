const { Collection } = require('discord.js');
const { bcDetails, bcNextPage, bcPrevPage } = require('./buttons');


const interactButton = new Collection([
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
	['lib next page', bcNextPage],
	['lib prev page', bcPrevPage],
]);

module.exports = { button: interactButton };