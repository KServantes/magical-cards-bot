const { Events, ActivityType } = require('discord.js')
const { Watching } = ActivityType;
const { ClientReady } = Events;

module.exports = {
    name: ClientReady,
    once: true,
    execute(client) {
        client.user.setActivity('out for floodgates', {type: Watching});
        console.log('Magical Cards');
    }
}