exports.up = function (knex) {
	return knex.schema.createTable("users", function (table) {
		table
			.uuid("uuid")
			.defaultTo(knex.raw("gen_random_uuid()"))
			.primary()
			.unique();
		table.string("username").unique();
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("users");
};
