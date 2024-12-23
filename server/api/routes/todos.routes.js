const Router = require("express").Router;
const TodosController = require("../controller/todos.controller.js");

const TodosRouter = Router();

TodosRouter.get("/", TodosController.getAllTodos);
TodosRouter.get("/:id", TodosController.getTodo);
TodosRouter.post("/", TodosController.postTodo);
TodosRouter.patch("/:id", TodosController.patchTodo);
TodosRouter.delete("/:id", TodosController.deleteTodo);
TodosRouter.delete("/", TodosController.deleteAllTodos);

module.exports = TodosRouter;
