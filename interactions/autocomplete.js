const Cards = require('../data/models');

const isAutocomplete = interaction => {
	return interaction.isAutocomplete();
};

const interactionAutocomplete = async interaction => {
	if (interaction.commandName === 'library') {
		const { options } = interaction;
		const focus = options.getFocused();
		const userOption = options.get('duelist')?.value ?? 0;
		const servID = interaction.guild.id;
		const dbCards = await Cards.getServerCards(servID);

		const cards = dbCards.reduce((acc, card) => {
			const { name, member_id } = card;
			if (!userOption) return acc.concat(name);
			if (member_id == userOption) {
				return acc.concat(name);
			}
			return acc;
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