const Cards = require('../data/models');

const isAutocomplete = interaction => {
	return interaction.isAutocomplete();
};

const interactionAutocomplete = async interaction => {
	if (interaction.commandName === 'library') {
		const focus = interaction.options.getFocused();
		const servID = interaction.guild.id;
		const dbCards = await Cards.getServerCards(servID);

		const cards = dbCards.reduce((acc, card) => {
			const { name } = card;
			return acc.concat(name);
		}, []);

		const rem = cards.filter(choice => choice.startsWith(focus));

		await interaction.respond(rem.map(choice => ({ name: choice, value: choice })));
	}
};

module.exports = {
	name: 'autocomplete',
	type: isAutocomplete,
	interact: interactionAutocomplete,
};