const { cardInfoSubmit, cardStatsSubmit } = require('./modal');
const { bcStart, bcHalt, bcEdit, bcNext, bcEdit2, bcNextSp3, bcEdit3 } = require('./buttons');
const { selectionType, selectionRace, selectionAtt } = require('./selections');

const interactButton = new Map([
	['start', bcStart],
	['halt', bcHalt],
	['edit1', bcEdit],
	['step2', bcNext],
	['edit2', bcEdit2],
	['step3', bcNextSp3],
	['edit3', bcEdit3],
]);

const interactModalSubmit = new Map([
	['card info', cardInfoSubmit],
	['card stats', cardStatsSubmit],
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