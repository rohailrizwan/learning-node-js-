import { Router } from "express";
import { addTodo, deleteTodo, getTodo, updateTodo } from "../controllers/todo.controller.js";
import verifyJwt from "../middleware/user.middleware.js";

const router=Router()

router.route("/add").post(verifyJwt,addTodo)
router.route("/get").get(verifyJwt,getTodo)
router.route("/delete/:id").delete(verifyJwt,deleteTodo)
router.route("/update/:id").put(verifyJwt,updateTodo)

export default router