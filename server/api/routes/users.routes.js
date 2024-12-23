const Router = require("express").Router;
const UsersController = require("../controller/users.controller.js");

const UsersRoutes = Router();

UsersRoutes.get("/", UsersController.getAllUsers);
UsersRoutes.get("/:uuid", UsersController.getUser);
UsersRoutes.post("/", UsersController.postUser);
UsersRoutes.patch("/:uuid", UsersController.patchUser);
UsersRoutes.delete("/:uuid", UsersController.deleteUser);
UsersRoutes.delete("/", UsersController.deleteAllUsers);

module.exports = UsersRoutes;
