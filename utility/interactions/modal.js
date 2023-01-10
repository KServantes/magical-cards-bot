const Create = require('../../commands/create/index');

const isModalSubmit = interaction => {
	return interaction.isModalSubmit();
};

const interactionModalSubmit = async (interaction) => {
	Create.modalSubmit.forEach((fun, key) => {
		if (interaction.customId === key) fun(interaction);
	});
};

module.exports = {
	name: 'modal',
	type: isModalSubmit,
	interact: interactionModalSubmit,
};