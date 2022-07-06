exports.up = async function(knex) {
	await knex.schema
		.createTable('members', table => {
			table.integer('id', 20);
			table.string('name', 200).notNullable();
		});
};

exports.down = async function(knex) {
	await knex.schema
		.dropTableIfExists('members');
};
