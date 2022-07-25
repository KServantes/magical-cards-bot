const { Collection } = require('discord.js');

const CACHE_CURR_CARD = 'card cache';
const CACHE_CARD = 'card object';

// memory cache
const stepOneData = (card, step) => {
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

	const races = new Map([
		['Warrior', 0x1],
		['Zombie', 0x10],
	]);

	races.forEach((v, r) => {
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

	const types = new Map([
		['Monster', 0x1],
		['Effect', 0x20],
		['Normal', 0x10],
	]);

	fields.forEach(t => {
		if (types.has(t)) {
			return val += types.get(t);
		}
	});

	if (val === 0) return 777;
	return val;
};

const attVal = (field) => {
	let val = 0;

	const attributes = new Map([
		['DARK', 0x20],
	]);

	attributes.forEach((v, a) => {
		if (field.value === a) {
			return val += v;
		}
	});

	if (val === 0) return 777;
	return val;
};

const stepTwoData = (field, cache) => {
	const fields = new Map([
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

	return { ...cache, ...data };
};

const initializeCache = (cache) => {
	const coll = new Collection();
	const steps = coll.set(1, {});
	return cache.set(CACHE_CURR_CARD, steps);
};

const setCache = (cache, args, step) => {
	if (!cache.has(CACHE_CURR_CARD)) initializeCache(cache);
	const cacheCan = cache.get(CACHE_CURR_CARD);

	let data = { step: 0 };

	if (step === 1) {
		data = stepOneData(args, step);
		cacheCan.set(step, data);
	}
	if (step === 2) {
		const stepCache = cacheCan.get(step);
		data = stepTwoData(args, stepCache);
		data.step = 2;
		cacheCan.set(step, data);
	}

	return getCache(cache, step);
};

const getCache = (cache, step) => {
	// return value
	if (cache.has(CACHE_CURR_CARD)) {
		const cardColl = cache.get(CACHE_CURR_CARD);
		const isCard = cardColl.has(step);
		if (isCard) {
			return cardColl.get(step);
		}
	}

	return undefined;
};


// db cache
const cardInitial = {
	id: 0,
	ot: 32,
	alias: 0,
	setcode: 0,
	type: 0,
	atk: 0,
	def: 0,
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
		stepNo: 0,
	},
};

const getCardCache = cache => {
	return cache.get(CACHE_CARD);
};

const setCardCache = cache => {
	let cardCache = getCardCache(cache);

	if (!cache.has(CACHE_CARD)) {
		cache.set(CACHE_CARD, cardInitial);
		cardCache = getCardCache(cache);
	}

	// data:
	//  {
	//      step : 1,
	//      name: '',
	//      id: 0,
	//      temp: {
	//          cardPEff: '',
	//          cardDesc: '',
	//      }
	//  }

	const cardColl = cache.get(CACHE_CURR_CARD);

	cardColl.each(data => {
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

			return cache.set(CACHE_CARD, cardOne);
		}
	});

	return getCardCache(cache);
};

module.exports = {
	setCache,
	getCache,
	setCardCache,
	CACHE_CURR_CARD,
};