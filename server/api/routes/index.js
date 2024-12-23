const Router = require("express").Router;
const TodosRouter = require("./todos.routes.js");

const MainRouter = Router();

MainRouter.use("/todos", require("./todos.routes.js"));

module.exports = MainRouter;
