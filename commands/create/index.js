const { cardInfoSubmit } = require('./modal');
const { bcStart, bcHalt, bcEdit, bcNext, bcEdit2 } = require('./buttons');
const { selectionType, selectionRace, selectionAtt } = require('./selections');

const interactButton = new Map([
	['start', bcStart],
	['halt', bcHalt],
	['edit1', bcEdit],
	['step2', bcNext],
	['edit2', bcEdit2],
]);

const interactModalSubmit = new Map([
	['card info', cardInfoSubmit],
]);

const interactSelectMenu = new Map([
	['card type', selectionType],
	['card race', selectionRace],
	['card att', selectionAtt],
]);


module.exports = {
	button: interactButton,
	modalSubmit: interactModalSubmit,
	selectMenu: interactSelectMenu,
};