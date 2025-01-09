import express from "express";
import { getAlbum, getAllAlbums } from "../controllers/album.controller.js";

const router = express.Router();

router.get("/", getAllAlbums);
router.get("/:id", getAlbum);

export default router;
