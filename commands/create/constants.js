// unique id constants
// locations
// operation
// constant

const { Collection } = require('discord.js');

// buttons
// start
const UID_START = 'start';
const UID_HALT = 'halt';

// modal
// step 1
const UID_CARD_INFO = 'card info';

const UID_EDIT_STEP1 = 'edit1';
const UID_NEXT_STEP2 = 'step2';

// selections
// step 2
const UID_CARD_TYPE = 'card type';
const UID_CARD_RACE = 'card race';
const UID_CARD_ATT = 'card att';

const UID_EDIT_STEP2 = 'edit2';
const UID_NEXT_STEP3 = 'step3';

// modal
// step 3
const UID_CARD_STATS = 'card stats';

const UID_EDIT_STEP3 = 'edit3';
const UID_NEXT_STEP4 = 'step4';

// card stat maps
const Races = new Collection([
	['Warrior', 0x1],
	['Spellcaster', 0x2],
	['Fairy', 0x4],
	['Fiend', 0x8],
	['Zombie', 0x10],
	['Machine', 0x20],
	['Aqua', 0x40],
	['Pyro', 0x80],
	['Rock', 0x100],
	['Winged Beast', 0x200],
	['Plant', 0x400],
	['Insect', 0x800],
	['Thunder', 0x1000],
	['Dragon', 0x2000],
	['Beast', 0x4000],
	['Beast Warrior', 0x8000],
	['Dinosaur', 0x10000],
	['Fish', 0x20000],
	['Sea Serpent', 0x40000],
	['Reptile', 0x80000],
	['Psychic', 0x100000],
	['Divine', 0x200000],
	['Creator God', 0x400000],
	['Wyrm', 0x800000],
	['Cyberse', 0x1000000],
]);

const Types = new Collection([
	['Monster', 0x1],
	['Spell', 0x2],
	['Trap', 0x4],
	['Normal', 0x10],
	['Effect', 0x20],
	['Fusion', 0x40],
	['Ritual', 0x80],
	['Trap Monster', 0x100],
	['Spirit', 0x200],
	['Union', 0x400],
	['Gemini', 0x800],
	['Tuner', 0x1000],
	['Synchro', 0x2000],
	['Token', 0x4000],
	['Quickplay', 0x10000],
	['Continuous', 0x20000],
	['Equip', 0x40000],
	['Field', 0x80000],
	['Counter', 0x100000],
	['Flip', 0x200000],
	['Toon', 0x400000],
	['Xyz', 0x800000],
	['Pendulum', 0x1000000],
	// ['SPSUMMON', 0x2000000],?
	['Link', 0x4000000],
]);

const Attributes = new Collection([
	['EARTH ', 0x01],
	['WATER ', 0x02],
	['FIRE  ', 0x04],
	['WIND  ', 0x08],
	['LIGHT ', 0x10],
	['DARK  ', 0x20],
	['DIVINE', 0x40],
]);

module.exports = {
	Races,
	Types,
	Attributes,
	UID_START,
	UID_HALT,
	UID_CARD_INFO,
	UID_CARD_STATS,
	UID_EDIT_STEP1,
	UID_NEXT_STEP2,
	UID_CARD_TYPE,
	UID_CARD_RACE,
	UID_CARD_ATT,
	UID_EDIT_STEP2,
	UID_NEXT_STEP3,
	UID_EDIT_STEP3,
	UID_NEXT_STEP4,
};