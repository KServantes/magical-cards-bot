const db = require('../dbConfig');

const BOT_DEFAULT_PASS = 807945500;
const BOT_DEFAULT_RNG = BOT_DEFAULT_PASS + 500;

const addCard = card => {
	return db('cards').insert(card)
		.then(([id]) => getCard(id));
};

const getCard = card_id => {
	return db('cards')
		.where('id', card_id)
		.first();
};

const checkCard = () => {
	return db('cards')
		.whereBetween('id',
			[BOT_DEFAULT_PASS, BOT_DEFAULT_RNG],
		);
};

const addMember = member => {
	return db('members').insert(member)
		.then(([id]) => getMember(id));
};

const getMember = member_id => {
	return db('members')
		.where('id', member_id)
		.first();
};

const addMemCard = memCard => {
	return db('member_cards').insert(memCard);
};

const getMemCards = memID => {
	return db('member_cards as mc')
		.where('mc.member_id', memID)
		.select('mc.*', 'c.*')
		.leftJoin('cards as c', 'mc.card_id', 'c.id');
};

const addCardToBase = async (member, card) => {
	try {
		// Add card to DB
		const oldCard = await getCard(card.id);
		if (oldCard) return { error: 'This card already exists!' };
		const dbCard = await addCard(card);

		// Add member to DB if new
		const { id: memID, displayName } = member;
		const oldMember = await getMember(memID);
		if (!oldMember) {
			await addMember({ id: memID, name: displayName });
		}

		// Add to card to member relationship
		await addMemCard({ member_id: memID, card_id: dbCard.id });
		return dbCard;
	}
	catch (err) {
		console.log(err);
		return { ...err, error: 'Database error.' };
	}
};

module.exports = {
	addCardToBase,
	getMemCards,
	checkCard,
	BOT_DEFAULT_PASS,
};