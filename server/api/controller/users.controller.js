const knex = require("../../database/connection.js");

async function getAllUsers(req, res) {
	const allEntries = await knex("users");
	return res.send(allEntries);
}

async function getUser(req, res) {
	const uuid = req.params.uuid;
	console.log(uuid);
	const user = await knex("users").where({ uuid });
	return res.send(user[0]);
}

async function postUser(req, res) {
	const { username } = req.body;
	const created = await knex("users").insert({ username }).returning("*");
	return res.send(created[0]);
}

async function patchUser(req, res) {
	const uuid = req.params.uuid;
	const properties = req.body;
	const patched = await knex("users")
		.where({ uuid })
		.update({ ...properties })
		.returning("*");
	return res.send(patched[0]);
}

async function deleteUser(req, res) {
	const uuid = req.params.uuid;
	const deleted = await knex("users").where({ uuid }).del().returning("*");
	return res.send(deleted[0]);
}

async function deleteAllUsers(req, res) {
	const deletedEntries = await knex("users").del().returning("*");
	return res.send(deletedEntries);
}

function addErrorReporting(func, message) {
	return async function (req, res) {
		try {
			return await func(req, res);
		} catch (err) {
			console.log(`${message} caused by: ${err}`);

			// Not always 500, but for simplicity's sake.
			res.status(500).send(`Opps! ${message}.`);
		}
	};
}

const toExport = {
	getAllUsers: {
		method: getAllUsers,
		errorMessage: "Could not fetch all users",
	},
	getUser: { method: getUser, errorMessage: "Could not fetch user" },
	postUser: { method: postUser, errorMessage: "Could not post user" },
	patchUser: { method: patchUser, errorMessage: "Could not patch user" },
	deleteAllUsers: {
		method: deleteAllUsers,
		errorMessage: "Could not delete all users",
	},
	deleteUser: { method: deleteUser, errorMessage: "Could not delete user" },
};

for (let route in toExport) {
	toExport[route] = addErrorReporting(
		toExport[route].method,
		toExport[route].errorMessage
	);
}

module.exports = toExport;
