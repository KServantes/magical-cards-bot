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

const initializeCache = (cache) => {
	const coll = new Collection();
	const steps = coll.set(1, {});
	return cache.set(CACHE_CURR_CARD, steps);
};

const setCache = (cache, card, step) => {
	if (!cache.has(CACHE_CURR_CARD)) initializeCache(cache);

	let data = { step: 0 };

	if (step === 1) {
		data = stepOneData(card, step);
	}
	// set cache data [1, card]
	const cardData = cache.get(CACHE_CURR_CARD).set(step, data);

	return cardData;
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