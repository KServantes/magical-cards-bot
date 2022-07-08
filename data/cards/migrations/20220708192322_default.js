exports.up = async knex => {
	await knex.schema
		.createTable('datas', datas => {
			datas.integer('id').primary();
			datas.integer('ot').defaultTo(32);
			datas.integer('alias').defaultTo(0);
			datas.integer('setcode').defaultTo(0);
			datas.integer('type').defaultTo(0);
			datas.integer('atk').defaultTo(0);
			datas.integer('def').defaultTo(0);
			datas.integer('level').defaultTo(0);
			datas.integer('race').defaultTo(0);
			datas.integer('attribute').defaultTo(0);
			datas.integer('category').defaultTo(0);
		});
	await knex.schema
		.createTable('texts', texts => {
			texts.integer('id').primary();
			texts.text('name').defaultTo(' ');
			texts.text('desc').defaultTo(' ');
			texts.text('str1').defaultTo(' ');
			texts.text('str2').defaultTo(' ');
			texts.text('str3').defaultTo(' ');
			texts.text('str4').defaultTo(' ');
			texts.text('str5').defaultTo(' ');
			texts.text('str6').defaultTo(' ');
			texts.text('str7').defaultTo(' ');
			texts.text('str8').defaultTo(' ');
			texts.text('str9').defaultTo(' ');
			texts.text('str10').defaultTo(' ');
			texts.text('str11').defaultTo(' ');
			texts.text('str12').defaultTo(' ');
			texts.text('str13').defaultTo(' ');
			texts.text('str14').defaultTo(' ');
			texts.text('str15').defaultTo(' ');
			texts.text('str16').defaultTo(' ');
		});
};

exports.down = async knex => {
	await knex.schema
		.dropTableIfExists('texts')
		.dropTableIfExists('datas');
};
