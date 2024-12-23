exports.up = function (knex) {
	return knex.schema.table("todos", function (table) {
		table
			.uuid("userId")
			.references("uuid")
			.inTable("users")
			.onUpdate("CASCADE");
	});
};

exports.down = function (knex) {
	return knex.schema.table("todos", function (table) {
		table.dropColumn("userId");
	});
};
