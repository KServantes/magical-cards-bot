const commonConfig = {
	client: 'better-sqlite3',
	useNullAsDefault: true,
	migrations: { directory: './data/migrations' },
};

module.exports = {

	development: {
		...commonConfig,
		connection: {
			filename: './data/magicbot.cdb',
		},
	},

};
