/* eslint-disable no-inline-comments */
const { Collection, GuildMember, EmbedField } = require('discord.js');
const { Races, Types, Attributes, Archetypes, LinkMarkers } = require('./constants');
const { CardCache, MemberInfo, PageInfo, ServerInfo, CardApp, StepData,
	ClientCache, MemberCache, StepsColl, InfoFormData, StepDataInfo, StepDataType,
	StepDataStats, CacheObject,
} = require('./types');


const CACHE_MEMBER = 'member cache';

// general structure of the
// card object injected into db
/**
 * @type {CardCache}
 */
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

/**
 * @type {PageInfo}
 */
const pageInfo = {
	page: 1,
	set: Archetypes,
	prefill: false,
	wipe: false,
	// sets: ['tcg', 'anime', 'custom'],
	/**
	 * @param {string} set Set name in collection to use (e.g. 'tcg', 'anime', 'custom')
	 */
	set switchSet(set) {
		this.set = setColl.get(set);
	},
	/**
	 * @param {number} p Number of the page to set
	 */
	set pageOf(p) {
		this.page = p;
	},
};

/**
 * Create member info object.
 * @param {GuildMember} member Member to be cached.
 * @returns {MemberInfo} Member object.
 */
const createMemberInfo = member => {
	const { nickname, user } = member;
	const { username, avatar } = user;

	/**
	 * @type {MemberInfo}
	 */
	const memberInfo = {
		name: nickname ?? username,
		avatar,
		iconURL: user.displayAvatarURL({ dynamic: true }),
		username,
		preview: true,
		apps: new Collection(),
		current: 1,
		/**
		 * @param {number} x Current app index.
		 */
		set currentOf(x) {
			this.current = x;
		},
		/**
		 * @param {boolean} bool Show card preview or not.
		 */
		set showPreview(bool) {
			this.preview = bool;
		},
		/**
		 * @param {CardApp} data App info for the current card
		 */
		set newApp(data) {
			this.apps.set(this.current, data);
		},
		/**
		 * @readonly
		 * @returns {CardApp} App info for the current card
		 */
		get appInfo() {
			return this.apps.get(this.current);
		},
	};

	return memberInfo;
};

/**
 * @param {ClientCache} cache Global cache collection
 * @returns {MemberCache} Member cache collection
 */
const getMemberCache = cache => {
	if (!cache.get(CACHE_MEMBER)) {
		/**
		 * @type {MemberCache}
		 */
		const Members = new Collection();

		const memCache = cache.set(CACHE_MEMBER, Members);
		return memCache;
	}

	return cache.get(CACHE_MEMBER);
};

/**
 * @param {ClientCache} cache Global cache collection
 * @param {GuildMember} member Guild Member to be cached
 * @returns {MemberInfo} Member's info object
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
 * @param {ClientCache} cache Global cache collection
 * @param {GuildMember} member Guild Member to be cached
 * @returns {MemberInfo} Member's info object
 */
const setMemberInfo = (cache, member) => {
	const memberInfo = createMemberInfo(member);

	const memberCache = getMemberCache(cache, member);

	const memberColl = memberCache.set(member.id, memberInfo);
	const memInfo = memberColl.get(member.id);

	return memInfo;
};

/**
 * @param {ClientCache} cache Global cache collection
 * @param {GuildMember} member Guild Member to be cached
 * @returns {CardApp} Card app object
 */
const createCardApp = (cache, member) => {
	const { id, name, icon, preferredLocale: locale } = member.guild;

	const memInfo = getMemberInfo(cache, member);
	/**
	 * @type {ServerInfo}
	 */
	const serverInfo = {
		id,
		name,
		icon,
		locale,
	};

	const Data = new Collection();
	/**
	 * @type {StepsColl}
	 */
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
 * @param {ClientCache} [_cache] Global Cache Object
 * @param {InfoFormData} card Member input data from the Info Form
 * @param {number} step Current step number
 * @returns {StepDataInfo} Step One Data Object
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
/**
 * @param {EmbedField} field Race field
 * @returns {number} Value from the embed field or 777 (if none)
 */
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
/**
 * @param {EmbedField} field Type field
 * @returns {number} Value from the embed field or 777 (if none)
 */
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
/**
 * @param {EmbedField} field Attribute field
 * @returns {number} Value from the embed field or 777 (if none)
 */
const attVal = (field) => {
	const { value: att } = field;
	let attrVal = 0;

	Attributes.forEach((v, a) => {
		if (a.includes(att)) {
			return attrVal += v;
		}
	});

	if (attrVal === 0) return 777;
	return attrVal;
};

/**
 * @param {undefined | StepDataType} cacheCan recursive data object
 * @param {EmbedField} field Embed Field
 * @param {number} step Current Step
 * @returns {StepDataType} If any of the values collection evals to 0 it becomes 777 for an error :shrug:
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

/**
 * Stats Data Function
 *
 * Converts Embed Field values to numbers
 *
 * Currently supports everything up to Links
 * @param {ClientCache} cache Global Cache Collection
 * @param {EmbedField[]} stats Stats array ordered: [atk, lvl, def, lscale, rscale]
 * @param {number} step Current Step (3)
 * @returns {StepDataStats} The appropriate values for the stats
 */
const statData = (cache, stats, step) => {
	console.log('data step 3', cache);
	const [ atk, lvl] = stats;

	let actDef = 0;
	let actLvl = parseInt(lvl.value);

	if (stats.length > 2) {
		const [ ,, def] = stats;
		actDef = parseInt(def.value);
	}

	/**
	 * @todo Needs support for "many" archetype codes
	 * @example 0x2073 Xyz Dragon | 0x73 Xyz
	 */
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
 * @param {ClientCache} cache Global Cache Collection
 * @param {GuildMember} member Guild Member
 * @returns {StepsColl} Steps Collection
 */
const getDataCache = (cache, member) => {
	const memInfo = getMemberInfo(cache, member);
	const app = memInfo.appInfo;

	return app?.data;
};

/**
 * @param {CacheObject} cacheObject User input object cache
 * @returns {StepData|undefined} Step Data (or undefined, if not found)
 */
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

/**
 * Registers member input "data" into the {@link StepsColl} Collection
 *
 * Returns the data back inside of the {@link StepData} object
 * @param {CacheObject} cacheObject cache object to be cached
 * @returns {StepData|undefined} The current step's data object
 */
const setDataCache = cacheObject => {
	const { member, cache, args, step } = cacheObject;
	const cacheCan = getDataCache(cache, member);

	// Checks that StepsColl is currently existing
	const stepCache = cacheCan ? getStepCache({ cache, member, step }) : cacheCan;
	const data = dataSteps.get(step)(stepCache, args, step);
	console.log('data', data);
	if (!cacheCan) {
		createCardApp(cache, member);

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

/**
 * @param {ClientCache} cache Global Cache Collection
 * @param {GuildMember} member Guild Member
 * @returns {CardCache} The current card cache object
 */
const getCardCache = (cache, member) => {
	const memInfo = getMemberInfo(cache, member);
	const app = memInfo.appInfo;

	return app?.card;
};

/**
 * @param {ClientCache} cache Global Cache Collection
 * @param {GuildMember} member Guild Member
 * @returns {CardCache} The current card cache object
 */
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