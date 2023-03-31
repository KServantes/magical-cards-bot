/* eslint-disable no-inline-comments */
// eslint-disable-next-line no-unused-vars
const { Collection, GuildMember } = require('discord.js');
const { Races, Types, Attributes, Archetypes, LinkMarkers } = require('./constants');

const CACHE_MEMBER = 'member cache';


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
	level: 0,
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

const setColl = new Collection([ ['tcg', Archetypes] ]);

const pageInfo = {
	page: 1,
	set: Archetypes,
	prefill: false,
	wipe: false,
	// sets: ['tcg', 'anime', 'custom'],
	/**
		 * @param {string} set
		 */
	set switchSet(set) {
		this.set = setColl.get(set);
	},
	/**
	 * @param {number} p
	 */
	set pageOf(p) {
		this.page = p;
	},
};

/**
 * app cache
 *
 * Create member info object.
 *
 * @param {GuildMember} member
 */
const createMemberInfo = member => {
	const { nickname, user } = member;
	const { username, avatar } = user;


	const memberInfo = {
		name: nickname ?? username,
		avatar,
		iconURL: user.displayAvatarURL({ dynamic: true }),
		username,
		apps: new Collection(),
		current: 1,
		/**
		 * @param {number} x
		 */
		set currentOf(x) {
			this.current = x;
		},
		/**
		 * @param {object} data
		 */
		set newApp(data) {
			this.apps.set(this.current, data);
		},
		get appInfo() {
			return this.apps.get(this.current);
		},
	};

	return memberInfo;
};

/**
 * @param {Collection} cache
 * @returns {Collection}
 */
const getMemberCache = cache => {
	if (!cache.get(CACHE_MEMBER)) {
		const Members = new Collection();

		return cache.set(CACHE_MEMBER, Members);
	}

	return cache.get(CACHE_MEMBER);
};

/**
 * @param {Collection} cache
 * @param {GuildMember} member
 * @returns {object}
 */
const getMemberInfo = (cache, member) => {
	const memberCache = getMemberCache(cache);
	const info = memberCache.get(member.id);

	if (!info) {
		const newInfo = setMemberInfo(cache, member);

		return newInfo;
	}

	return info;
};

/**
 * @param {Collection} cache
 * @param {GuildMember} member
 * @returns {object}
 */
const setMemberInfo = (cache, member) => {
	const memberInfo = createMemberInfo(member);

	const memberCache = getMemberCache(cache, member);

	const memberColl = memberCache.set(member.id, memberInfo);
	const memInfo = memberColl.get(member.id);

	return memInfo;
};

/**
 * @param {Collection} cache
 * @param {GuildMember} member
 */
const setAppCache = (cache, member) => {
	const { id, name, icon, preferredLocale: locale } = member.guild;

	const memInfo = getMemberInfo(cache, member);
	const serverInfo = {
		id,
		name,
		icon,
		locale,
	};

	const Data = new Collection();
	const Steps = Data.set(0, { step: 0 });

	return memInfo.newApp = {
		data: Steps,
		card: cardInitial,
		server: serverInfo,
		page: pageInfo,
	};
};

// memory cache
/**
 * @param {Collection} [_cache]
 * @param {object} card
 * @param {number} step
 */
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
// type functions (3)
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

/**
 * @param {object} cacheCan recursive data object
 * @param {string} field
 * @param {number} step
 * @returns {object}
 */
const typeData = (cacheCan, field, step) => {
	const stepCache = cacheCan ?? { step };

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
		level: actLvl,
	};

	return data;
};

const linkData = (_cache, mrks, step) => {
	const linkVal = mrks.reduce((acc, mrk) => {
		const { value } = mrk;
		const markVal = value.slice(1).trim();
		if (LinkMarkers.has(markVal)) {
			acc += LinkMarkers.get(markVal);
		}
		return acc;
	}, 0);

	return { step, markers: linkVal };
};

const setData = (_cache, arcs, step) => {
	const temp = {
		step,
		archetypes: {
			sets: [],
			codes: [],
		},
	};

	// step data for later ref
	const data = arcs.reduce((acc, arc) => {
		const { name: set, value: code } = arc;
		const codeDec = code.match(/\d(?!:)\w+/)[0];

		acc.archetypes.sets.push(set);
		acc.archetypes.codes.push(codeDec);

		return acc;
	}, temp);

	// clean data for db
	const setcode = data.archetypes.codes.reduce((acc, dec) => {
		const num = parseInt(dec);
		return acc += num;
	}, 0);

	data.setcode = setcode;
	return data;
};

