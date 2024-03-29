// unique id constants
// locations
// operation
// constant

const { Collection } = require('discord.js');

// Discord Emoji IDs
const EMOTE_HATS = '1133616860294823946';
const EMOTE_FACEDOWN = '1133624918488133773';

// bot thumbnail url
const BOT_IMG_URL = 'https://i.imgur.com/ebtLbkK.png';

// buttons
// start
const UID_START = 'start';
const UID_HALT = 'halt';
const UID_VISTA = 'preview';

// modal / buttons
// step 1
const UID_CARD_INFO = 'card info';

const UID_EDIT_STEP1 = 'edit1';
const UID_NEXT_STEP2 = 'step2';

// selections / buttons
// step 2
const UID_CARD_TYPE = 'card type';
const UID_CARD_RACE = 'card race';
const UID_CARD_ATT = 'card att';

const UID_EDIT_STEP2 = 'edit2';
const UID_NEXT_STEP3 = 'step3';

const UID_SPELL_FIRE = 'spell fire';
const UID_TRAP_ACTIVATE = 'trap activate';
const UID_MONSTER_SUMMON = 'monster summon';
const UID_CARD_TOKENIZE = 'tokenize';

// modal / buttons
// step 3
const UID_CARD_STATS = 'card stats';

const UID_EDIT_STEP3 = 'edit3';
const UID_NEXT_STEP4 = 'step4';

// skip to 5
// link stuff
const UID_SKIP = 'no setcard';
// step 4
const UID_NEXT_STEP5 = 'step5';

// archetypes
// selections / buttons
// step 5
const UID_ARCH_ROW1 = 'row1';
const UID_ARCH_ROW2 = 'row2';
const UID_ARCH_ROW3 = 'row3';
const UID_ARCH_ROW4 = 'row4';

const UID_NEXT_STEP6 = 'step6';
const UID_PREV_PAGE = 'prev page';
const UID_NEXT_PAGE = 'next page';
const UID_CLEAR = 'clear arcs';
const UID_ANIME = 'anime';
const UID_NEW_SET = 'new arch';

// step 6 (strings)

// finish line
const UID_FINISH_LINE = 'finish';


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

// 1769488
// 0x1B0010
const TYPES_SPELL = new Collection([
	['Normal', 0x10],
	['Ritual', 0x80],
	['Quickplay', 0x10000],
	['Continuous', 0x20000],
	['Equip', 0x40000],
	['Field', 0x80000],
	['Counter', 0x100000],
	['Link', 0x4000000],
]);

