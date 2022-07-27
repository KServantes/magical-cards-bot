const { cardInfoSubmit, cardStatsSubmit } = require('./modal');
const { bcStart, bcHalt, bcEdit, bcNext, bcEdit2, bcNext3, bcEdit3 } = require('./buttons');
const { selectionType, selectionRace, selectionAtt } = require('./selections');

const { UID_START, UID_HALT, UID_CARD_INFO, UID_EDIT_STEP1,
	UID_NEXT_STEP2, UID_EDIT_STEP2, UID_NEXT_STEP3, UID_CARD_STATS,
	UID_EDIT_STEP3, UID_CARD_ATT, UID_CARD_RACE, UID_CARD_TYPE,
} = require('./constants');

const interactButton = new Map([
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
]);

const interactModalSubmit = new Map([
	// step 1
	[UID_CARD_INFO, cardInfoSubmit],

	// step 3
	[UID_CARD_STATS, cardStatsSubmit],
]);

const interactSelectMenu = new Map([
	// step 2
	[UID_CARD_TYPE, selectionType],
	[UID_CARD_RACE, selectionRace],
	[UID_CARD_ATT, selectionAtt],
]);


module.exports = {
	button: interactButton,
	modalSubmit: interactModalSubmit,
	selectMenu: interactSelectMenu,
};