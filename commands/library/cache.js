const { Collection } = require('discord.js');

const CACHE_LIBRARY = 'library cache';

const getLibraryCache = cache => {
	const libCache = cache.get(CACHE_LIBRARY);
	if (!libCache) {
		const Library = new Collection();

		const newCache = cache.set(CACHE_LIBRARY, Library);
		return newCache;
	}

	return libCache;
};

const setMemberInfo = (cache, member) => {
	const memberInfo = {
		page: 1,
		pageInfo: [],
		select: 10,
		details: false,
		/**
		 * @param {number} n
		 */
		set selectOn(n) {
			this.select = n;
		},
		get cardInfo() {
			return this.pageInfo[this.select];
		},
		/**
		 * @param {number} n
		 */
		set newPage(n) {
			this.page = this.page + n;
		},
	};

	const libraryCache = getLibraryCache(cache, member);

	const memberColl = libraryCache.set(member.id, memberInfo);
	const memInfo = memberColl.get(member.id);

	return memInfo;
};

const getMemberInfo = (cache, member) => {
	const libraryCache = getLibraryCache(cache);
	const info = libraryCache.get(member.id);

	if (!info) {
		const newInfo = setMemberInfo(cache, member);

		return newInfo;
	}

	return info;
};

module.exports = {
	getLibraryCache,
	getMemberInfo,
};