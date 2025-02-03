const { Collection } = require('discord.js');
const { buttonStart, buttonHalt, buttonStartThread } = require('./interacts/buttons');

const { UID_START, UID_HALT, UID_START_THREAD } = require('@constants');

const interactButton = new Collection([
    [UID_START, buttonStart],
    [UID_HALT, buttonHalt],
    [UID_START_THREAD, buttonStartThread]
 ]);

module.exports = { button: interactButton };