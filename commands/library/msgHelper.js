const reactables = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
const homeEmote = '🔙';

const initialMsg = (cards) => {
	const msg = cards.reduce((acc, c, i) => {
		const str = `[${i + 1}] [${c.id}] - ${c.name} \n`;

		return acc.concat(`${str}`);
	}, `Library | Cards: ${cards.length} \n`);

	return formatMsg(msg);
};

const reactionCollection = async msg => {
	const filter = (r, u) => {
		const { name } = r.emoji;
		const reactsBool = reactables.includes(name) || name === homeEmote;
		return reactsBool && u.id != msg.author.id;
	};

	const collection = await msg.awaitReactions({ filter, max: 1, time: 60000 });
	return collection;
};

const formatMsg = msg => {
	return ` \`\`\`${msg}\`\`\` `;
};

const getCardFromReact = (name, cards) => {
	const cardIndex = reactables.indexOf(name);
	const card = cards[cardIndex];
	return card;
};

const reactToMsg = (reply, cards, addBool) => {
	let reactSlice = sliceReactions(cards);

	if (addBool) reactSlice = [homeEmote];
	reactSlice.forEach(async r => {
		await reply.react(r);
	});
};

const sliceReactions = cards => {
	let reactSlice = [];
	if (cards.length < 11) {
		reactSlice = reactables.reduce((acc, r, i) => {
			if (cards[i]) {
				return acc.concat([r]);
			}
			return acc;
		}, []);
	}
	else {
		reactSlice = cards.slice(0, 9);
	}

	return reactSlice;
};

const msgLoop = async (msg, changes, cards) => {
	const reply = await msg.edit(changes);
	const isHomely = reply.reactions.cache.get(homeEmote);
	await reply.reactions.removeAll();
	if (isHomely) {
		reactToMsg(reply, cards);
	}
	else {
		reactToMsg(reply, cards, true);
	}
	const collection = await reactionCollection(reply);
	if (collection.size < 1) return reply.reactions.removeAll();
	const reaction = collection.first();
	const { name } = reaction.emoji;
	if (name === homeEmote) {
		console.log('going home');
		await msgLoop(reply, { content: initialMsg(cards) }, cards);
		return ;
	}
	const card = getCardFromReact(name, cards);
	const msgContent = `Library | Cards: ${cards.length}\n[${card.id}]\n${card.name}\n${card.desc}\n`;
	await msgLoop(reply, { content: formatMsg(msgContent) }, cards);
};

module.exports = {
	reactables,
	homeEmote,
	initialMsg,
	reactionCollection,
	formatMsg,
	msgLoop,
	reactToMsg,
	getCardFromReact,
};
