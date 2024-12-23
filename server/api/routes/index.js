const Router = require("express").Router;
const TodosRouter = require("./todos.routes.js");
const UsersRoutes = require("./users.routes.js");

const MainRouter = Router();

MainRouter.use("/todos", TodosRouter);
MainRouter.use("/users", UsersRoutes);

module.exports = MainRouter;
