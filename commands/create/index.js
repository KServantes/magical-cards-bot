const { Collection } = require('discord.js');
const { ModularWrapper } = require('./utils');
const { cardInfoSubmit, cardStatsSubmit } = require('./interacts/modal');

const { selectionType, selectionRace, selectionAtt, selectionArch } = require('./interacts/selections');

const { bcStart, bcHalt, bcEdit, bcNext, bcEdit2,
	bcNext3, bcEdit3, bcNext4, LinkButtons, bcNext5, bcSpell,
	nextPage, prevPage, bcNext6, Strings, bcFinish, clearFields, bcPreview,
} = ModularWrapper(require('./interacts/buttons'));

const { UID_START, UID_HALT, UID_CARD_INFO, UID_EDIT_STEP1,
	UID_NEXT_STEP2, UID_EDIT_STEP2, UID_NEXT_STEP3, UID_CARD_STATS,
	UID_EDIT_STEP3, UID_CARD_ATT, UID_CARD_RACE, UID_CARD_TYPE,
	UID_NEXT_STEP4, UID_NEXT_STEP5, UID_ANIME, UID_ARCH_ROW1,
	UID_ARCH_ROW2, UID_ARCH_ROW3, UID_ARCH_ROW4, UID_NEW_SET,
	UID_NEXT_PAGE, UID_NEXT_STEP6, UID_PREV_PAGE, UID_SKIP, UID_FINISH_LINE,
	UID_CLEAR, UID_VISTA, UID_CARD_TOKENIZE, UID_MONSTER_SUMMON, UID_SPELL_FIRE,
	UID_TRAP_ACTIVATE,
} = require('./utils/constants');

const interactButton = new Collection([
	// start
	[UID_START, bcStart],
	[UID_HALT, bcHalt],
	[UID_VISTA, bcPreview],

	// step 1
	[UID_EDIT_STEP1, bcEdit],
	[UID_NEXT_STEP2, bcNext],
	[UID_SPELL_FIRE, bcSpell],

	// step 2
	[UID_EDIT_STEP2, bcEdit2],
	[UID_NEXT_STEP3, bcNext3],

	// step 3
	[UID_EDIT_STEP3, bcEdit3],
	[UID_NEXT_STEP4, bcNext4],

	// step 4
	// skip btn
	[UID_SKIP, bcNext6],

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
	[UID_NEXT_STEP5, bcNext5],
	[UID_NEXT_PAGE, nextPage],
	[UID_PREV_PAGE, prevPage],
	[UID_CLEAR, clearFields],

	// step 6
	[UID_NEXT_STEP6, bcNext6],

	// add strings
	['add one', Strings],
	['add two', Strings],
	['add three', Strings],
	['add four', Strings],
	['add five', Strings],

	// finish
	[UID_FINISH_LINE, bcFinish],
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
	[UID_ARCH_ROW1, selectionArch],
	[UID_ARCH_ROW2, selectionArch],
	[UID_ARCH_ROW3, selectionArch],
	[UID_ARCH_ROW4, selectionArch],
]);

module.exports = {
	button: interactButton,
	modalSubmit: interactModalSubmit,
	selectMenu: interactSelectMenu,
};