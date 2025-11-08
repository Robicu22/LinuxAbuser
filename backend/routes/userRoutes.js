import { Route } from "react-router-dom";
import express from "express";
import { createUser, loginUser, getUsers } from "../controller/userController.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/users", getUsers);

export default router;