const { Collection } = require("discord.js");

const { UID_DELETE_ALL } = require('@constants');

const { buttonDeleteAll } = require('@commands/admin/interacts/buttons');

const interactButton = new Collection([
    [UID_DELETE_ALL, buttonDeleteAll]
]);

module.exports = { button: interactButton };