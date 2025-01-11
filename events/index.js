const fs = require('node:fs');
const path = require('node:path');

const eventFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && !file.startsWith('index'));

module.exports = client => {
    for (const file of eventFiles) {
        const filePath = path.join(__dirname, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
};