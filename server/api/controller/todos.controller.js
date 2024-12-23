const _ = require("lodash");
const knex = require("../../database/connection.js");

function createToDo(req, data) {
	const protocol = req.protocol,
		host = req.get("host"),
		id = data.id;

	return {
		title: data.title,
		order: data.order,
		completed: data.completed || false,
		url: `${protocol}://${host}/api/todos/${id}`,
	};
}

async function getAllTodos(req, res) {
	const allEntries = await knex("todos");
	return res.send(allEntries.map(_.curry(createToDo)(req)));
}

async function getTodo(req, res) {
	const id = req.params.id;
	const todo = await knex("todos").where({ id });
	return res.send(todo[0]);
}

async function postTodo(req, res) {
	const { title, order } = req.body;
	const created = await knex("todos").insert({ title, order }).returning("*");
	return res.send(createToDo(req, created[0]));
}

async function patchTodo(req, res) {
	const id = req.params.id;
	const properties = req.body;
	const patched = await knex("todos")
		.where({ id })
		.update({ ...properties })
		.returning("*");
	return res.send(createToDo(req, patched[0]));
}

async function deleteTodo(req, res) {
	const id = req.params.id;
	const deleted = await knex("todos").where({ id }).del().returning("*");
	return res.send(createToDo(req, deleted[0]));
}

async function deleteAllTodos(req, res) {
	const deletedEntries = await knex("todos").del().returning("*");
	return res.send(deletedEntries.map(_.curry(createToDo)(req)));
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
	getAllTodos: {
		method: getAllTodos,
		errorMessage: "Could not fetch all todos",
	},
	getTodo: { method: getTodo, errorMessage: "Could not fetch todo" },
	postTodo: { method: postTodo, errorMessage: "Could not post todo" },
	patchTodo: { method: patchTodo, errorMessage: "Could not patch todo" },
	deleteAllTodos: {
		method: deleteAllTodos,
		errorMessage: "Could not delete all todos",
	},
	deleteTodo: { method: deleteTodo, errorMessage: "Could not delete todo" },
};

for (let route in toExport) {
	toExport[route] = addErrorReporting(
		toExport[route].method,
		toExport[route].errorMessage
	);
}

module.exports = toExport;
