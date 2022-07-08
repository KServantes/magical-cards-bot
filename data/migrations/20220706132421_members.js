exports.up = async knex => {
	await knex.schema
		.createTable('members', members => {
			members.integer('id').primary();
			members.string('name', 200).notNullable();
		});
	await knex.schema
		.createTable('cards', cards => {
			cards.integer('id').primary();
			cards.string('name').notNullable();
			cards.string('desc');
		});
	await knex.schema
		.createTable('member_cards', memcards => {
			memcards.increments();
			memcards.integer('member_id')
				.references('id')
				.inTable('members')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
			memcards.integer('card_id')
				.references('id')
				.inTable('cards')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
		});
};

exports.down = async knex => {
	await knex.schema
		.dropTableIfExists('member_cards')
		.dropTableIfExists('cards')
		.dropTableIfExists('members');
};
