const getCardExtra = (database, id) => {
	return database('texts')
		.where('id', id)
		.first();
};

const addCardExtra = (database, card) => {
	database('texts')
		.insert(card);
	database('datas')
		.insert({ id: card.id });
	return ;
};

module.exports = {
	getCardExtra,
	addCardExtra,
};