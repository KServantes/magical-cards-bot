const Create = require('../commands/create/index');

const isSelectMenu = interaction => {
	return interaction.isSelectMenu();
};

const interactionSelectMenu = async interaction => {
	Create.selectMenu.forEach((fun, key) => {
		if (interaction.customId === key) fun(interaction);
	});
};

module.exports = {
	name: 'selectMenu',
	type: isSelectMenu,
	interact: interactionSelectMenu,
};