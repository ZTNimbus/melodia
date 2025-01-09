import express from "express";
import {
  getAllSongs,
  getFeaturedSongs,
  getMadeForYou,
  getSong,
  getTrending,
} from "../controllers/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, requireAdmin, getAllSongs);

router.get("/featured", getFeaturedSongs);

router.get("/made-for-you", getMadeForYou);

router.get("/trending", getTrending);

router.get("/:id", getSong);

export default router;
