const Cards = require('../../data/models');
const Cache = require('./cache');


const setPageInfo = cacheObject => {
	const { cache, member, cards } = cacheObject;

	const memInfo = Cache.getMemberInfo(cache, member);
	const { page } = memInfo;

	if (memInfo && page !== 1) {
		const end = page * 10;
		const start = end / 10;
		const pageCards = cards.slice(start, end);
		const paged = pageCards.reduce((acc, card) => {
			const { id, name } = card;

			return acc.push({ id, name });
		}, []);
		memInfo.pageInfo = paged;
	}
	else {
		const fpage = cards.slice(0, 10);
		const paged = fpage.reduce((acc, card) => {
			const { id, name } = card;

			return acc.concat({ id, name });
		}, []);
		memInfo.pageInfo = paged;
	}
};

const getEmbedMsg = async cacheObject => {
	const { cache, member } = cacheObject;

	const cards = await Cards.getAllCards();
	const servers = await Cards.getAllServers();

	const cardCount = cards.length;
	const servCount = servers.length;
	const maxPage = Math.ceil(cards.length / 10);

	const memInfo = Cache.getMemberInfo(cache, member);
	const { select } = memInfo;

	const extraS = count => count > 1 ? 's' : '';
	const msg = `I have a total of ${cardCount} card${extraS(cardCount)} in ${servCount} server${extraS(servCount)}.`;

	const descStrings = memInfo.pageInfo.reduce((acc, card) => {
		const stringAs = `[${card.id}] - ${card.name} `;
		return acc.concat(stringAs);
	}, []);

	const desc = descStrings.reduce((acc, str, i) => {
		let format = `[${i + 1}] | ` + str;
		if (i === select) {
			format = `**${format}**`;
		}

		return acc + `${format} \n`;
	}, '');

	return { maxPage,
		msg: '>>> ' + msg + '\n\n' + desc,
	};
};

module.exports = {
	setPageInfo,
	getEmbedMsg,
};
