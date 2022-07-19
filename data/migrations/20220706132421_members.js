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
			cards.integer('ot').defaultTo(32);
			cards.integer('alias').defaultTo(0);
			cards.integer('setcode').defaultTo(0);
			cards.integer('type').defaultTo(0);
			cards.integer('atk').defaultTo(0);
			cards.integer('def').defaultTo(0);
			cards.integer('level').defaultTo(0);
			cards.integer('race').defaultTo(0);
			cards.integer('attribute').defaultTo(0);
			cards.integer('category').defaultTo(0);
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
