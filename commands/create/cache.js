/* eslint-disable no-inline-comments */
const { Collection } = require('discord.js');
const { Races, Types, Attributes } = require('./constants');

const CACHE_DATA = 'card data';
const CACHE_CARD = 'card cache';

// general structure of the
// card object injected into db
const cardInitial = {
	// card info
	id: 0,
	// default 32 'custom'
	ot: 32,
	alias: 0,
	setcode: 0,
	type: 0,
	atk: 0,
	// def || link markers
	def: 0,
	// lvl || rating
	lvl: 0,
	race: 0,
	attribute: 0,
	category: 0,
	name: '',
	desc: '',
	temp: {
		cardPEff: '',
		cardDesc: '',
		isPendy: false,
		isLink: false,
		// trap / spell
		isTrell: false,
		stepNo: 0,
	},
};

// memory cache
const infoData = (_cache, card, step) => {
	const { cardName, cardCode, cardPEff, cardDesc } = card;

	const data = {
		step,
		name: cardName,
		id: cardCode,
		temp: {
			cardPEff,
			cardDesc,
		},
	};

	return data;
};


const raceVal = (field) => {
	let val = 0;

	Races.forEach((v, r) => {
		if (field.value === r) {
			return val += v;
		}
	});

	if (val === 0) return 777;
	return val;
};

const typeVal = (field) => {
	let val = 0;

	const fields = field.value.split('\n');
	let isLink = false;

	fields.forEach(t => {
		if (Types.has(t)) {
			if (t === 'Link') isLink = true;
			return val += Types.get(t);
		}
	});

	if (val === 0) return 777;
	return [val, isLink];
};

const attVal = (field) => {
	let val = 0;

	Attributes.forEach((v, a) => {
		if (field.value === a) {
			return val += v;
		}
	});

	if (val === 0) return 777;
	return val;
};

const typeData = (cache, field, step) => {
	const stepCache = getStepCache(cache, step) ?? { step: 2 };
	console.log('step cache in types', stepCache);

	const fields = new Collection([
		['Race', raceVal],
		['Type', typeVal],
		['Attribute', attVal],
	]);

	const data = {};

	fields.forEach((fun, f) => {
		if (field.name === f) {
			const prop = field.name.toLowerCase();
			data[prop] = fun(field);
		}
	});

	return { ...stepCache, ...data };
};


const statData = (cache, stats, step) => {
	console.log('data step 3', cache);
	const [ atk, lvl] = stats;

	let actDef = 0;
	let actLvl = parseInt(lvl.value);

	if (stats.length > 2) {
		const [ ,, def] = stats;
		actDef = parseInt(def.value);
	}

	if (stats.length > 3) {
		const [ ,,, lscale, rscale] = stats;

		const calcLvl = [lscale, rscale, lvl].reduce((acc, s, i) => {
			const { value: v } = s;
			let hex = parseInt(v).toString(16);
			if (i === 0 || i === 1) hex += '0';
			if (i === 2) hex = '00' + hex;
			return acc + hex;
		}, '');

		actLvl = parseInt(calcLvl, 16);
	}

	const data = {
		step,
		atk: parseInt(atk.value),
		def: actDef,
		lvl: actLvl,
	};

	return data;
};


const initializeCache = (cache) => {
	const coll = new Collection();
	const steps = coll.set(0, { step: 0 });
	return cache.set(CACHE_DATA, steps);
};

const setDataCache = (cache, args, step) => {
	if (!cache.has(CACHE_DATA)) initializeCache(cache);
	const cacheCan = cache.get(CACHE_DATA);
	if (!args) cacheCan.set(step, { step });

	const stepColl = new Collection([
		[1, infoData], // id, name, desc
		[2, typeData], // type, race, att
		[3, statData], // atk, def, lvl, lscale, rscale
		// [4, linkData], // link stuff
		// [5, setData], // archetypes
		// [6, strData], // strings
	]);

	const data = stepColl.get(step)(cache, args, step);
	cacheCan.set(step, data);

	return getStepCache(cache, step);
};

const getStepCache = (cache, step) => {
	// return value
	if (cache.has(CACHE_DATA)) {
		const cardColl = cache.get(CACHE_DATA);
		const isCard = cardColl.has(step);
		if (isCard) {
			return cardColl.get(step);
		}
	}

	return undefined;
};


// db cache
const getCardCache = cache => {
	return cache.get(CACHE_CARD);
};

const setCardCache = cache => {
	let cardCache = getCardCache(cache);

	if (!cache.has(CACHE_CARD)) {
		cache.set(CACHE_CARD, cardInitial);
		cardCache = getCardCache(cache);
	}

	const coll = cache.get(CACHE_DATA);
	const data = coll.last();

	if (data.step === 1) {
		const { step, name, id, temp } = data;

		const { cardPEff, cardDesc } = temp;
		const pendy = cardPEff != '' ? true : false;

		const { temp: rest } = cardCache;
		const cardOne = { ...cardCache,
			id,
			name,
			temp: {
				...rest,
				isPendy: pendy,
				stepNo: step,
				cardPEff: cardPEff,
				cardDesc: cardDesc,
			},
		};

		cache.set(CACHE_CARD, cardOne);
	}
	if (data.step === 2) {
		const { step, race, type, attribute } = data;
		const [truType, isLink] = type;

		const { temp: rest } = cardCache;
		const cardTwo = { ...cardCache,
			race,
			type: truType,
			attribute,
			temp: {
				...rest,
				stepNo: step,
				isLink,
			},
		};

		cache.set(CACHE_CARD, cardTwo);
	}
	if (data.step === 3) {
		const { step, atk, def, lvl } = data;

		const { temp: rest } = cardCache;
		const cardThree = { ...cardCache,
			atk,
			def,
			lvl,
			temp: {
				...rest,
				stepNo: step,
			},
		};

		cache.set(CACHE_CARD, cardThree);
	}
	return cache.get(CACHE_CARD);
};

module.exports = {
	setDataCache,
	getStepCache,
	setCardCache,
	getCardCache,
	CACHE_DATA,
};