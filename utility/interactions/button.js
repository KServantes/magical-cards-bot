const Create = require('@commands/create');

const isButton = interaction => {
	return interaction.isButton();
};

const interactionButton = async (interaction) => {

	const { customId } = interaction;

	Create.button.forEach((fun, key) => {
		if (customId === key) {
			fun(interaction);
		}
	});

};

module.exports = {
	name: 'button',
	type: isButton,
	interact: interactionButton,
};