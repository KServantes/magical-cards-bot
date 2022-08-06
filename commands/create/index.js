const { Collection } = require('discord.js');
const { cardInfoSubmit, cardStatsSubmit } = require('./modal');
const { selectionType, selectionRace, selectionAtt, selectionArch } = require('./selections');
const { bcStart, bcHalt, bcEdit, bcNext, bcEdit2,
	bcNext3, bcEdit3, bcNext4, LinkButtons, bcNext5, nextPage, prevPage } = require('./buttons');


const { UID_START, UID_HALT, UID_CARD_INFO, UID_EDIT_STEP1,
	UID_NEXT_STEP2, UID_EDIT_STEP2, UID_NEXT_STEP3, UID_CARD_STATS,
	UID_EDIT_STEP3, UID_CARD_ATT, UID_CARD_RACE, UID_CARD_TYPE,
	UID_NEXT_STEP4,
} = require('./constants');

const interactButton = new Collection([
	// start
	[UID_START, bcStart],
	[UID_HALT, bcHalt],

	// step 1
	[UID_EDIT_STEP1, bcEdit],
	[UID_NEXT_STEP2, bcNext],

	// step 2
	[UID_EDIT_STEP2, bcEdit2],
	[UID_NEXT_STEP3, bcNext3],

	// step 3
	[UID_EDIT_STEP3, bcEdit3],
	[UID_NEXT_STEP4, bcNext4],

	// link btn
	['↖️', LinkButtons],
	['⬆️', LinkButtons],
	['↗️', LinkButtons],
	['⬅️', LinkButtons],
	['🔵', LinkButtons],
	['➡️', LinkButtons],
	['↙️', LinkButtons],
	['⬇️', LinkButtons],
	['↘️', LinkButtons],

	// step 5
	['step5', bcNext5],
	['next page', nextPage],
	['prev page', prevPage],
]);

const interactModalSubmit = new Collection([
	// step 1
	[UID_CARD_INFO, cardInfoSubmit],

	// step 3
	[UID_CARD_STATS, cardStatsSubmit],
]);

const interactSelectMenu = new Collection([
	// step 2
	[UID_CARD_TYPE, selectionType],
	[UID_CARD_RACE, selectionRace],
	[UID_CARD_ATT, selectionAtt],

	// step 5 'archetypes'
	['row1', selectionArch],
	['row2', selectionArch],
	['row3', selectionArch],
	['row4', selectionArch],
]);


module.exports = {
	button: interactButton,
	modalSubmit: interactModalSubmit,
	selectMenu: interactSelectMenu,
};