//
const TYPES_TRAP = new Collection([
	['Normal', 0x10],
	['Continuous', 0x20000],
	['Counter', 0x100000],
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

const LinkMarkers = new Collection([
	['↙️', 0x001],
	['⬇️', 0x002],
	['↘️', 0x004],
	['⬅️', 0x008],
	['➡️', 0x020],
	['↖️', 0x040],
	['⬆️', 0x080],
	['↗️', 0x100],
]);

const Archetypes = new Collection([
	['@Ignister', 0x135],
	['Assault Mode', 0x104f],
	['A.I.', 0x136],
	['Abyss', 0xec],
	['Abyss Actor', 0x10ec],
	['Abyss Script', 0x20ec],
	['Abyss-', 0x75],
	['Adamancipator', 0x140],
	['Aesir', 0x4b],
	['Aether', 0xcb],
	['Alien', 0xc],
	['Allure Queen', 0x14],
	['Ally of Justice', 0x1],
	['Altergeist', 0x103],
	['Amazement', 0x15e],
	['Amazoness', 0x4],
	['Amorphage', 0xe0],
	['Ancient Gear', 0x7],
	['Ancient Warriors', 0x137],
	['Apoqliphort', 0x10aa],
	['Appliancer', 0x14a],
	['Aqua', 0xcd],
	['Aquaactress', 0x10cd],
	['Aquarium', 0x20cd],
	['Arcana Force', 0x5],
	['Archfiend', 0x45],
	['Armed Dragon', 0x111],
	['Armor Ninja', 0x102b],
	['Aroma', 0xc9],
	['Artifact', 0x97],
	['Artorigus', 0xa7],
	['Assault Blackwing', 0x1033],
	['Atlantean', 0x77],
	['Attraction', 0x15f],
	['B.E.S.', 0x15],
	['Bamboo Sword', 0x60],
	['Barbaros', 0x13e],
	['Barian', 0x178],
	['Barian\'s', 0x1178],
	['Batteryman', 0x28],
	['Battleguard', 0x2178],
	['Battlewasp', 0x12f],
	['Battlin\' Boxer', 0x84],
	['Beast\'s Battle', 0x4d],
	['Beetrooper', 0x172],
	['Black Luster Soldier', 0x10cf],
	['Blackwing', 0x33],
	['Blaze Accelerator', 0xb9],
	['Blue-Eyes', 0xdd],
	['Bonding -', 0x100],
	['Borrel', 0x10f],
	['Bounzer', 0x6b],
	['Branded', 0x160],
	['Bridge', 0x188],
	['Bujin', 0x88],
	['Burning Abyss', 0xb1],
	['Buster Blader', 0xd7],
	['Butterspy', 0x6a],
	['Byssted', 0x189],
	['Celtic Guard', 0xe4],
	['Change', 0xa5],
	['Chaos', 0xcf],
	['Charmer', 0xbf],
	['Chemicritter', 0xeb],
	['Chronomaly', 0x70],
	['Chrysalis', 0x1e],
	['Cipher', 0xe5],
	['Cipher Dragon', 0x10e5],
	['Clear Wing', 0xff],
	['Cloudian', 0x18],
	['Code Talker', 0x101],
	['Codebreaker', 0x13c],
	['Constellar', 0x53],
	['Crusadia', 0x116],
	['Crystal', 0x34],
	['Crystal Beast', 0x1034],
	['Crystron', 0xea],
	['Cubic', 0xe3],
	['CXyz', 0x1073],
	['Cyber', 0x93],
	['Cyber Dragon', 0x1093],
	['Cyber Angel', 0x2093],
	['Cyberdark', 0x4093],
	['Cybernetic', 0x94],
	['Cynet', 0x118],
	['D/D', 0xaf],
	['D/D/D', 0x10af],
	['Danger!', 0x11e],
	['Dante', 0xd5],
	['Dark World', 0x6],
	['Dark Scorpion', 0x1a],
	['Dark Lucius', 0x4f],
	['Dark Mimic', 0x5e],
	['Dark Magician', 0x10a2],
	['Dark Magician Girl', 0x30a2],
	['Dark Contract', 0xae],
	['Darklord', 0xef],
	['Deskbot', 0xab],
	['Despia', 0x166],
	['Despia', 0x166],
	['Destiny HERO', 0xc008],
	['Destruction Sword', 0xd6],
	['Dinomist', 0xd8],
	['Dinomorphia', 0x175],
	['Dinomorphia', 0x175],
	['Dinowrestler', 0x11a],
	['Djinn', 0x6d],
	['Djinn of Rituals', 0x106d],
	['Dododo', 0x82],
	['Dogmatika', 0x146],
	['Doll Monster', 0x15c],
	['Doodle', 0x186],
	['Doodle Beast', 0x1186],
	['Doodlebook', 0x2186],
	['Dracoslayer', 0xc7],
	['Dracoverlord', 0xda],
	['Dragonmaid', 0x133],
	['Dragunity', 0x29],
	['Dream Mirror', 0x131],
	['Druid', 0x8c],
	['Drytron', 0x151],
	['Dual Avatar', 0x14e],
	['Duston', 0x80],
	['Earthbound Immortal', 0x21],
	['Edge Imp', 0xc3],
	['Elder Entity', 0x20b7],
	['Eldlich', 0x142],
	['Eldlixir', 0x143],
	['Elemental HERO', 0x3008],
	['Elemental Lord', 0x113],
	['Elementsaber', 0x400d],
	['Empowered Warrior', 0xca],
	['Endymion', 0x12a],
	['Entity', 0xb7],
	['Envy', 0x8a],
	['Evil HERO', 0x6008],
	['Evil Eye', 0x129],
	['Evil★Twin', 0x155],
	['Evol', 0x4e],
	['Evolsaur', 0x604e],
	['Evoltile', 0x304e],
	['Evolution Pill', 0x10e],
	['Evolzar', 0x504e],
	['Exodia', 0xde],
	['Exorsister', 0x174],
	['Exosister', 0x174],
	['Eyes Restrict', 0x1110],
	['F.A.', 0x107],
	['Fabled', 0x35],
	['Familiar-Possessed', 0x10c0],
	['Fire Fist', 0x79],
	['Fire Formation', 0x7c],
	['Fire King', 0x81],
	['Fire King Avatar', 0x1081],
	['Fishborg', 0x96],
	['Flamvell', 0x2c],
	['Floowandereeze', 0x16f],
	['Flower Cardian', 0xe6],
	['Fluffal', 0xa9],
	['Flundereeze', 0x16f],
	['Forbidden One', 0x40],
	['Forbidden', 0x11d],
	['Fortune Lady', 0x31],
	['Fortune Fairy', 0x12e],
	['Fossil', 0x14c],
	['Frightfur', 0xad],
	['Frog', 0x12],
	['Fur Hire', 0x114],
	['Fusion Dragon', 0x1046],
	['G Golem', 0x187],
	['Gadget', 0x51],
	['Gagaga', 0x54],
	['Gaia The Fierce Knight', 0xbd],
	['Galaxy', 0x7b],
	['Galaxy-Eyes', 0x107b],
	['Galaxy-Eyes Tachyon Dragon', 0x307b],
	['Gandora', 0xf5],
	['Geargia', 0x72],
	['Geargiano', 0x1072],
	['Gem-', 0x47],
	['Gem-Knight', 0x1047],
	['Generaider', 0x134],
	['Genex', 0x2],
	['Genex Ally', 0x2002],
	['Ghostrick', 0x8d],
	['Gimmick Puppet', 0x83],
	['Gimmick Puppet', 0x1083],
	['Gishki', 0x3a],
	['Gladiator Beast', 0x19],
	['Goblin', 0xac],
	['Gogogo', 0x59],
	['Golden Land', 0x144],
	['Gottoms', 0xb0],
	['Gouki', 0xfc],
	['Gravekeeper\'s', 0x2e],
	['Graydle', 0xd1],
	['Guardian', 0x52],
	['Gunkan', 0x168],
	['Gusto', 0x10],
	['Harpie', 0x64],
	['Hazy', 0x7d],
	['Hazy Flame', 0x107d],
	['Heraldic Beast', 0x76],
	['Heraldry', 0x92],
	['HERO', 0x8],
	['Heroic', 0x6f],
	['Heroic Challenger', 0x106f],
	['Heroic Champion', 0x206f],
	['Hieratic', 0x69],
	['Hole', 0x89],
	['Horus the Black Flame Dragon', 0x3],
	['Hyperion', 0x171],
	['Ice Barrier', 0x2f],
	['Icejade', 0x16e],
	['Igknight', 0xc8],
	['Impcantation', 0x117],
	['Infernity', 0xb],
	['Infernoid', 0xbb],
	['Infestation', 0x65],
	['Infinitrack', 0x127],
	['Inmato', 0x5b],
	['Invoked', 0xf4],
	['Inzektor', 0x56],
	['Iron Chain', 0x25],
	['Iron', 0x67],
	['Jinzo', 0xbc],
	['Junk', 0x43],
	['Jurrac', 0x22],
	['Kaiju', 0xd3],
	['Kairyu-Shin', 0x179],
	['Karakuri', 0x11],
	['Ki-sikil', 0x153],
	['Knightmare', 0x112],
	['Koa\'ki Meiru', 0x1d],
	['Kozmo', 0xd2],
	['Kragen', 0x16a],
	['Krawler', 0x104],
	['Kshatri-La', 0x18a],
	['Kuriboh', 0xa4],
	['Labrynth', 0x17f],
	['Lady of Lament', 0x176],
	['Laundsallyn', 0xa8],
	['Laval', 0x39],
	['Legendary Knight', 0xa0],
	['Legendary Dragon', 0xa1],
	['Libromancer', 0x17d],
	['Lightray', 0x6c],
	['Lightsworn', 0x38],
	['Lil-la', 0x154],
	['Live☆Twin', 0x156],
	['lswarm', 0xa],
	['Lunalight', 0xdf],
	['LV', 0x41],
	['Lyrilusc', 0xf7],
	['Machina', 0x36],
	['Machine Angel', 0x124],
	['Madolche', 0x71],
	['Magical Musket', 0x108],
	['Magician', 0x98],
	['Magician', 0xa2],
	['Magician Girl', 0x20a2],
	['Magikey', 0x167],
	['Magistus', 0x152],
	['Magna Warrior', 0xe9],
	['Magnet Warrior', 0x2066],
	['Majespecter', 0xd0],
	['Majestic', 0x3f],
	['Malefic', 0x23],
	['Malicevorous', 0x8b],
	['Marincess', 0x12b],
	['Masked HERO', 0xa008],
	['Materiactor', 0x162],
	['Mathmech', 0x132],
	['Mayakashi', 0x121],
	['Mecha Phantom Beast', 0x101b],
	['Megalith', 0x138],
	['Mekk-Knight', 0x10c],
	['Meklord', 0x13],
	['Meklord Emperor', 0x3013],
	['Meklord Army', 0x6013],
	['Meklord Astro', 0x9013],
	['Melffy', 0x147],
	['Melodious', 0x9b],
	['Melodious Maestra', 0x109b],
	['Mermail', 0x74],
	['Metalfoes', 0xe1],
	['Metaphys', 0x105],
	['Mist Valley', 0x37],
	['Mokey Mokey', 0x184],
	['Monarch', 0xbe],
	['Morphtronic', 0x26],
	['Mystic Swordsman', 0x5f],
	['Mystical Beast of the Forest', 0x1169],
	['Mystical Spirit of the Forest', 0x2169],
	['Mythical Beast', 0x10d],
	['Myutant', 0x159],
	['Naturia', 0x2a],
	['Necrovalley', 0x91],
	['Nekroz', 0xb4],
	['Nemeses', 0x13d],
	['Neo-Spacian', 0x1f],
	['Neos', 0x9],
	['Nephthys', 0x11f],
	['Nimble', 0x78],
	['Ninja', 0x2b],
	['Ninjitsu Art', 0x61],
	['Nitro', 0x2d],
	['Noble', 0x7a],
	['Noble Knight', 0x107a],
	['Noble Arms', 0x207a],
	['Nordic', 0x42],
	['Nordic Ascendant', 0x3042],
	['Nordic Beast', 0x6042],
	['Nordic Alfar', 0xa042],
	['Nordic Relic', 0x5042],
	['Number', 0x48],
	['Number C', 0x1048],
	['Number C39', 0x5048],
	['Number', 0x16c],
	['Number', 0x16c],
	['Numeron', 0x14b],
	['Numeron Gate', 0x114b],
	['Numeronius', 0x16b],
	['Numerounius', 0x16b],
	['Odd-Eyes', 0x99],
	['of the Forest', 0x169],
	['Ogdoadic', 0x163],
	['Ojama', 0xf],
	['Old Entity', 0x40b7],
	['Onomat', 0x139],
	['Orcust', 0x11b],
	['Outer Entity', 0x10b7],
	['P.U.N.K.', 0x173],
	['Paleozoic', 0xd4],
	['Palladium', 0x13a],
	['Parshath', 0x10a],
	['Pendulum', 0xf2],
	['Pendulum Dragon', 0x10f2],
	['Pendulumgraph', 0x20f2],
	['Penguin', 0x5a],
	['Performage', 0xc6],
	['Performapal', 0x9f],
	['Phantasm Spiral', 0xfa],
	['Phantasm', 0x145],
	['Phantom Beast', 0x1b],
	['Phantom Knights', 0xdb],
	['Photon', 0x55],
	['Plunder Patroll', 0x13f],
	['Polymerization|Fusion', 0x46],
	['Possessed', 0xc0],
	['Potan', 0x148],
	['Power Tool', 0xc2],
	['Prank-Kids', 0x120],
	['Predap', 0xf3],
	['Predaplant', 0x10f3],
	['Prediction Princess', 0xcc],
	['Prophecy', 0x6e],
	['PSY-Frame', 0xc1],
	['PSY-Framegear', 0x10c1],
	['Puppet', 0x83],
	['Qli', 0xaa],
	['R-Genex', 0x1002],
	['Raidraptor', 0xba],
	['Rank-Down-Magic', 0x15d],
	['Rank-Up-Magic', 0x95],
	['Reactor', 0x63],
	['Rebellion', 0x13b],
	['Red Dragon Archfiend', 0x1045],
	['Red-Eyes', 0x3b],
	['Relinquished', 0x110],
	['Reptilianne', 0x3c],
	['Resonator', 0x57],
	['Rikka', 0x141],
	['Ritual Beast', 0xb5],
	['Ritual Beast Tamer', 0x10b5],
	['Ritual Beast Ulti-', 0x40b5],
	['roid', 0x16],
	['Rokket', 0x102],
	['Roland', 0x149],
	['Rose', 0x123],
	['Rose Dragon', 0x1123],
	['Runick', 0x180],
	['S-Force', 0x15a],
	['Saber', 0xd],
	['Salamangreat', 0x119],
	['Scareclaw', 0x17c],
	['Scrap', 0x24],
	['Sea Stealth', 0x17a],
	['Secret Six Samurai', 0x103d],
	['Seven Emperors', 0x177],
	['Seventh', 0x177],
	['Shaddoll', 0x9d],
	['Shien', 0x20],
	['Shiranui', 0xd9],
	['Shiranui Spectralsword', 0x10d9],
	['Silent Swordsman', 0xe7],
	['Silent Magician', 0xe8],
	['Simorgh', 0x12d],
	['Six Samurai', 0x3d],
	['Sky Striker', 0x115],
	['Sky Striker Ace', 0x1115],
	['Skyblaster', 0x49],
	['Skyscraper', 0xf6],
	['Smile', 0x125],
	['Solfachord', 0x164],
	['Solfachord', 0x164],
	['Speedroid', 0x2016],
	['Spellbook', 0x106e],
	['Sphinx', 0x5c],
	['Spirit Message', 0x1c],
	['Spiritual Beast', 0x20b5],
	['Spiritual Beast Tamer', 0x30b5],
	['Spiritual Art', 0x14d],
	['Spiritual Earth Art', 0x314d],
	['Spiritual Fire Art', 0x514d],
	['Spiritual Water Art', 0x614d],
	['Spiritual Wind Art', 0xa14d],
	['Splight', 0x181],
	['Springans', 0x158],
	['sprout', 0xa6],
	['SPYRAL', 0xee],
	['SPYRAL GEAR', 0x10ee],
	['SPYRAL MISSION', 0x20ee],
	['Star Seraph', 0x86],
	['Stardust', 0xa3],
	['Starry Knight', 0x15b],
	['Starving Venom', 0x1050],
	['Stealth Kragen', 0x16a],
	['Steelswarm', 0x100a],
	['Stellarknight', 0x109c],
	['Subterror', 0xed],
	['Subterror Behemoth', 0x10ed],
	['Sun', 0x157],
	['Sunavalon', 0x1157],
	['Sunseed', 0x4157],
	['Sunvine', 0x2157],
	['Super Defense Robot', 0x85],
	['Super Quant', 0xdc],
	['Super Quantum', 0x10dc],
	['Super Quantal Mech Beast', 0x20dc],
	['Superheavy Samurai', 0x9a],
	['Superheavy Samurai Soul', 0x109a],
	['Supreme King', 0xf8],
	['Supreme King Gate', 0x10f8],
	['Supreme King Dragon', 0x20f8],
	['Suship', 0x168],
	['Swordsoul', 0x16d],
	['Sylvan', 0x90],
	['Symphonic Warrior', 0x1066],
	['Synchro', 0x17],
	['Synchro Dragon', 0x2017],
	['Synchron', 0x1017],
	['T.G.', 0x27],
	['Tearalaments', 0x182],
	['tellarknight', 0x9c],
	['Tenyi', 0x12c],
	['The Agent', 0x44],
	['The Phantom Knights', 0x10db],
	['The Weather', 0x109],
	['Therion', 0x17b],
	['Therions', 0x17b],
	['Thunder Dragon', 0x11c],
	['Time Thief', 0x126],
	['Timelord', 0x4a],
	['Tin', 0x68],
	['Tindangle', 0x10b],
	['Toon', 0x62],
	['Topologic', 0x170],
	['Trap Hole', 0x4c],
	['Traptrix', 0x108a],
	['Tri-Brigade', 0x14f],
	['Triamid', 0xe2],
	['Trickstar', 0xfb],
	['U.A.', 0xb2],
	['Ultimate Crystal', 0x2034],
	['Ultimate Insect', 0x5d],
	['Umbral Horror', 0x87],
	['Unchained', 0x130],
	['Unchained Soul', 0x1130],
	['Ursarctic', 0x165],
	['Utopia', 0x107f],
	['Utopic', 0x7f],
	['Utopic Future', 0x207f],
	['Valkyrie', 0x122],
	['Vampire', 0x8e],
	['Vaylantz', 0x17e],
	['Vehicroid', 0x1016],
	['Vendread', 0x106],
	['Venom', 0x50],
	['Vernalizer Fairy', 0x183],
	['Virtual World', 0x150],
	['Virtual World Gate', 0x1150],
	['Vision HERO', 0x5008],
	['Void', 0xc5],
	['Volcanic', 0x32],
	['Vylon', 0x30],
	['War Rock', 0x161],
	['Warrior', 0x66],
	['Watt', 0xe],
	['Welcome Labrynth', 0x117f],
	['Wind-Up', 0x58],
	['Windwitch', 0xf0],
	['Winged Kuriboh', 0x10a4],
	['Wingman', 0x185],
	['Witchcrafter', 0x128],
	['World Chalice', 0xfd],
	['World Legacy', 0xfe],
	['Worm', 0x3e],
	['X-Saber', 0x100d],
	['XX-Saber', 0x300d],
	['Xyz', 0x73],
	['Xyz Dragon', 0x2073],
	['Yang Zing', 0x9e],
	['Yosenju', 0xb3],
	['Zefra', 0xc4],
	['Zexal', 0x7e],
	['Zoodiac', 0xf1],
	['ZS -', 0x207e],
	['Zubaba', 0x8f],
	['ZW -', 0x107e],
	['True Draco|True King', 0xf9],
]);


// assets
const Templates = new Collection([
	['Normal', 'assets/card-normal.png'],
	['Pendulum', 'assets/card-normal-pendulum.png'],
]);

const PNG_Attributes = new Collection([
	['DARK', 'assets/dark.png'],
]);

module.exports = {
	Races,
	Types,
	TYPES_SPELL,
	TYPES_TRAP,
	EMOTE_FACEDOWN,
	EMOTE_HATS,
	Attributes,
	Archetypes,
	LinkMarkers,
	Templates,
	PNG_Attributes,
	BOT_IMG_URL,
	UID_START,
	UID_HALT,
	UID_VISTA,
	UID_CARD_INFO,
	UID_CARD_STATS,
	UID_EDIT_STEP1,
	UID_NEXT_STEP2,
	UID_CARD_TYPE,
	UID_CARD_RACE,
	UID_CARD_ATT,
	UID_SPELL_FIRE,
	UID_TRAP_ACTIVATE,
	UID_MONSTER_SUMMON,
	UID_CARD_TOKENIZE,
	UID_EDIT_STEP2,
	UID_NEXT_STEP3,
	UID_EDIT_STEP3,
	UID_NEXT_STEP4,
	UID_SKIP,
	UID_NEXT_STEP5,
	UID_NEXT_STEP6,
	UID_ARCH_ROW1,
	UID_ARCH_ROW2,
	UID_ARCH_ROW3,
	UID_ARCH_ROW4,
	UID_ANIME,
	UID_NEW_SET,
	UID_PREV_PAGE,
	UID_NEXT_PAGE,
	UID_CLEAR,
	UID_FINISH_LINE,
};