// data cache
const dataSteps = new Collection([
	[1, infoData], // id, name, desc
	[2, typeData], // type, race, att
	[3, statData], // atk, def, lvl, lscale, rscale
	[4, linkData], // link markers
	[5, setData], // archetypes
	// [6, strData], // strings
]);

/**
 * Gets the "current" application info from the member's collection.
 *
 * @param {Collection} cache
 * @param {GuildMember} member
 * @returns {Collection}
 */
const getDataCache = (cache, member) => {
	const memInfo = getMemberInfo(cache, member);
	const app = memInfo.appInfo;

	return app?.data;
};

const getStepCache = cacheObject => {
	const { member, cache, step } = cacheObject;
	// return value
	const dataColl = getDataCache(cache, member);
	if (dataColl) {
		const isCard = dataColl.has(step);
		if (isCard) {
			return dataColl.get(step);
		}
	}

	return undefined;
};

const setDataCache = cacheObject => {
	const { member, cache, args, step } = cacheObject;
	const cacheCan = getDataCache(cache, member);

	const stepCache = cacheCan ? getStepCache({ cache, member, step }) : cacheCan;
	const data = dataSteps.get(step)(stepCache, args, step);
	console.log('data', data);
	if (!cacheCan) {
		setAppCache(cache, member);

		const memInfo = getMemberInfo(cache, member);
		const app = memInfo.appInfo;
		const { data: dataColl } = app;

		dataColl.set(step, data);

		return getStepCache({ member, cache, step });
	}

	cacheCan.set(step, data);

	return getStepCache({ member, cache, step });
};

// db cache
const regInfo = (data, current) => {
	const { step, name, id, temp } = data;

	const { cardPEff, cardDesc } = temp;
	const pendy = cardPEff != '' ? true : false;

	const { temp: rest } = current;
	const cardOne = { ...current,
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

	return cardOne;
};

const regTypes = (data, current) => {
	const { step, race, type, attribute } = data;
	const [truType, isLink] = type;

	const { temp: rest } = current;
	const cardTwo = { ...current,
		race,
		type: truType,
		attribute,
		temp: {
			...rest,
			stepNo: step,
			isLink,
		},
	};

	return cardTwo;
};

const regStats = (data, current) => {
	const { step, atk, def, level } = data;

	const { temp: rest } = current;
	const cardThree = { ...current,
		atk,
		def,
		level,
		temp: {
			...rest,
			stepNo: step,
		},
	};

	return cardThree;
};

const regMarkers = (data, current) => {
	const { step, markers: def } = data;
	console.log('registering markers', def);

	const { temp: rest } = current;
	const cardFour = { ...current,
		def,
		temp: {
			...rest,
			stepNo: step,
		},
	};

	return cardFour;
};

const regArcs = (data, current) => {
	const { step, setcode } = data;

	const { temp: rest } = current;
	const cardFive = { ...current,
		setcode,
		temp: {
			...rest,
			stepNo: step,
		},
	};

	return cardFive;
};

// card cache
const cacheSteps = new Collection([
	[1, regInfo],
	[2, regTypes],
	[3, regStats],
	[4, regMarkers],
	[5, regArcs],
	// [6, regStrs],
]);

const getCardCache = (cache, member) => {
	const memInfo = getMemberInfo(cache, member);
	const app = memInfo.appInfo;

	return app?.card;
};

const setCardCache = (cache, member) => {
	const cardCache = getCardCache(cache, member);
	const coll = getDataCache(cache, member);

	const data = coll.last();
	const card = cacheSteps.get(data.step)(data, cardCache);

	const memInfo = getMemberInfo(cache, member);
	const { apps, current } = memInfo;
	const app = memInfo.appInfo;

	apps.set(current, { ...app, card });

	return getCardCache(cache, member);
};

const clearCardCache = (cache, member) => {
	const memInfo = getMemberInfo(cache, member);
	const { apps, current } = memInfo;

	if (current > 1) {
		apps.delete(current);

		const memberInfo = getMemberInfo(cache, member);
		memberInfo.currentOf = memberInfo.apps.size;
	}

	return apps.delete(current);
};

// cache page info
const getPageInfo = (cache, member) => {
	const memInfo = getMemberInfo(cache, member);
	const app = memInfo.appInfo;

	return app?.page;
};

module.exports = {
	setDataCache,
	getDataCache,
	getStepCache,
	setCardCache,
	getCardCache,
	getMemberInfo,
	getPageInfo,
	clearCardCache,
};