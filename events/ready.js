const { Events, ActivityType, Client } = require('discord.js')
const { Watching } = ActivityType;
const { ClientReady } = Events;

module.exports = {
    name: ClientReady,
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    execute(client) {
        client.user.setActivity('out for floodgates', {type: Watching});
        console.log('Magical Cards');
    }
};