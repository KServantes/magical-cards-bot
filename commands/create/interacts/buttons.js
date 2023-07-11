// step00 start form.info
const { bcStart, bcHalt, bcPreview } = require('./buttons/step00');
// step 01 types (type, race, att)
const { bcNext, bcEdit, bcSpellTrap } = require('./buttons/step01');
// step 2 edit
const bcEdit2 = bcNext;
// step 02 stats form.stats
const { bcNext3 } = require('./buttons/step02');
// step 03 link or archetypes
const { bcEdit3, bcNext4, LinkButtons } = require('./buttons/step03');
// step 04 archetypes
const { bcNext5, nextPage, prevPage, clearFields } = require('./buttons/step04');
// step 05 strings
const { bcNext6, Strings } = require('./buttons/step05');
// step_final
const { bcFinish } = require('./buttons/step_final');

module.exports = {
	bcStart,
	bcHalt,
	bcEdit,
	bcNext,
	bcPreview,
	bcSpellTrap,
	bcEdit2,
	bcNext3,
	bcEdit3,
	bcNext4,
	bcNext5,
	bcNext6,
	nextPage,
	prevPage,
	clearFields,
	bcFinish,
	Strings,
	LinkButtons,
};