exports.up = async knex => {
	await knex.schema
		.createTable('members', members => {
			members.integer('id').primary();
			members.string('name', 200).notNullable();
			members.string('avatar');
		});
	await knex.schema
		.createTable('servers', servers => {
			servers.integer('id').primary();
			servers.string('name');
			servers.string('icon');
			servers.string('locale');
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
		.createTable('strings', strings => {
			strings.integer('id').primary();
			strings.integer('card_id')
				.references('id')
				.inTable('cards')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
			strings.text('str1').defaultTo(' ');
			strings.text('str2').defaultTo(' ');
			strings.text('str3').defaultTo(' ');
			strings.text('str4').defaultTo(' ');
			strings.text('str5').defaultTo(' ');
			strings.text('str6').defaultTo(' ');
			strings.text('str7').defaultTo(' ');
			strings.text('str8').defaultTo(' ');
			strings.text('str9').defaultTo(' ');
			strings.text('str10').defaultTo(' ');
			strings.text('str11').defaultTo(' ');
			strings.text('str12').defaultTo(' ');
			strings.text('str13').defaultTo(' ');
			strings.text('str14').defaultTo(' ');
			strings.text('str15').defaultTo(' ');
			strings.text('str16').defaultTo(' ');
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
	await knex.schema
		.createTable('server_members', ser_cards => {
			ser_cards.increments();
			ser_cards.integer('server_id')
				.references('id')
				.inTable('servers')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
			ser_cards.integer('member_id')
				.references('id')
				.inTable('members')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
		});
};

exports.down = async knex => {
	await knex.schema
		.dropTableIfExists('server_members')
		.dropTableIfExists('member_cards')
		.dropTableIfExists('strings')
		.dropTableIfExists('cards')
		.dropTableIfExists('servers')
		.dropTableIfExists('members');
};