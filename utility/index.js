// Deploying cards here for some reason
require('./deploy-commands');

// The actual utility
const fs = require('node:fs');
const path = require('node:path');
const { Collection } = require('discord.js');

const addCollections = client => {
	client.commands = new Collection();
	client.interactions = new Collection();
	const commandsPath = path.join(__dirname, '../commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		client.commands.set(command.data.name, command);
	}

	const interactPath = path.join(__dirname, '../interactions');
	const interactFiles = fs.readdirSync(interactPath).filter(file => file.endsWith('.js'));

	for (const file of interactFiles) {
		const filePath = path.join(interactPath, file);
		const interaction = require(filePath);
		client.interactions.set(interaction.name, interaction);
	}
};

module.exports = { addCollections };