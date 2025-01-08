import express from "express";
import { authCallback } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/callback", authCallback);

export default router;
