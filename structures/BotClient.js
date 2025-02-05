const { Client, Events, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { Guilds, GuildMessages, GuildMessageReactions } = GatewayIntentBits;
const { Message, ThreadMember } = Partials;

const { BOT_EVENTS_PATH, BOT_COMMANDS_PATH, BOT_INTERACTIONS_PATH } = require('@constants');
const { CommandCollection, InteractionCollection, GlobalCache } = require('@types')

const fs = require('node:fs');
const path = require('node:path');

module.exports = class BotClient extends Client {
    constructor() {
        super({
            intents: [Guilds, GuildMessages, GuildMessageReactions],
            partials: [Message, ThreadMember]
        })
        /** @type {CommandCollection} */
        this.commands = new Collection();
        /** @type {InteractionCollection} */
        this.interactions = new Collection();
        /** @type {GlobalCache} */
        this.cache = new Collection();
    }
    
    loadEvents() {
        const eventsPath = BOT_EVENTS_PATH
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js') && !file.startsWith('index'));

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            /** @type { Events } */
            const event = require(filePath);
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args));
            } else {
                this.on(event.name, (...args) => event.execute(...args));
            }
        }
    }

    loadCollections() {
        const commandsPath = BOT_COMMANDS_PATH
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            this.commands.set(command.data.name, command);
        }
    
        const interactPath = BOT_INTERACTIONS_PATH
        const interactFiles = fs.readdirSync(interactPath).filter(file => file.endsWith('.js'));
    
        for (const file of interactFiles) {
            const filePath = path.join(interactPath, file);
            const interaction = require(filePath);
            this.interactions.set(interaction.name, interaction);
        }
    }
};