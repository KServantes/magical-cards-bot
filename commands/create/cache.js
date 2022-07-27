const { Collection } = require('discord.js');
const { Races, Types, Attributes } = require('./constants');

const CACHE_DATA = 'card data';
const CACHE_CARD = 'card cache';


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

	fields.forEach(t => {
		if (Types.has(t)) {
			return val += Types.get(t);
		}
	});

	if (val === 0) return 777;
	return val;
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

const stepTwoData = (field, stepCache) => {
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


const initializeCache = (cache) => {
	const coll = new Collection();
	const steps = coll.set(1, {});
	return cache.set(CACHE_DATA, steps);
};

const setDataCache = (cache, args, step) => {
	if (!cache.has(CACHE_DATA)) initializeCache(cache);
	const cacheCan = cache.get(CACHE_DATA);

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
	if (step === 3) {
		// data = stepThreeData(args)
	}

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

		const { temp: rest } = cardCache;
		const cardTwo = { ...cardCache,
			race,
			type,
			attribute,
			temp: {
				...rest,
				stepNo: step,
			},
		};

		cache.set(CACHE_CARD, cardTwo);
	}

	// await cardColl.each(data => {
	// 	if (data.step === 1) {
	// 		const { step, name, id, temp } = data;

	// 		const { cardPEff, cardDesc } = temp;
	// 		const pendy = cardPEff != '' ? true : false;

	// 		const { temp: rest } = cardCache;
	// 		const cardOne = { ...cardCache,
	// 			id,
	// 			name,
	// 			temp: {
	// 				...rest,
	// 				isPendy: pendy,
	// 				stepNo: step,
	// 				cardPEff: cardPEff,
	// 				cardDesc: cardDesc,
	// 			},
	// 		};

	// 		cardCache = cardOne;
	// 	}
	// 	if (data.step === 2) {
	// 		const { step, race, type, attribute } = data;

	// 		const { temp: rest } = cardCache;
	// 		const cardTwo = { ...cardCache,
	// 			race,
	// 			type,
	// 			attribute,
	// 			temp: {
	// 				...rest,
	// 				stepNo: step,
	// 			},
	// 		};

	// 		cardCache = cardTwo;
	// 	}
	// });

	return cache.get(CACHE_CARD);
};

module.exports = {
	setDataCache,
	getStepCache,
	setCardCache,
	CACHE_DATA,
};