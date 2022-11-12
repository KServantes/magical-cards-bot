const getCard = (db, id) => {
	return db('texts')
		.where('id', id)
		.first();
};

const addText = (db, card) => {
	return db('texts')
		.insert(card);
};

const addData = (db, card) => {
	return db('datas')
		.insert(card);
};

const checkCard = async args => {
	const { db, id, newCard } = args;
	// eslint-disable-next-line no-unused-vars
	const { name, desc, member_id, card_id, ...rest } = newCard;

	try {
		const card = await getCard(db, id);
		if (!card) return 0;
		let flag = true;
		for (const [p, v] of Object.entries({ ...rest })) {
			if (card[p] !== v) flag = false;
		}

		return flag;
	}
	catch (error) {
		console.log('error', error);
		return 0;
	}

};

const addCard = async (db, card) => {
	// todo strings
	// eslint-disable-next-line no-unused-vars
	const { id, name, desc, member_id, card_id, ...rest } = card;

	const text = await addText(db, { name, desc });
	const data = await addData(db, { ...rest });

	return { text, data };
};

module.exports = {
	checkCard,
	addCard,
};