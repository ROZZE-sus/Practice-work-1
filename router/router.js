import { Router } from "express";
import Authcontroller from "../controller/Authcontroller.js";
import PostController from "../controller/PostController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", Authcontroller.register);
router.post("/login", Authcontroller.login);
router.get("/users", Authcontroller.getAllUser);
router.get("/createRols", Authcontroller.createRols);
router.get("/posts", PostController.getAll);
router.get("/posts/:id", PostController.getOne);
router.post("/posts", authMiddleware, PostController.create);
router.put("/posts/:id", authMiddleware, PostController.update);
router.delete("/posts/:id", authMiddleware, PostController.remove);

export default router;
