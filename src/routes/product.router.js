import { Router } from "express";
import { addProduct, deleteProduct, getProduct, updateProduct } from "../controllers/product.controller.js";
import verifyJwt from "../middleware/user.middleware.js";


const router = Router()

router.route("/add").post(verifyJwt,addProduct)
router.route("/get").get(getProduct)
router.route("/delete/:id").delete(verifyJwt,deleteProduct)
router.route("/update").post(updateProduct)

export default router